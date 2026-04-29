const { createFocus, extractDomain, applyFocus, clearFocus, describeFocus } = require('./focuser');

describe('createFocus', () => {
  it('creates a focus object with defaults', () => {
    const f = createFocus('s1');
    expect(f.sessionId).toBe('s1');
    expect(f.allowedDomains).toEqual([]);
    expect(f.allowedTags).toEqual([]);
    expect(f.active).toBe(true);
    expect(f.createdAt).toBeDefined();
  });

  it('normalizes domains and tags to lowercase', () => {
    const f = createFocus('s1', ['GitHub.com', 'REDDIT.com'], ['Work', 'DEV']);
    expect(f.allowedDomains).toEqual(['github.com', 'reddit.com']);
    expect(f.allowedTags).toEqual(['work', 'dev']);
  });

  it('throws if sessionId is missing', () => {
    expect(() => createFocus()).toThrow('sessionId is required');
  });
});

describe('extractDomain', () => {
  it('extracts hostname without www', () => {
    expect(extractDomain('https://www.github.com/user')).toBe('github.com');
    expect(extractDomain('https://reddit.com/r/node')).toBe('reddit.com');
  });

  it('returns empty string for invalid url', () => {
    expect(extractDomain('not-a-url')).toBe('');
  });
});

describe('applyFocus', () => {
  const session = {
    tabs: [
      { url: 'https://github.com/foo', tags: ['dev'] },
      { url: 'https://youtube.com/watch', tags: ['entertainment'] },
      { url: 'https://docs.google.com/doc', tags: ['work'] },
    ],
  };

  it('returns all tabs when focus is inactive', () => {
    const f = clearFocus(createFocus('s1', ['github.com']));
    expect(applyFocus(session, f)).toHaveLength(3);
  });

  it('filters by domain', () => {
    const f = createFocus('s1', ['github.com']);
    const result = applyFocus(session, f);
    expect(result).toHaveLength(1);
    expect(result[0].url).toContain('github.com');
  });

  it('filters by tag', () => {
    const f = createFocus('s1', [], ['work']);
    const result = applyFocus(session, f);
    expect(result).toHaveLength(1);
    expect(result[0].tags).toContain('work');
  });

  it('includes tab matching either domain or tag', () => {
    const f = createFocus('s1', ['github.com'], ['entertainment']);
    const result = applyFocus(session, f);
    expect(result).toHaveLength(2);
  });

  it('returns empty array when nothing matches', () => {
    const f = createFocus('s1', ['example.com'], ['nonexistent']);
    expect(applyFocus(session, f)).toHaveLength(0);
  });
});

describe('describeFocus', () => {
  it('describes domains and tags', () => {
    const f = createFocus('s1', ['github.com'], ['dev']);
    expect(describeFocus(f)).toBe('domains: github.com | tags: dev');
  });

  it('returns no restrictions when empty', () => {
    const f = createFocus('s1');
    expect(describeFocus(f)).toBe('no restrictions');
  });
});

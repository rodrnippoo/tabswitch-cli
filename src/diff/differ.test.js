const { diffSessions, normalizeUrl, hasDiff, summarizeDiff, applyDiff } = require('./differ');

describe('normalizeUrl', () => {
  it('strips query params and normalizes', () => {
    expect(normalizeUrl('https://example.com/page?q=1')).toBe('https://example.com/page');
  });

  it('handles invalid urls gracefully', () => {
    expect(normalizeUrl('  HELLO  ')).toBe('hello');
  });
});

describe('diffSessions', () => {
  const sessionA = { name: 'a', urls: ['https://example.com/', 'https://foo.com/bar'] };
  const sessionB = { name: 'b', urls: ['https://example.com/', 'https://new.com/page'] };

  it('identifies added URLs', () => {
    const result = diffSessions(sessionA, sessionB);
    expect(result.added).toContain('https://new.com/page');
  });

  it('identifies removed URLs', () => {
    const result = diffSessions(sessionA, sessionB);
    expect(result.removed).toContain('https://foo.com/bar');
  });

  it('identifies unchanged URLs', () => {
    const result = diffSessions(sessionA, sessionB);
    expect(result.unchanged).toContain('https://example.com/');
  });

  it('returns empty diff for identical sessions', () => {
    const result = diffSessions(sessionA, sessionA);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
  });
});

describe('hasDiff', () => {
  it('returns true when there are changes', () => {
    expect(hasDiff({ added: ['x'], removed: [], unchanged: [] })).toBe(true);
  });

  it('returns false when no changes', () => {
    expect(hasDiff({ added: [], removed: [], unchanged: ['x'] })).toBe(false);
  });
});

describe('summarizeDiff', () => {
  it('summarizes correctly', () => {
    const summary = summarizeDiff({ added: ['a', 'b'], removed: ['c'], unchanged: ['d'] });
    expect(summary).toBe('+2 added, -1 removed, 1 unchanged');
  });

  it('returns no changes when empty', () => {
    expect(summarizeDiff({ added: [], removed: [], unchanged: [] })).toBe('no changes');
  });
});

describe('applyDiff', () => {
  it('applies added and removed to session', () => {
    const session = { name: 'a', urls: ['https://example.com/'] };
    const diff = { added: ['https://new.com/'], removed: ['https://example.com/'] };
    const result = applyDiff(session, diff);
    expect(result.urls).toContain('https://new.com/');
    expect(result.urls).not.toContain('https://example.com/');
  });
});

const {
  areDuplicateUrls,
  findDuplicatesInSession,
  findDuplicatesAcrossSessions,
  deduplicateSession,
} = require('./duplicate-detector');

describe('areDuplicateUrls', () => {
  it('returns true for identical URLs', () => {
    expect(areDuplicateUrls('https://example.com', 'https://example.com')).toBe(true);
  });

  it('returns true ignoring trailing slash', () => {
    expect(areDuplicateUrls('https://example.com/', 'https://example.com')).toBe(true);
  });

  it('returns true ignoring case', () => {
    expect(areDuplicateUrls('https://Example.COM', 'https://example.com')).toBe(true);
  });

  it('returns false for different URLs', () => {
    expect(areDuplicateUrls('https://example.com', 'https://other.com')).toBe(false);
  });
});

describe('findDuplicatesInSession', () => {
  it('returns empty array when no duplicates', () => {
    const session = { tabs: ['https://a.com', 'https://b.com'] };
    expect(findDuplicatesInSession(session)).toEqual([]);
  });

  it('detects duplicate URLs', () => {
    const session = { tabs: ['https://a.com', 'https://b.com', 'https://a.com'] };
    const result = findDuplicatesInSession(session);
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://a.com');
    expect(result[0].indices).toEqual([0, 2]);
  });

  it('handles empty tabs array', () => {
    expect(findDuplicatesInSession({ tabs: [] })).toEqual([]);
  });
});

describe('findDuplicatesAcrossSessions', () => {
  it('returns only sessions with duplicates', () => {
    const sessions = {
      clean: { tabs: ['https://a.com', 'https://b.com'] },
      dirty: { tabs: ['https://x.com', 'https://x.com'] },
    };
    const result = findDuplicatesAcrossSessions(sessions);
    expect(result).not.toHaveProperty('clean');
    expect(result).toHaveProperty('dirty');
    expect(result.dirty).toHaveLength(1);
  });
});

describe('deduplicateSession', () => {
  it('removes duplicate URLs keeping first occurrence', () => {
    const session = { name: 'test', tabs: ['https://a.com', 'https://b.com', 'https://a.com'] };
    const { cleaned, removed } = deduplicateSession(session);
    expect(cleaned.tabs).toEqual(['https://a.com', 'https://b.com']);
    expect(removed).toEqual(['https://a.com']);
  });

  it('preserves other session properties', () => {
    const session = { name: 'mySession', tags: ['work'], tabs: ['https://a.com'] };
    const { cleaned } = deduplicateSession(session);
    expect(cleaned.name).toBe('mySession');
    expect(cleaned.tags).toEqual(['work']);
  });

  it('returns empty removed list when no duplicates', () => {
    const session = { tabs: ['https://a.com', 'https://b.com'] };
    const { removed } = deduplicateSession(session);
    expect(removed).toHaveLength(0);
  });
});

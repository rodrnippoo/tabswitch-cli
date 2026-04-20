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

  it('returns true for URLs that normalize to the same value', () => {
    expect(areDuplicateUrls('https://example.com/', 'https://example.com')).toBe(true);
  });

  it('returns false for different URLs', () => {
    expect(areDuplicateUrls('https://example.com', 'https://other.com')).toBe(false);
  });
});

describe('findDuplicatesInSession', () => {
  it('returns empty array when no duplicates', () => {
    const session = {
      name: 'work',
      tabs: [
        { url: 'https://github.com' },
        { url: 'https://google.com' },
      ],
    };
    expect(findDuplicatesInSession(session)).toHaveLength(0);
  });

  it('detects duplicate tabs within a session', () => {
    const session = {
      name: 'work',
      tabs: [
        { url: 'https://github.com' },
        { url: 'https://google.com' },
        { url: 'https://github.com' },
      ],
    };
    const dupes = findDuplicatesInSession(session);
    expect(dupes).toHaveLength(1);
    expect(dupes[0].indices).toEqual([0, 2]);
  });

  it('handles session with no tabs', () => {
    expect(findDuplicatesInSession({ name: 'empty', tabs: [] })).toHaveLength(0);
  });
});

describe('findDuplicatesAcrossSessions', () => {
  it('finds URLs shared across multiple sessions', () => {
    const sessions = [
      { name: 'work', tabs: [{ url: 'https://github.com' }, { url: 'https://slack.com' }] },
      { name: 'personal', tabs: [{ url: 'https://github.com' }, { url: 'https://reddit.com' }] },
    ];
    const result = findDuplicatesAcrossSessions(sessions);
    expect(result['https://github.com']).toEqual(['work', 'personal']);
    expect(result['https://slack.com']).toBeUndefined();
  });

  it('returns empty object when no cross-session duplicates', () => {
    const sessions = [
      { name: 'a', tabs: [{ url: 'https://one.com' }] },
      { name: 'b', tabs: [{ url: 'https://two.com' }] },
    ];
    expect(findDuplicatesAcrossSessions(sessions)).toEqual({});
  });
});

describe('deduplicateSession', () => {
  it('removes duplicate tabs keeping first occurrence', () => {
    const session = {
      name: 'work',
      tabs: [
        { url: 'https://github.com', title: 'GitHub' },
        { url: 'https://google.com', title: 'Google' },
        { url: 'https://github.com', title: 'GitHub again' },
      ],
    };
    const result = deduplicateSession(session);
    expect(result.tabs).toHaveLength(2);
    expect(result.tabs[0].title).toBe('GitHub');
  });

  it('does not mutate original session', () => {
    const session = {
      name: 'work',
      tabs: [{ url: 'https://a.com' }, { url: 'https://a.com' }],
    };
    deduplicateSession(session);
    expect(session.tabs).toHaveLength(2);
  });
});

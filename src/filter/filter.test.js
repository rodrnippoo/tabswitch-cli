const {
  filterByMinTabs,
  filterByMaxTabs,
  filterByCreatedAfter,
  filterByCreatedBefore,
  filterByDomain,
  filterSessions,
} = require('./filter');

const sessions = [
  { name: 'work', tabs: ['https://github.com', 'https://slack.com', 'https://notion.so'], createdAt: '2024-01-10T10:00:00Z' },
  { name: 'news', tabs: ['https://news.ycombinator.com', 'https://reddit.com'], createdAt: '2024-03-15T08:00:00Z' },
  { name: 'solo', tabs: ['https://github.com'], createdAt: '2024-06-01T12:00:00Z' },
  { name: 'empty', tabs: [], createdAt: '2024-06-05T09:00:00Z' },
];

describe('filterByMinTabs', () => {
  it('returns sessions with at least n tabs', () => {
    const result = filterByMinTabs(sessions, 2);
    expect(result.map(s => s.name)).toEqual(['work', 'news']);
  });

  it('includes sessions with exactly n tabs', () => {
    const result = filterByMinTabs(sessions, 1);
    expect(result.length).toBe(3);
  });
});

describe('filterByMaxTabs', () => {
  it('returns sessions with at most n tabs', () => {
    const result = filterByMaxTabs(sessions, 2);
    expect(result.map(s => s.name)).toEqual(['news', 'solo', 'empty']);
  });
});

describe('filterByCreatedAfter', () => {
  it('returns sessions created after the given date', () => {
    const result = filterByCreatedAfter(sessions, '2024-03-01T00:00:00Z');
    expect(result.map(s => s.name)).toEqual(['news', 'solo', 'empty']);
  });
});

describe('filterByCreatedBefore', () => {
  it('returns sessions created before the given date', () => {
    const result = filterByCreatedBefore(sessions, '2024-03-01T00:00:00Z');
    expect(result.map(s => s.name)).toEqual(['work']);
  });
});

describe('filterByDomain', () => {
  it('returns sessions containing the domain', () => {
    const result = filterByDomain(sessions, 'github.com');
    expect(result.map(s => s.name)).toEqual(['work', 'solo']);
  });

  it('returns empty array when no match', () => {
    const result = filterByDomain(sessions, 'example.com');
    expect(result).toEqual([]);
  });
});

describe('filterSessions', () => {
  it('applies multiple criteria', () => {
    const result = filterSessions(sessions, { minTabs: 2, domain: 'github.com' });
    expect(result.map(s => s.name)).toEqual(['work']);
  });

  it('returns all sessions when no criteria given', () => {
    expect(filterSessions(sessions, {})).toEqual(sessions);
  });
});

const { groupByTag, groupByDomain, groupByDate, groupSessions } = require('./grouper');

const sessions = [
  { name: 'work', urls: ['https://github.com', 'https://jira.example.com'], tags: ['work', 'dev'], createdAt: '2024-01-15T10:00:00Z' },
  { name: 'news', urls: ['https://news.ycombinator.com'], tags: ['reading'], createdAt: '2024-01-15T12:00:00Z' },
  { name: 'mixed', urls: ['https://github.com', 'https://reddit.com'], tags: ['dev', 'reading'], createdAt: '2024-02-01T09:00:00Z' },
];

describe('groupByTag', () => {
  test('groups sessions by their tags', () => {
    const result = groupByTag(sessions);
    expect(result['work']).toHaveLength(1);
    expect(result['dev']).toHaveLength(2);
    expect(result['reading']).toHaveLength(2);
  });

  test('uses untagged for sessions with no tags', () => {
    const result = groupByTag([{ name: 'bare', urls: [] }]);
    expect(result['untagged']).toHaveLength(1);
  });
});

describe('groupByDomain', () => {
  test('groups sessions by url domains', () => {
    const result = groupByDomain(sessions);
    expect(result['github.com']).toHaveLength(2);
    expect(result['news.ycombinator.com']).toHaveLength(1);
  });

  test('does not duplicate session in same domain group', () => {
    const s = [{ name: 'dups', urls: ['https://github.com/a', 'https://github.com/b'] }];
    const result = groupByDomain(s);
    expect(result['github.com']).toHaveLength(1);
  });
});

describe('groupByDate', () => {
  test('groups sessions by creation date', () => {
    const result = groupByDate(sessions);
    expect(result['2024-01-15']).toHaveLength(2);
    expect(result['2024-02-01']).toHaveLength(1);
  });

  test('uses unknown for sessions without createdAt', () => {
    const result = groupByDate([{ name: 'no-date', urls: [] }]);
    expect(result['unknown']).toHaveLength(1);
  });
});

describe('groupSessions', () => {
  test('delegates to correct grouping function', () => {
    expect(Object.keys(groupSessions(sessions, 'tag'))).toContain('dev');
    expect(Object.keys(groupSessions(sessions, 'domain'))).toContain('github.com');
    expect(Object.keys(groupSessions(sessions, 'date'))).toContain('2024-01-15');
  });

  test('throws on unknown grouping', () => {
    expect(() => groupSessions(sessions, 'color')).toThrow('Unknown grouping: color');
  });
});

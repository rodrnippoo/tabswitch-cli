const {
  countTotalTabs,
  averageTabsPerSession,
  mostUsedDomain,
  oldestSession,
  newestSession,
  computeStats,
} = require('./stats');

const sessions = [
  {
    name: 'work',
    urls: ['https://github.com/foo', 'https://github.com/bar', 'https://slack.com'],
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    name: 'research',
    urls: ['https://wikipedia.org/a', 'https://github.com/baz'],
    createdAt: '2024-03-05T08:00:00Z',
  },
  {
    name: 'empty',
    urls: [],
    createdAt: '2024-02-01T12:00:00Z',
  },
];

test('countTotalTabs sums all urls', () => {
  expect(countTotalTabs(sessions)).toBe(5);
});

test('countTotalTabs returns 0 for empty list', () => {
  expect(countTotalTabs([])).toBe(0);
});

test('averageTabsPerSession computes correctly', () => {
  expect(averageTabsPerSession(sessions)).toBeCloseTo(5 / 3);
});

test('averageTabsPerSession returns 0 for empty list', () => {
  expect(averageTabsPerSession([])).toBe(0);
});

test('mostUsedDomain finds github.com', () => {
  expect(mostUsedDomain(sessions)).toBe('github.com');
});

test('mostUsedDomain returns null for empty sessions', () => {
  expect(mostUsedDomain([])).toBeNull();
});

test('oldestSession returns work session', () => {
  expect(oldestSession(sessions)?.name).toBe('work');
});

test('newestSession returns research session', () => {
  expect(newestSession(sessions)?.name).toBe('research');
});

test('computeStats returns full stats object', () => {
  const stats = computeStats(sessions);
  expect(stats.totalSessions).toBe(3);
  expect(stats.totalTabs).toBe(5);
  expect(stats.mostUsedDomain).toBe('github.com');
  expect(stats.oldestSession).toBe('work');
  expect(stats.newestSession).toBe('research');
});

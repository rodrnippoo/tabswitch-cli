const { computeFrequency, rankByTrend, getTrendLabel, analyzeTrends } = require('./trend-analyzer');

const now = Date.now();
const recent = now - 1000 * 60 * 60;          // 1 hour ago
const old    = now - 10 * 24 * 60 * 60 * 1000; // 10 days ago

const mockLog = {
  'session-a': { lastAccessed: recent, history: [recent, recent, recent, recent, recent] },
  'session-b': { lastAccessed: recent, history: [recent, recent] },
  'session-c': { lastAccessed: old,    history: [old, old, old] },
  'session-d': { lastAccessed: null,   history: [] },
};

describe('computeFrequency', () => {
  it('counts only accesses within the window', () => {
    const freq = computeFrequency(mockLog);
    expect(freq['session-a'].count).toBe(5);
    expect(freq['session-b'].count).toBe(2);
    expect(freq['session-c'].count).toBe(0); // all older than 7 days
    expect(freq['session-d'].count).toBe(0);
  });

  it('respects a custom window', () => {
    const freq = computeFrequency(mockLog, 2 * 60 * 60 * 1000); // 2 hours
    expect(freq['session-a'].count).toBe(5);
    expect(freq['session-c'].count).toBe(0);
  });
});

describe('rankByTrend', () => {
  it('sorts by count descending', () => {
    const freq = computeFrequency(mockLog);
    const ranked = rankByTrend(freq);
    expect(ranked[0].sessionId).toBe('session-a');
    expect(ranked[1].sessionId).toBe('session-b');
  });
});

describe('getTrendLabel', () => {
  it('returns hot for count >= 20', () => expect(getTrendLabel(25)).toBe('hot'));
  it('returns rising for count >= 10', () => expect(getTrendLabel(12)).toBe('rising'));
  it('returns active for count >= 3', () => expect(getTrendLabel(5)).toBe('active'));
  it('returns low for count 1-2', () => expect(getTrendLabel(1)).toBe('low'));
  it('returns cold for count 0', () => expect(getTrendLabel(0)).toBe('cold'));
});

describe('analyzeTrends', () => {
  it('returns labeled, ranked trend entries', () => {
    const report = analyzeTrends(mockLog);
    expect(report[0].sessionId).toBe('session-a');
    expect(report[0].label).toBe('active');
    expect(report).toHaveLength(4);
    const cold = report.find(r => r.sessionId === 'session-d');
    expect(cold.label).toBe('cold');
  });
});

const {
  getDecayLevel,
  applyDecay,
  filterByDecay,
  summarizeDecay,
  purgeDeadSessions,
} = require('./decayer');

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

const fresh = { name: 'fresh', lastAccessed: daysAgo(1) };
const warn = { name: 'warn', lastAccessed: daysAgo(10) };
const stale = { name: 'stale', lastAccessed: daysAgo(40) };
const dead = { name: 'dead', lastAccessed: daysAgo(100) };

describe('getDecayLevel', () => {
  test('returns fresh for recently accessed sessions', () => {
    expect(getDecayLevel(fresh)).toBe('fresh');
  });

  test('returns warn for sessions idle 7-29 days', () => {
    expect(getDecayLevel(warn)).toBe('warn');
  });

  test('returns stale for sessions idle 30-89 days', () => {
    expect(getDecayLevel(stale)).toBe('stale');
  });

  test('returns dead for sessions idle 90+ days', () => {
    expect(getDecayLevel(dead)).toBe('dead');
  });

  test('uses createdAt as fallback when lastAccessed is missing', () => {
    const s = { name: 'old', createdAt: daysAgo(50) };
    expect(getDecayLevel(s)).toBe('stale');
  });
});

describe('applyDecay', () => {
  test('attaches decayLevel to session', () => {
    const result = applyDecay(dead);
    expect(result.decayLevel).toBe('dead');
    expect(result.name).toBe('dead');
  });
});

describe('filterByDecay', () => {
  const sessions = [fresh, warn, stale, dead];

  test('filters to only dead sessions', () => {
    const result = filterByDecay(sessions, 'dead');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('dead');
  });

  test('filters to only fresh sessions', () => {
    const result = filterByDecay(sessions, 'fresh');
    expect(result[0].name).toBe('fresh');
  });
});

describe('summarizeDecay', () => {
  test('returns correct counts per level', () => {
    const summary = summarizeDecay([fresh, warn, stale, dead]);
    expect(summary.fresh).toBe(1);
    expect(summary.warn).toBe(1);
    expect(summary.stale).toBe(1);
    expect(summary.dead).toBe(1);
  });
});

describe('purgeDeadSessions', () => {
  test('removes dead sessions and keeps others', () => {
    const result = purgeDeadSessions([fresh, warn, stale, dead]);
    expect(result).toHaveLength(3);
    expect(result.find(s => s.name === 'dead')).toBeUndefined();
  });
});

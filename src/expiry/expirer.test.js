const {
  setExpiry,
  clearExpiry,
  isExpired,
  daysUntilExpiry,
  filterExpired,
  filterActive,
  purgeExpired,
} = require('./expirer');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const baseSession = (id) => ({ id, name: `session-${id}`, urls: [] });

describe('setExpiry', () => {
  it('sets expiresAt based on days from now', () => {
    const before = Date.now();
    const s = setExpiry(baseSession('a'), 3);
    const after = Date.now();
    expect(s.expiresAt).toBeGreaterThanOrEqual(before + 3 * MS_PER_DAY);
    expect(s.expiresAt).toBeLessThanOrEqual(after + 3 * MS_PER_DAY);
  });

  it('throws for non-positive days', () => {
    expect(() => setExpiry(baseSession('a'), 0)).toThrow();
    expect(() => setExpiry(baseSession('a'), -1)).toThrow();
  });
});

describe('clearExpiry', () => {
  it('removes expiresAt from session', () => {
    const s = setExpiry(baseSession('b'), 5);
    const cleared = clearExpiry(s);
    expect(cleared.expiresAt).toBeUndefined();
  });
});

describe('isExpired', () => {
  it('returns false when no expiresAt', () => {
    expect(isExpired(baseSession('c'))).toBe(false);
  });

  it('returns true when past expiry', () => {
    const s = { ...baseSession('d'), expiresAt: Date.now() - 1000 };
    expect(isExpired(s)).toBe(true);
  });

  it('returns false when before expiry', () => {
    const s = { ...baseSession('e'), expiresAt: Date.now() + 100000 };
    expect(isExpired(s)).toBe(false);
  });
});

describe('daysUntilExpiry', () => {
  it('returns null when no expiry set', () => {
    expect(daysUntilExpiry(baseSession('f'))).toBeNull();
  });

  it('returns positive days for future expiry', () => {
    const s = setExpiry(baseSession('g'), 7);
    expect(daysUntilExpiry(s)).toBe(7);
  });
});

describe('purgeExpired', () => {
  it('separates expired and active sessions', () => {
    const now = Date.now();
    const expired = { ...baseSession('x'), expiresAt: now - 1000 };
    const active = { ...baseSession('y'), expiresAt: now + 100000 };
    const noExpiry = baseSession('z');
    const { remaining, purged } = purgeExpired([expired, active, noExpiry], now);
    expect(purged).toHaveLength(1);
    expect(purged[0].id).toBe('x');
    expect(remaining).toHaveLength(2);
  });
});

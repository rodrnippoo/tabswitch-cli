const { createLimit, isOverLimit, isNearLimit, getLimitStatus, enforceLimit, summarizeLimit, DEFAULT_LIMIT } = require('./limiter');

const makeSession = (urlCount) => ({
  id: 'test-session',
  urls: Array.from({ length: urlCount }, (_, i) => `https://example.com/page${i}`),
});

describe('createLimit', () => {
  it('creates a limit with required fields', () => {
    const lim = createLimit('sess1', 20);
    expect(lim.sessionId).toBe('sess1');
    expect(lim.maxTabs).toBe(20);
    expect(lim.warnAt).toBe(16);
    expect(lim.createdAt).toBeDefined();
  });

  it('accepts custom warnAt', () => {
    const lim = createLimit('sess1', 10, { warnAt: 7 });
    expect(lim.warnAt).toBe(7);
  });

  it('throws if sessionId is missing', () => {
    expect(() => createLimit(null, 10)).toThrow('sessionId is required');
  });

  it('throws if maxTabs is invalid', () => {
    expect(() => createLimit('sess1', 0)).toThrow('maxTabs must be a positive number');
    expect(() => createLimit('sess1', -5)).toThrow();
  });
});

describe('isOverLimit', () => {
  it('returns true when tab count exceeds maxTabs', () => {
    const lim = createLimit('s', 5);
    expect(isOverLimit(makeSession(6), lim)).toBe(true);
  });

  it('returns false when within limit', () => {
    const lim = createLimit('s', 5);
    expect(isOverLimit(makeSession(5), lim)).toBe(false);
  });
});

describe('isNearLimit', () => {
  it('returns true when at or above warnAt but not over', () => {
    const lim = createLimit('s', 10, { warnAt: 8 });
    expect(isNearLimit(makeSession(8), lim)).toBe(true);
    expect(isNearLimit(makeSession(10), lim)).toBe(true);
  });

  it('returns false when under warnAt', () => {
    const lim = createLimit('s', 10, { warnAt: 8 });
    expect(isNearLimit(makeSession(7), lim)).toBe(false);
  });
});

describe('getLimitStatus', () => {
  it('returns over, near, or ok', () => {
    const lim = createLimit('s', 10, { warnAt: 8 });
    expect(getLimitStatus(makeSession(11), lim)).toBe('over');
    expect(getLimitStatus(makeSession(9), lim)).toBe('near');
    expect(getLimitStatus(makeSession(3), lim)).toBe('ok');
  });
});

describe('enforceLimit', () => {
  it('trims urls to maxTabs', () => {
    const lim = createLimit('s', 3);
    const result = enforceLimit(makeSession(6), lim);
    expect(result.urls).toHaveLength(3);
  });

  it('does not modify session if within limit', () => {
    const lim = createLimit('s', 10);
    const session = makeSession(5);
    const result = enforceLimit(session, lim);
    expect(result.urls).toHaveLength(5);
  });
});

describe('summarizeLimit', () => {
  it('returns a full summary object', () => {
    const lim = createLimit('s', 10, { warnAt: 8 });
    const summary = summarizeLimit(makeSession(9), lim);
    expect(summary.tabCount).toBe(9);
    expect(summary.status).toBe('near');
    expect(summary.remaining).toBe(1);
  });
});

describe('DEFAULT_LIMIT', () => {
  it('is 50', () => {
    expect(DEFAULT_LIMIT).toBe(50);
  });
});

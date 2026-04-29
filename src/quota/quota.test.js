const {
  createQuota,
  checkQuota,
  enforceQuota,
  removeQuota,
  listQuotas,
  DEFAULT_QUOTA,
} = require('./quota');

const makeSession = (id, count) => ({
  id,
  name: `session-${id}`,
  urls: Array.from({ length: count }, (_, i) => `https://example.com/page${i}`),
});

describe('createQuota', () => {
  it('creates a quota with default limit', () => {
    const q = createQuota('abc');
    expect(q.sessionId).toBe('abc');
    expect(q.limit).toBe(DEFAULT_QUOTA);
    expect(q.createdAt).toBeDefined();
  });

  it('creates a quota with custom limit', () => {
    const q = createQuota('xyz', 10);
    expect(q.limit).toBe(10);
  });

  it('throws on invalid limit', () => {
    expect(() => createQuota('s1', 0)).toThrow();
    expect(() => createQuota('s1', -5)).toThrow();
    expect(() => createQuota('s1', 'lots')).toThrow();
  });
});

describe('checkQuota', () => {
  const quotaMap = { s1: createQuota('s1', 5) };

  it('returns not enforced when no quota exists', () => {
    const result = checkQuota(makeSession('s2', 3), quotaMap);
    expect(result.enforced).toBe(false);
  });

  it('detects exceeded quota', () => {
    const result = checkQuota(makeSession('s1', 8), quotaMap);
    expect(result.exceeded).toBe(true);
    expect(result.count).toBe(8);
    expect(result.limit).toBe(5);
  });

  it('detects near-limit status', () => {
    const result = checkQuota(makeSession('s1', 5), quotaMap);
    expect(result.nearLimit).toBe(true);
    expect(result.exceeded).toBe(false);
  });
});

describe('enforceQuota', () => {
  const quotaMap = { s1: createQuota('s1', 3) };

  it('trims urls to limit when exceeded', () => {
    const session = makeSession('s1', 6);
    const result = enforceQuota(session, quotaMap);
    expect(result.urls).toHaveLength(3);
  });

  it('does not trim when under limit', () => {
    const session = makeSession('s1', 2);
    const result = enforceQuota(session, quotaMap);
    expect(result.urls).toHaveLength(2);
  });
});

describe('removeQuota and listQuotas', () => {
  it('removes a quota by sessionId', () => {
    const qm = { s1: createQuota('s1', 10), s2: createQuota('s2', 20) };
    const updated = removeQuota('s1', qm);
    expect(updated.s1).toBeUndefined();
    expect(updated.s2).toBeDefined();
  });

  it('lists all quotas', () => {
    const qm = { s1: createQuota('s1', 10), s2: createQuota('s2', 20) };
    expect(listQuotas(qm)).toHaveLength(2);
  });
});

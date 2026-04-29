const {
  createAuditEntry,
  filterBySession,
  filterByAction,
  filterByDateRange,
  summarizeAudit,
} = require('./auditor');

describe('createAuditEntry', () => {
  it('creates a valid entry with required fields', () => {
    const entry = createAuditEntry('sess-1', 'create', { name: 'work' });
    expect(entry.sessionId).toBe('sess-1');
    expect(entry.action).toBe('create');
    expect(entry.meta).toEqual({ name: 'work' });
    expect(typeof entry.id).toBe('string');
    expect(typeof entry.timestamp).toBe('number');
  });

  it('throws for invalid action', () => {
    expect(() => createAuditEntry('sess-1', 'fly')).toThrow('Invalid audit action');
  });

  it('defaults meta to empty object', () => {
    const entry = createAuditEntry('sess-2', 'delete');
    expect(entry.meta).toEqual({});
  });
});

describe('filterBySession', () => {
  const entries = [
    createAuditEntry('a', 'create'),
    createAuditEntry('b', 'open'),
    createAuditEntry('a', 'delete'),
  ];

  it('returns only entries for the given session', () => {
    const result = filterBySession(entries, 'a');
    expect(result).toHaveLength(2);
    result.forEach(e => expect(e.sessionId).toBe('a'));
  });
});

describe('filterByAction', () => {
  const entries = [
    createAuditEntry('a', 'create'),
    createAuditEntry('b', 'open'),
    createAuditEntry('c', 'open'),
  ];

  it('returns only entries with matching action', () => {
    const result = filterByAction(entries, 'open');
    expect(result).toHaveLength(2);
  });
});

describe('filterByDateRange', () => {
  it('filters entries within range', () => {
    const now = Date.now();
    const entries = [
      { id: '1', sessionId: 'a', action: 'create', timestamp: now - 5000, meta: {} },
      { id: '2', sessionId: 'b', action: 'open', timestamp: now, meta: {} },
      { id: '3', sessionId: 'c', action: 'delete', timestamp: now + 5000, meta: {} },
    ];
    const result = filterByDateRange(entries, now - 1000, now + 1000);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });
});

describe('summarizeAudit', () => {
  it('counts actions correctly', () => {
    const entries = [
      createAuditEntry('a', 'create'),
      createAuditEntry('b', 'open'),
      createAuditEntry('c', 'open'),
      createAuditEntry('d', 'delete'),
    ];
    const result = summarizeAudit(entries);
    expect(result.create).toBe(1);
    expect(result.open).toBe(2);
    expect(result.delete).toBe(1);
  });

  it('returns empty object for no entries', () => {
    expect(summarizeAudit([])).toEqual({});
  });
});

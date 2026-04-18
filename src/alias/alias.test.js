const { createAlias, resolveAlias, removeAlias, listAliases } = require('./alias');

describe('createAlias', () => {
  it('creates a valid alias object', () => {
    const a = createAlias('work', 'session-123');
    expect(a.name).toBe('work');
    expect(a.sessionId).toBe('session-123');
    expect(a.createdAt).toBeDefined();
  });

  it('normalizes name to lowercase', () => {
    const a = createAlias('WORK', 'session-123');
    expect(a.name).toBe('work');
  });

  it('throws if name is missing', () => {
    expect(() => createAlias('', 'session-123')).toThrow();
  });

  it('throws if sessionId is missing', () => {
    expect(() => createAlias('work', '')).toThrow();
  });
});

describe('resolveAlias', () => {
  const aliases = [
    { name: 'work', sessionId: 'abc' },
    { name: 'home', sessionId: 'xyz' }
  ];

  it('resolves existing alias', () => {
    expect(resolveAlias(aliases, 'work').sessionId).toBe('abc');
  });

  it('returns null for unknown alias', () => {
    expect(resolveAlias(aliases, 'unknown')).toBeNull();
  });

  it('is case-insensitive', () => {
    expect(resolveAlias(aliases, 'WORK').sessionId).toBe('abc');
  });
});

describe('removeAlias', () => {
  it('removes alias by name', () => {
    const aliases = [{ name: 'work', sessionId: 'abc' }];
    expect(removeAlias(aliases, 'work')).toHaveLength(0);
  });
});

describe('listAliases', () => {
  it('returns sorted aliases', () => {
    const aliases = [{ name: 'z' }, { name: 'a' }];
    expect(listAliases(aliases)[0].name).toBe('a');
  });
});

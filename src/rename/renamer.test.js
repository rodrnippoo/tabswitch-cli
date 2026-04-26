const { validateName, renameSession, getRenameHistory } = require('./renamer');

describe('validateName', () => {
  it('returns trimmed valid name', () => {
    expect(validateName('  my-session  ')).toBe('my-session');
  });

  it('throws on empty string', () => {
    expect(() => validateName('')).toThrow('non-empty string');
  });

  it('throws on blank whitespace', () => {
    expect(() => validateName('   ')).toThrow('blank');
  });

  it('throws when name is too long', () => {
    expect(() => validateName('a'.repeat(65))).toThrow('max length');
  });

  it('throws on invalid characters', () => {
    expect(() => validateName('bad@name!')).toThrow('invalid characters');
  });

  it('accepts letters, numbers, spaces, dashes, underscores', () => {
    expect(validateName('Work Session_2')).toBe('Work Session_2');
  });
});

describe('renameSession', () => {
  const sessions = {
    'old-name': { name: 'old-name', urls: ['https://example.com'] },
    'taken-name': { name: 'taken-name', urls: [] },
  };

  it('renames a session and removes old key', () => {
    const result = renameSession(sessions, 'old-name', 'new-name');
    expect(result['new-name']).toBeDefined();
    expect(result['old-name']).toBeUndefined();
  });

  it('stores previousName and renamedAt', () => {
    const result = renameSession(sessions, 'old-name', 'new-name');
    expect(result['new-name'].previousName).toBe('old-name');
    expect(result['new-name'].renamedAt).toBeDefined();
  });

  it('throws if session does not exist', () => {
    expect(() => renameSession(sessions, 'ghost', 'new-name')).toThrow('not found');
  });

  it('throws if new name is already taken', () => {
    expect(() => renameSession(sessions, 'old-name', 'taken-name')).toThrow('already exists');
  });
});

describe('getRenameHistory', () => {
  it('returns rename metadata for a renamed session', () => {
    const session = { name: 'new-name', previousName: 'old-name', renamedAt: '2024-01-01T00:00:00.000Z' };
    const history = getRenameHistory(session);
    expect(history.current).toBe('new-name');
    expect(history.previous).toBe('old-name');
    expect(history.renamedAt).toBe('2024-01-01T00:00:00.000Z');
  });

  it('returns nulls for a never-renamed session', () => {
    const session = { name: 'fresh' };
    const history = getRenameHistory(session);
    expect(history.previous).toBeNull();
    expect(history.renamedAt).toBeNull();
  });

  it('throws if session is undefined', () => {
    expect(() => getRenameHistory(null)).toThrow('required');
  });
});

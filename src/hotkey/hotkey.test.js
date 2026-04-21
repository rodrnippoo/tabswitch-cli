const {
  createHotkey,
  normalizeKey,
  resolveHotkey,
  removeHotkey,
  listHotkeys,
  isBound,
} = require('./hotkey');

describe('normalizeKey', () => {
  it('lowercases and trims the key', () => {
    expect(normalizeKey('  CTRL+1  ')).toBe('ctrl+1');
    expect(normalizeKey('F5')).toBe('f5');
  });
});

describe('createHotkey', () => {
  it('creates a hotkey object', () => {
    const hk = createHotkey('ctrl+1', 'session-abc');
    expect(hk.key).toBe('ctrl+1');
    expect(hk.sessionId).toBe('session-abc');
    expect(hk.createdAt).toBeDefined();
  });

  it('normalizes the key on creation', () => {
    const hk = createHotkey('CTRL+2', 'session-xyz');
    expect(hk.key).toBe('ctrl+2');
  });

  it('throws if key is missing', () => {
    expect(() => createHotkey('', 'session-abc')).toThrow('Invalid hotkey key');
  });

  it('throws if sessionId is missing', () => {
    expect(() => createHotkey('ctrl+1', '')).toThrow('sessionId is required');
  });
});

describe('resolveHotkey', () => {
  const hotkeys = [
    { key: 'ctrl+1', sessionId: 'session-a' },
    { key: 'ctrl+2', sessionId: 'session-b' },
  ];

  it('returns sessionId for a known key', () => {
    expect(resolveHotkey('ctrl+1', hotkeys)).toBe('session-a');
  });

  it('returns null for an unknown key', () => {
    expect(resolveHotkey('ctrl+9', hotkeys)).toBeNull();
  });

  it('normalizes before lookup', () => {
    expect(resolveHotkey('CTRL+2', hotkeys)).toBe('session-b');
  });
});

describe('removeHotkey', () => {
  const hotkeys = [
    { key: 'ctrl+1', sessionId: 'session-a' },
    { key: 'ctrl+2', sessionId: 'session-b' },
  ];

  it('removes the matching hotkey', () => {
    const result = removeHotkey('ctrl+1', hotkeys);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('ctrl+2');
  });

  it('returns unchanged array if key not found', () => {
    const result = removeHotkey('ctrl+9', hotkeys);
    expect(result).toHaveLength(2);
  });
});

describe('listHotkeys', () => {
  const hotkeys = [
    { key: 'ctrl+1', sessionId: 'session-a' },
    { key: 'ctrl+2', sessionId: 'session-b' },
    { key: 'ctrl+3', sessionId: 'session-a' },
  ];

  it('lists all hotkeys when no sessionId given', () => {
    expect(listHotkeys(hotkeys)).toHaveLength(3);
  });

  it('filters by sessionId', () => {
    const result = listHotkeys(hotkeys, 'session-a');
    expect(result).toHaveLength(2);
    expect(result.every((h) => h.sessionId === 'session-a')).toBe(true);
  });
});

describe('isBound', () => {
  const hotkeys = [{ key: 'ctrl+1', sessionId: 'session-a' }];

  it('returns true if key is bound', () => {
    expect(isBound('ctrl+1', hotkeys)).toBe(true);
  });

  it('returns false if key is not bound', () => {
    expect(isBound('ctrl+5', hotkeys)).toBe(false);
  });
});

const {
  lockSession,
  unlockSession,
  isLocked,
  assertUnlocked,
  filterLocked,
  filterUnlocked,
} = require('./locker');

const makeSession = (id, name, locked = false) => ({
  id,
  name,
  urls: [],
  ...(locked ? { locked: true, lockedAt: '2024-01-01T00:00:00.000Z' } : {}),
});

describe('lockSession', () => {
  it('sets locked=true and lockedAt on a session', () => {
    const s = makeSession('1', 'work');
    const locked = lockSession(s);
    expect(locked.locked).toBe(true);
    expect(locked.lockedAt).toBeDefined();
  });

  it('does not mutate the original session', () => {
    const s = makeSession('1', 'work');
    lockSession(s);
    expect(s.locked).toBeUndefined();
  });

  it('throws on invalid session', () => {
    expect(() => lockSession(null)).toThrow('Invalid session');
  });
});

describe('unlockSession', () => {
  it('removes locked and lockedAt fields', () => {
    const s = makeSession('1', 'work', true);
    const unlocked = unlockSession(s);
    expect(unlocked.locked).toBeUndefined();
    expect(unlocked.lockedAt).toBeUndefined();
  });
});

describe('isLocked', () => {
  it('returns true for locked sessions', () => {
    expect(isLocked(makeSession('1', 'work', true))).toBe(true);
  });
  it('returns false for unlocked sessions', () => {
    expect(isLocked(makeSession('1', 'work', false))).toBe(false);
  });
});

describe('assertUnlocked', () => {
  it('throws if session is locked', () => {
    expect(() => assertUnlocked(makeSession('1', 'work', true))).toThrow('locked');
  });
  it('does not throw if session is unlocked', () => {
    expect(() => assertUnlocked(makeSession('1', 'work', false))).not.toThrow();
  });
});

describe('filterLocked / filterUnlocked', () => {
  const sessions = [
    makeSession('1', 'a', true),
    makeSession('2', 'b', false),
    makeSession('3', 'c', true),
  ];

  it('filterLocked returns only locked sessions', () => {
    expect(filterLocked(sessions).map(s => s.name)).toEqual(['a', 'c']);
  });

  it('filterUnlocked returns only unlocked sessions', () => {
    expect(filterUnlocked(sessions).map(s => s.name)).toEqual(['b']);
  });
});

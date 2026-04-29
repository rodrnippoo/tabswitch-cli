const {
  createCooldown,
  triggerCooldown,
  isOnCooldown,
  timeRemaining,
  resetCooldown,
  describeCooldown,
} = require('./cooldown');

describe('createCooldown', () => {
  it('creates a cooldown with defaults', () => {
    const cd = createCooldown('session-1');
    expect(cd.sessionId).toBe('session-1');
    expect(cd.durationMs).toBe(3600000);
    expect(cd.lastTriggeredAt).toBeNull();
  });

  it('accepts custom duration', () => {
    const cd = createCooldown('session-2', 5000);
    expect(cd.durationMs).toBe(5000);
  });

  it('throws on invalid sessionId', () => {
    expect(() => createCooldown('')).toThrow();
    expect(() => createCooldown(null)).toThrow();
  });

  it('throws on invalid durationMs', () => {
    expect(() => createCooldown('s', -1)).toThrow();
    expect(() => createCooldown('s', 0)).toThrow();
  });
});

describe('triggerCooldown', () => {
  it('sets lastTriggeredAt', () => {
    const cd = createCooldown('session-3');
    const triggered = triggerCooldown(cd);
    expect(triggered.lastTriggeredAt).not.toBeNull();
  });

  it('does not mutate original', () => {
    const cd = createCooldown('session-4');
    triggerCooldown(cd);
    expect(cd.lastTriggeredAt).toBeNull();
  });
});

describe('isOnCooldown', () => {
  it('returns false if never triggered', () => {
    const cd = createCooldown('session-5', 5000);
    expect(isOnCooldown(cd)).toBe(false);
  });

  it('returns true immediately after trigger', () => {
    const cd = triggerCooldown(createCooldown('session-6', 5000));
    expect(isOnCooldown(cd)).toBe(true);
  });

  it('returns false after duration passes', () => {
    const cd = triggerCooldown(createCooldown('session-7', 1000));
    const future = new Date(Date.now() + 2000);
    expect(isOnCooldown(cd, future)).toBe(false);
  });
});

describe('timeRemaining', () => {
  it('returns 0 when not on cooldown', () => {
    const cd = createCooldown('session-8', 5000);
    expect(timeRemaining(cd)).toBe(0);
  });

  it('returns positive ms when on cooldown', () => {
    const cd = triggerCooldown(createCooldown('session-9', 60000));
    expect(timeRemaining(cd)).toBeGreaterThan(0);
  });
});

describe('resetCooldown', () => {
  it('clears lastTriggeredAt', () => {
    const cd = triggerCooldown(createCooldown('session-10', 5000));
    const reset = resetCooldown(cd);
    expect(reset.lastTriggeredAt).toBeNull();
  });
});

describe('describeCooldown', () => {
  it('returns not on cooldown message', () => {
    const cd = createCooldown('session-11', 5000);
    expect(describeCooldown(cd)).toBe('not on cooldown');
  });

  it('returns minutes remaining message', () => {
    const cd = triggerCooldown(createCooldown('session-12', 120000));
    expect(describeCooldown(cd)).toMatch(/minute/);
  });
});

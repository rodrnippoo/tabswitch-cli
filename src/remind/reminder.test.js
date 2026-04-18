const { createReminder, isDue, isExpired, tickReminder } = require('./reminder');

describe('createReminder', () => {
  it('creates reminder with defaults', () => {
    const r = createReminder('work');
    expect(r.sessionName).toBe('work');
    expect(r.intervalMinutes).toBe(60);
    expect(r.maxReminders).toBe(5);
    expect(r.reminderCount).toBe(0);
    expect(r.lastRemindedAt).toBeNull();
  });

  it('accepts custom options', () => {
    const r = createReminder('dev', { intervalMinutes: 30, maxReminders: 3 });
    expect(r.intervalMinutes).toBe(30);
    expect(r.maxReminders).toBe(3);
  });
});

describe('isDue', () => {
  it('returns true if never reminded', () => {
    const r = createReminder('test');
    expect(isDue(r)).toBe(true);
  });

  it('returns false if reminded recently', () => {
    const r = { ...createReminder('test'), lastRemindedAt: new Date().toISOString() };
    expect(isDue(r)).toBe(false);
  });

  it('returns true if interval has passed', () => {
    const past = new Date(Date.now() - 61 * 60 * 1000).toISOString();
    const r = { ...createReminder('test'), lastRemindedAt: past };
    expect(isDue(r)).toBe(true);
  });
});

describe('isExpired', () => {
  it('returns false when under max', () => {
    const r = createReminder('test');
    expect(isExpired(r)).toBe(false);
  });

  it('returns true when at max', () => {
    const r = { ...createReminder('test'), reminderCount: 5, maxReminders: 5 };
    expect(isExpired(r)).toBe(true);
  });
});

describe('tickReminder', () => {
  it('increments count and sets lastRemindedAt', () => {
    const r = createReminder('test');
    const ticked = tickReminder(r);
    expect(ticked.reminderCount).toBe(1);
    expect(ticked.lastRemindedAt).not.toBeNull();
  });
});

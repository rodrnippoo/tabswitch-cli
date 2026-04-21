'use strict';

const { createSchedule, isDue, advanceSchedule, getDueSchedules } = require('./scheduler');

describe('createSchedule', () => {
  it('creates a schedule with required fields', () => {
    const s = createSchedule('work', 'chrome', '2030-01-01T09:00:00Z');
    expect(s.sessionName).toBe('work');
    expect(s.browser).toBe('chrome');
    expect(s.fired).toBe(false);
    expect(s.id).toBeDefined();
    expect(s.scheduledAt).toBe('2030-01-01T09:00:00.000Z');
  });

  it('supports repeat option', () => {
    const s = createSchedule('daily-news', null, '2030-06-01T08:00:00Z', { repeat: 'daily' });
    expect(s.repeat).toBe('daily');
  });

  it('defaults repeat to null', () => {
    const s = createSchedule('once', null, '2030-01-01T00:00:00Z');
    expect(s.repeat).toBeNull();
  });
});

describe('isDue', () => {
  it('returns true for past scheduled time', () => {
    const s = createSchedule('old', null, '2000-01-01T00:00:00Z');
    expect(isDue(s)).toBe(true);
  });

  it('returns false for future scheduled time', () => {
    const s = createSchedule('future', null, '2099-01-01T00:00:00Z');
    expect(isDue(s)).toBe(false);
  });

  it('returns false if already fired', () => {
    const s = { ...createSchedule('x', null, '2000-01-01T00:00:00Z'), fired: true };
    expect(isDue(s)).toBe(false);
  });
});

describe('advanceSchedule', () => {
  it('marks as fired if no repeat', () => {
    const s = createSchedule('once', null, '2000-01-01T00:00:00Z');
    const next = advanceSchedule(s);
    expect(next.fired).toBe(true);
  });

  it('advances daily schedule by 1 day', () => {
    const s = createSchedule('daily', null, '2024-03-01T08:00:00Z', { repeat: 'daily' });
    const next = advanceSchedule(s);
    expect(next.scheduledAt).toBe('2024-03-02T08:00:00.000Z');
    expect(next.fired).toBe(false);
  });

  it('advances weekly schedule by 7 days', () => {
    const s = createSchedule('weekly', null, '2024-03-01T08:00:00Z', { repeat: 'weekly' });
    const next = advanceSchedule(s);
    expect(next.scheduledAt).toBe('2024-03-08T08:00:00.000Z');
  });
});

describe('getDueSchedules', () => {
  it('returns only due schedules', () => {
    const past = createSchedule('a', null, '2000-01-01T00:00:00Z');
    const future = createSchedule('b', null, '2099-01-01T00:00:00Z');
    const fired = { ...createSchedule('c', null, '2000-01-01T00:00:00Z'), fired: true };
    const due = getDueSchedules([past, future, fired]);
    expect(due).toHaveLength(1);
    expect(due[0].sessionName).toBe('a');
  });
});

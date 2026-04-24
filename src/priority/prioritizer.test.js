const {
  setPriority,
  getPriority,
  removePriority,
  sortByPriority,
  filterByPriority,
  filterAtLeastPriority,
  DEFAULT_PRIORITY,
} = require('./prioritizer');

const makeSession = (name, priority) => ({ name, urls: [], priority });

describe('prioritizer', () => {
  test('setPriority sets valid priority on session', () => {
    const s = makeSession('work', undefined);
    const updated = setPriority(s, 'high');
    expect(updated.priority).toBe('high');
    expect(updated.name).toBe('work');
  });

  test('setPriority throws on invalid priority', () => {
    const s = makeSession('work', undefined);
    expect(() => setPriority(s, 'urgent')).toThrow(/Invalid priority/);
  });

  test('getPriority returns session priority', () => {
    const s = makeSession('a', 'critical');
    expect(getPriority(s)).toBe('critical');
  });

  test('getPriority returns default when unset', () => {
    const s = { name: 'b', urls: [] };
    expect(getPriority(s)).toBe(DEFAULT_PRIORITY);
  });

  test('removePriority removes priority field', () => {
    const s = makeSession('c', 'low');
    const updated = removePriority(s);
    expect(updated.priority).toBeUndefined();
  });

  test('sortByPriority sorts descending by default', () => {
    const sessions = [
      makeSession('a', 'low'),
      makeSession('b', 'critical'),
      makeSession('c', 'normal'),
    ];
    const sorted = sortByPriority(sessions);
    expect(sorted[0].name).toBe('b');
    expect(sorted[2].name).toBe('a');
  });

  test('sortByPriority sorts ascending when specified', () => {
    const sessions = [
      makeSession('a', 'high'),
      makeSession('b', 'low'),
    ];
    const sorted = sortByPriority(sessions, 'asc');
    expect(sorted[0].name).toBe('b');
  });

  test('filterByPriority returns only matching sessions', () => {
    const sessions = [
      makeSession('a', 'high'),
      makeSession('b', 'low'),
      makeSession('c', 'high'),
    ];
    const result = filterByPriority(sessions, 'high');
    expect(result).toHaveLength(2);
    expect(result.every(s => s.priority === 'high')).toBe(true);
  });

  test('filterAtLeastPriority filters correctly', () => {
    const sessions = [
      makeSession('a', 'low'),
      makeSession('b', 'normal'),
      makeSession('c', 'high'),
      makeSession('d', 'critical'),
    ];
    const result = filterAtLeastPriority(sessions, 'high');
    expect(result).toHaveLength(2);
    expect(result.map(s => s.name)).toEqual(expect.arrayContaining(['c', 'd']));
  });
});

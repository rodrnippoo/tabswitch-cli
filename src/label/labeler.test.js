const {
  addLabel,
  removeLabel,
  listLabels,
  hasLabel,
  clearLabels,
  filterByLabel,
  renameLabel,
} = require('./labeler');

const makeSession = (id, labels = []) => ({ id, name: `session-${id}`, urls: [], labels });

describe('addLabel', () => {
  it('adds a label to a session', () => {
    const s = makeSession('a');
    const result = addLabel(s, 'work');
    expect(result.labels).toContain('work');
  });

  it('does not add duplicate labels', () => {
    const s = makeSession('a', ['work']);
    const result = addLabel(s, 'work');
    expect(result.labels.filter(l => l === 'work').length).toBe(1);
  });

  it('throws on invalid label', () => {
    const s = makeSession('a');
    expect(() => addLabel(s, 'bad label!')).toThrow();
  });

  it('does not mutate original session', () => {
    const s = makeSession('a');
    addLabel(s, 'work');
    expect(s.labels).toEqual([]);
  });
});

describe('removeLabel', () => {
  it('removes an existing label', () => {
    const s = makeSession('a', ['work', 'personal']);
    const result = removeLabel(s, 'work');
    expect(result.labels).not.toContain('work');
    expect(result.labels).toContain('personal');
  });

  it('is a no-op if label not present', () => {
    const s = makeSession('a', ['work']);
    const result = removeLabel(s, 'missing');
    expect(result.labels).toEqual(['work']);
  });
});

describe('listLabels', () => {
  it('returns labels array', () => {
    const s = makeSession('a', ['x', 'y']);
    expect(listLabels(s)).toEqual(['x', 'y']);
  });

  it('returns empty array when no labels', () => {
    const s = makeSession('a');
    expect(listLabels(s)).toEqual([]);
  });
});

describe('hasLabel', () => {
  it('returns true when label exists', () => {
    expect(hasLabel(makeSession('a', ['work']), 'work')).toBe(true);
  });

  it('returns false when label missing', () => {
    expect(hasLabel(makeSession('a'), 'work')).toBe(false);
  });
});

describe('clearLabels', () => {
  it('removes all labels', () => {
    const s = makeSession('a', ['a', 'b', 'c']);
    expect(clearLabels(s).labels).toEqual([]);
  });
});

describe('filterByLabel', () => {
  it('filters sessions by label', () => {
    const sessions = [
      makeSession('1', ['work']),
      makeSession('2', ['personal']),
      makeSession('3', ['work', 'personal']),
    ];
    const result = filterByLabel(sessions, 'work');
    expect(result.map(s => s.id)).toEqual(['1', '3']);
  });
});

describe('renameLabel', () => {
  it('renames label across sessions', () => {
    const sessions = [
      makeSession('1', ['work']),
      makeSession('2', ['personal']),
    ];
    const result = renameLabel(sessions, 'work', 'job');
    expect(result[0].labels).toContain('job');
    expect(result[0].labels).not.toContain('work');
    expect(result[1].labels).toEqual(['personal']);
  });
});

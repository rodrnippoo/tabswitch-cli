const {
  addBadge,
  removeBadge,
  hasBadge,
  listBadges,
  clearBadges,
  filterByBadge,
  validateBadge,
} = require('./badger');

const makeSession = (badges) => ({ id: 's1', name: 'Test', badges });

describe('validateBadge', () => {
  it('throws on unknown badge', () => {
    expect(() => validateBadge('unicorn')).toThrow(/Invalid badge/);
  });

  it('does not throw on valid badge', () => {
    expect(() => validateBadge('star')).not.toThrow();
  });
});

describe('addBadge', () => {
  it('adds a badge to a session', () => {
    const s = makeSession([]);
    const result = addBadge(s, 'star');
    expect(result.badges).toContain('star');
  });

  it('does not duplicate badges', () => {
    const s = makeSession(['star']);
    const result = addBadge(s, 'star');
    expect(result.badges.filter(b => b === 'star')).toHaveLength(1);
  });

  it('works when badges is undefined', () => {
    const s = { id: 's2', name: 'No badges' };
    const result = addBadge(s, 'fire');
    expect(result.badges).toEqual(['fire']);
  });
});

describe('removeBadge', () => {
  it('removes an existing badge', () => {
    const s = makeSession(['star', 'fire']);
    const result = removeBadge(s, 'star');
    expect(result.badges).not.toContain('star');
    expect(result.badges).toContain('fire');
  });

  it('is a no-op if badge not present', () => {
    const s = makeSession(['fire']);
    const result = removeBadge(s, 'star');
    expect(result.badges).toEqual(['fire']);
  });
});

describe('hasBadge', () => {
  it('returns true when badge exists', () => {
    expect(hasBadge(makeSession(['top']), 'top')).toBe(true);
  });

  it('returns false when badge missing', () => {
    expect(hasBadge(makeSession([]), 'top')).toBe(false);
  });
});

describe('listBadges', () => {
  it('returns copy of badges array', () => {
    const s = makeSession(['star', 'new']);
    expect(listBadges(s)).toEqual(['star', 'new']);
  });

  it('returns empty array when no badges', () => {
    expect(listBadges({ id: 'x' })).toEqual([]);
  });
});

describe('clearBadges', () => {
  it('removes all badges', () => {
    const s = makeSession(['star', 'fire', 'new']);
    expect(clearBadges(s).badges).toEqual([]);
  });
});

describe('filterByBadge', () => {
  it('returns only sessions with the given badge', () => {
    const sessions = [
      makeSession(['star']),
      makeSession(['fire']),
      makeSession(['star', 'fire']),
    ];
    const result = filterByBadge(sessions, 'star');
    expect(result).toHaveLength(2);
  });
});

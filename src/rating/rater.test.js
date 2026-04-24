const {
  createRating,
  rateSession,
  getRating,
  removeRating,
  listRatings,
  averageRating,
  topRated,
} = require('./rater');

describe('createRating', () => {
  it('creates a valid rating object', () => {
    const r = createRating('sess-1', 4, 'great tabs');
    expect(r.sessionId).toBe('sess-1');
    expect(r.stars).toBe(4);
    expect(r.comment).toBe('great tabs');
    expect(r.createdAt).toBeDefined();
  });

  it('throws if sessionId is missing', () => {
    expect(() => createRating('', 3)).toThrow('sessionId is required');
  });

  it('throws if stars are out of range', () => {
    expect(() => createRating('sess-1', 0)).toThrow();
    expect(() => createRating('sess-1', 6)).toThrow();
  });

  it('throws if stars are not an integer', () => {
    expect(() => createRating('sess-1', 3.5)).toThrow();
  });
});

describe('rateSession', () => {
  it('adds a new rating', () => {
    const result = rateSession([], 'sess-1', 5);
    expect(result).toHaveLength(1);
    expect(result[0].stars).toBe(5);
  });

  it('replaces an existing rating for the same session', () => {
    const existing = [createRating('sess-1', 3)];
    const result = rateSession(existing, 'sess-1', 5, 'updated');
    expect(result).toHaveLength(1);
    expect(result[0].stars).toBe(5);
    expect(result[0].comment).toBe('updated');
  });
});

describe('getRating', () => {
  it('returns the rating for a session', () => {
    const ratings = [createRating('sess-1', 4)];
    expect(getRating(ratings, 'sess-1').stars).toBe(4);
  });

  it('returns null if not found', () => {
    expect(getRating([], 'sess-x')).toBeNull();
  });
});

describe('removeRating', () => {
  it('removes a rating by sessionId', () => {
    const ratings = [createRating('sess-1', 3), createRating('sess-2', 5)];
    const result = removeRating(ratings, 'sess-1');
    expect(result).toHaveLength(1);
    expect(result[0].sessionId).toBe('sess-2');
  });
});

describe('averageRating', () => {
  it('returns 0 for empty ratings', () => {
    expect(averageRating([])).toBe(0);
  });

  it('calculates average correctly', () => {
    const ratings = [createRating('a', 4), createRating('b', 2)];
    expect(averageRating(ratings)).toBe(3);
  });
});

describe('topRated', () => {
  it('returns sessions sorted by stars descending', () => {
    const ratings = [createRating('a', 2), createRating('b', 5), createRating('c', 3)];
    const top = topRated(ratings, 2);
    expect(top[0].stars).toBe(5);
    expect(top[1].stars).toBe(3);
  });
});

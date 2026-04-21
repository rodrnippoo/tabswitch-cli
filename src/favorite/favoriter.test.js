const favoriter = require('./favoriter');
const favoriteStore = require('./favorite-store');

jest.mock('./favorite-store');

describe('favoriter', () => {
  let store;

  beforeEach(() => {
    store = {};
    favoriteStore.loadFavorites.mockResolvedValue(store);
    favoriteStore.saveFavorites.mockImplementation(async (data) => {
      Object.assign(store, data);
    });
  });

  describe('favoriteSession', () => {
    it('adds a session to favorites', async () => {
      const result = await favoriter.favoriteSession('abc');
      expect(result.alreadyFavorited).toBe(false);
      expect(result.sessionId).toBe('abc');
      expect(favoriteStore.saveFavorites).toHaveBeenCalled();
    });

    it('returns alreadyFavorited true if already in favorites', async () => {
      store['abc'] = { sessionId: 'abc', favoritedAt: '2024-01-01T00:00:00.000Z' };
      const result = await favoriter.favoriteSession('abc');
      expect(result.alreadyFavorited).toBe(true);
      expect(favoriteStore.saveFavorites).not.toHaveBeenCalled();
    });
  });

  describe('unfavoriteSession', () => {
    it('removes a session from favorites', async () => {
      store['abc'] = { sessionId: 'abc', favoritedAt: '2024-01-01T00:00:00.000Z' };
      const result = await favoriter.unfavoriteSession('abc');
      expect(result.wasFavorited).toBe(true);
      expect(favoriteStore.saveFavorites).toHaveBeenCalled();
    });

    it('returns wasFavorited false if not in favorites', async () => {
      const result = await favoriter.unfavoriteSession('xyz');
      expect(result.wasFavorited).toBe(false);
      expect(favoriteStore.saveFavorites).not.toHaveBeenCalled();
    });
  });

  describe('isFavorited', () => {
    it('returns true for favorited session', async () => {
      store['abc'] = { sessionId: 'abc', favoritedAt: '2024-01-01T00:00:00.000Z' };
      expect(await favoriter.isFavorited('abc')).toBe(true);
    });

    it('returns false for non-favorited session', async () => {
      expect(await favoriter.isFavorited('nope')).toBe(false);
    });
  });

  describe('listFavorites', () => {
    it('returns all favorites sorted by favoritedAt', async () => {
      store['b'] = { sessionId: 'b', favoritedAt: '2024-02-01T00:00:00.000Z' };
      store['a'] = { sessionId: 'a', favoritedAt: '2024-01-01T00:00:00.000Z' };
      const result = await favoriter.listFavorites();
      expect(result[0].sessionId).toBe('a');
      expect(result[1].sessionId).toBe('b');
    });
  });

  describe('filterFavorites', () => {
    it('filters sessions to only favorited ones', async () => {
      store['abc'] = { sessionId: 'abc', favoritedAt: '2024-01-01T00:00:00.000Z' };
      const sessions = [{ id: 'abc', name: 'Work' }, { id: 'xyz', name: 'Personal' }];
      const result = await favoriter.filterFavorites(sessions);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('abc');
    });
  });
});

const favoriteStore = require('./favorite-store');

/**
 * Mark a session as a favorite
 */
async function favoriteSession(sessionId) {
  const favorites = await favoriteStore.loadFavorites();
  if (favorites[sessionId]) {
    return { alreadyFavorited: true, sessionId };
  }
  favorites[sessionId] = { sessionId, favoritedAt: new Date().toISOString() };
  await favoriteStore.saveFavorites(favorites);
  return { alreadyFavorited: false, sessionId };
}

/**
 * Remove a session from favorites
 */
async function unfavoriteSession(sessionId) {
  const favorites = await favoriteStore.loadFavorites();
  if (!favorites[sessionId]) {
    return { wasFavorited: false, sessionId };
  }
  delete favorites[sessionId];
  await favoriteStore.saveFavorites(favorites);
  return { wasFavorited: true, sessionId };
}

/**
 * Check if a session is favorited
 */
async function isFavorited(sessionId) {
  const favorites = await favoriteStore.loadFavorites();
  return Boolean(favorites[sessionId]);
}

/**
 * List all favorited session ids with metadata
 */
async function listFavorites() {
  const favorites = await favoriteStore.loadFavorites();
  return Object.values(favorites).sort(
    (a, b) => new Date(a.favoritedAt) - new Date(b.favoritedAt)
  );
}

/**
 * Filter a list of sessions to only favorited ones
 */
async function filterFavorites(sessions) {
  const favorites = await favoriteStore.loadFavorites();
  return sessions.filter((s) => Boolean(favorites[s.id]));
}

module.exports = {
  favoriteSession,
  unfavoriteSession,
  isFavorited,
  listFavorites,
  filterFavorites,
};

// Session rating: 1-5 stars, with optional comment

function createRating(sessionId, stars, comment = '') {
  if (!sessionId) throw new Error('sessionId is required');
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    throw new Error('stars must be an integer between 1 and 5');
  }
  return {
    sessionId,
    stars,
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  };
}

function rateSession(ratings, sessionId, stars, comment = '') {
  const rating = createRating(sessionId, stars, comment);
  const existing = ratings.filter(r => r.sessionId !== sessionId);
  return [...existing, rating];
}

function getRating(ratings, sessionId) {
  return ratings.find(r => r.sessionId === sessionId) || null;
}

function removeRating(ratings, sessionId) {
  return ratings.filter(r => r.sessionId !== sessionId);
}

function listRatings(ratings) {
  return [...ratings].sort((a, b) => b.stars - a.stars);
}

function averageRating(ratings) {
  if (!ratings.length) return 0;
  const total = ratings.reduce((sum, r) => sum + r.stars, 0);
  return parseFloat((total / ratings.length).toFixed(2));
}

function topRated(ratings, limit = 5) {
  return listRatings(ratings).slice(0, limit);
}

module.exports = {
  createRating,
  rateSession,
  getRating,
  removeRating,
  listRatings,
  averageRating,
  topRated,
};

const sharer = require('./sharer');
const store = require('./share-store');

function shareSession(session, options = {}) {
  let token = sharer.createShareToken(session);
  if (options.expiresInHours) {
    token = sharer.setExpiry(token, options.expiresInHours);
  }
  store.addShare(token);
  return token;
}

function getShareLink(token, baseUrl) {
  const shareToken = store.getShare(token);
  if (!shareToken) throw new Error(`No share found for token: ${token}`);
  if (sharer.isExpired(shareToken)) {
    throw new Error(`Share token has expired: ${token}`);
  }
  return sharer.encodeShareLink(shareToken, baseUrl);
}

function revokeShare(token) {
  store.removeShare(token);
}

function listShares() {
  return store.listShares().map((s) => ({
    token: s.token,
    sessionName: s.sessionName,
    tabCount: s.urls.length,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
    expired: sharer.isExpired(s),
  }));
}

function resolveLink(link) {
  const token = sharer.decodeShareLink(link);
  if (sharer.isExpired(token)) {
    throw new Error('This share link has expired.');
  }
  return token;
}

module.exports = {
  shareSession,
  getShareLink,
  revokeShare,
  listShares,
  resolveLink,
};

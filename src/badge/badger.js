// Assign and manage badges for sessions based on criteria

const VALID_BADGES = ['star', 'fire', 'new', 'archived', 'top', 'reviewed', 'flagged'];

function validateBadge(badge) {
  if (!VALID_BADGES.includes(badge)) {
    throw new Error(`Invalid badge "${badge}". Valid badges: ${VALID_BADGES.join(', ')}`);
  }
}

function addBadge(session, badge) {
  validateBadge(badge);
  const badges = session.badges ? [...session.badges] : [];
  if (badges.includes(badge)) return session;
  return { ...session, badges: [...badges, badge] };
}

function removeBadge(session, badge) {
  validateBadge(badge);
  const badges = session.badges ? session.badges.filter(b => b !== badge) : [];
  return { ...session, badges };
}

function hasBadge(session, badge) {
  return Array.isArray(session.badges) && session.badges.includes(badge);
}

function listBadges(session) {
  return session.badges ? [...session.badges] : [];
}

function clearBadges(session) {
  return { ...session, badges: [] };
}

function filterByBadge(sessions, badge) {
  validateBadge(badge);
  return sessions.filter(s => hasBadge(s, badge));
}

module.exports = {
  VALID_BADGES,
  validateBadge,
  addBadge,
  removeBadge,
  hasBadge,
  listBadges,
  clearBadges,
  filterByBadge,
};

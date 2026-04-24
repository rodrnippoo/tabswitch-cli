/**
 * Visibility — mark sessions as hidden or visible
 */

/**
 * @param {object} session
 * @returns {object}
 */
function hideSession(session) {
  return { ...session, hidden: true, hiddenAt: new Date().toISOString() };
}

/**
 * @param {object} session
 * @returns {object}
 */
function showSession(session) {
  const { hidden, hiddenAt, ...rest } = session;
  return rest;
}

/**
 * @param {object} session
 * @returns {boolean}
 */
function isHidden(session) {
  return session.hidden === true;
}

/**
 * Filter out hidden sessions
 * @param {object[]} sessions
 * @returns {object[]}
 */
function filterVisible(sessions) {
  return sessions.filter((s) => !isHidden(s));
}

/**
 * Return only hidden sessions
 * @param {object[]} sessions
 * @returns {object[]}
 */
function filterHidden(sessions) {
  return sessions.filter((s) => isHidden(s));
}

/**
 * Toggle visibility of a session
 * @param {object} session
 * @returns {object}
 */
function toggleVisibility(session) {
  return isHidden(session) ? showSession(session) : hideSession(session);
}

module.exports = {
  hideSession,
  showSession,
  isHidden,
  filterVisible,
  filterHidden,
  toggleVisibility,
};

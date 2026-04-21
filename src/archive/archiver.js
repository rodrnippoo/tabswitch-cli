const { getSession, removeSession, listSessions } = require('../session/manager');

function archiveSession(name, archivedAt = new Date().toISOString()) {
  const session = getSession(name);
  if (!session) throw new Error(`Session "${name}" not found`);
  if (session.archived) throw new Error(`Session "${name}" is already archived`);
  return { ...session, archived: true, archivedAt };
}

function unarchiveSession(session) {
  if (!session.archived) throw new Error(`Session is not archived`);
  const { archived, archivedAt, ...rest } = session;
  return rest;
}

function isArchived(session) {
  return session.archived === true;
}

function filterArchived(sessions) {
  return sessions.filter(isArchived);
}

function filterActive(sessions) {
  return sessions.filter(s => !isArchived(s));
}

/**
 * Returns sessions archived before the given date.
 * @param {Array} sessions - List of session objects
 * @param {string|Date} date - Cutoff date; sessions archived before this are returned
 */
function filterArchivedBefore(sessions, date) {
  const cutoff = new Date(date);
  if (isNaN(cutoff.getTime())) throw new Error(`Invalid date: "${date}"`);
  return sessions.filter(s => isArchived(s) && new Date(s.archivedAt) < cutoff);
}

module.exports = { archiveSession, unarchiveSession, isArchived, filterArchived, filterActive, filterArchivedBefore };

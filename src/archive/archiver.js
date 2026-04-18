const { getSession, removeSession, listSessions } = require('../session/manager');

function archiveSession(name, archivedAt = new Date().toISOString()) {
  const session = getSession(name);
  if (!session) throw new Error(`Session "${name}" not found`);
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

module.exports = { archiveSession, unarchiveSession, isArchived, filterArchived, filterActive };

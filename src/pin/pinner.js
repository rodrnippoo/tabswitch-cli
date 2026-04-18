const { loadSessions, saveSessions } = require('../session/store');

function pinSession(sessionId) {
  const sessions = loadSessions();
  const session = sessions[sessionId];
  if (!session) throw new Error(`Session '${sessionId}' not found`);
  session.pinned = true;
  session.pinnedAt = new Date().toISOString();
  sessions[sessionId] = session;
  saveSessions(sessions);
  return session;
}

function unpinSession(sessionId) {
  const sessions = loadSessions();
  const session = sessions[sessionId];
  if (!session) throw new Error(`Session '${sessionId}' not found`);
  session.pinned = false;
  delete session.pinnedAt;
  sessions[sessionId] = session;
  saveSessions(sessions);
  return session;
}

function listPinned() {
  const sessions = loadSessions();
  return Object.values(sessions)
    .filter(s => s.pinned)
    .sort((a, b) => new Date(a.pinnedAt) - new Date(b.pinnedAt));
}

function isPinned(sessionId) {
  const sessions = loadSessions();
  return !!(sessions[sessionId] && sessions[sessionId].pinned);
}

module.exports = { pinSession, unpinSession, listPinned, isPinned };

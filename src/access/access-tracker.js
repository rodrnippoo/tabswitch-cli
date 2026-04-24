const { recordAccess, getAccessEntry, resetAccess, getMostAccessed, getRecentlyAccessed } = require('./access-log');
const { loadAccessLog, saveAccessLog } = require('./access-store');

function trackOpen(sessionId) {
  const log = loadAccessLog();
  const updated = recordAccess(log, sessionId);
  saveAccessLog(updated);
  return updated[sessionId];
}

function getEntry(sessionId) {
  const log = loadAccessLog();
  return getAccessEntry(log, sessionId);
}

function reset(sessionId) {
  const log = loadAccessLog();
  const updated = resetAccess(log, sessionId);
  saveAccessLog(updated);
}

function topAccessed(limit = 5) {
  const log = loadAccessLog();
  return getMostAccessed(log, limit);
}

function recentlyOpened(limit = 5) {
  const log = loadAccessLog();
  return getRecentlyAccessed(log, limit);
}

module.exports = {
  trackOpen,
  getEntry,
  reset,
  topAccessed,
  recentlyOpened,
};

// Tracks access history for sessions (last opened, open count, etc.)

const DEFAULT_ENTRY = () => ({
  openCount: 0,
  lastAccessed: null,
  firstAccessed: null,
});

function recordAccess(log, sessionId) {
  const now = new Date().toISOString();
  const entry = log[sessionId] || DEFAULT_ENTRY();
  return {
    ...log,
    [sessionId]: {
      openCount: entry.openCount + 1,
      lastAccessed: now,
      firstAccessed: entry.firstAccessed || now,
    },
  };
}

function getAccessEntry(log, sessionId) {
  return log[sessionId] || DEFAULT_ENTRY();
}

function resetAccess(log, sessionId) {
  const updated = { ...log };
  delete updated[sessionId];
  return updated;
}

function getMostAccessed(log, limit = 5) {
  return Object.entries(log)
    .map(([sessionId, entry]) => ({ sessionId, ...entry }))
    .sort((a, b) => b.openCount - a.openCount)
    .slice(0, limit);
}

function getRecentlyAccessed(log, limit = 5) {
  return Object.entries(log)
    .filter(([, entry]) => entry.lastAccessed !== null)
    .map(([sessionId, entry]) => ({ sessionId, ...entry }))
    .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
    .slice(0, limit);
}

module.exports = {
  recordAccess,
  getAccessEntry,
  resetAccess,
  getMostAccessed,
  getRecentlyAccessed,
};

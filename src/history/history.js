const { loadSessions, saveSessions } = require('../session/store');

const HISTORY_KEY = '__history__';
const MAX_HISTORY = 50;

async function recordOpen(sessionName, urls) {
  const sessions = await loadSessions();
  if (!sessions[HISTORY_KEY]) {
    sessions[HISTORY_KEY] = [];
  }

  const entry = {
    sessionName,
    urls,
    openedAt: new Date().toISOString(),
  };

  sessions[HISTORY_KEY].unshift(entry);

  if (sessions[HISTORY_KEY].length > MAX_HISTORY) {
    sessions[HISTORY_KEY] = sessions[HISTORY_KEY].slice(0, MAX_HISTORY);
  }

  await saveSessions(sessions);
  return entry;
}

async function getHistory(limit = 10) {
  const sessions = await loadSessions();
  const history = sessions[HISTORY_KEY] || [];
  return history.slice(0, limit);
}

async function clearHistory() {
  const sessions = await loadSessions();
  sessions[HISTORY_KEY] = [];
  await saveSessions(sessions);
}

async function findInHistory(query) {
  const history = await getHistory(MAX_HISTORY);
  const q = query.toLowerCase();
  return history.filter(
    (entry) =>
      entry.sessionName.toLowerCase().includes(q) ||
      entry.urls.some((url) => url.toLowerCase().includes(q))
  );
}

module.exports = { recordOpen, getHistory, clearHistory, findInHistory };

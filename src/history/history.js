const path = require('path');
const { loadSessions, saveSessions, ensureDir } = require('../session/store');

const HISTORY_FILE = path.join(process.env.HOME || process.env.USERPROFILE, '.tabswitch', 'history.json');

async function loadHistory() {
  try {
    await ensureDir();
    const data = require('fs').existsSync(HISTORY_FILE)
      ? JSON.parse(require('fs').readFileSync(HISTORY_FILE, 'utf8'))
      : [];
    return data;
  } catch {
    return [];
  }
}

async function saveHistory(history) {
  await ensureDir();
  require('fs').writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function recordOpen(sessionName, urls) {
  const history = await loadHistory();
  history.unshift({
    sessionName,
    urls,
    openedAt: new Date().toISOString()
  });
  const trimmed = history.slice(0, 100);
  await saveHistory(trimmed);
  return trimmed[0];
}

async function getHistory(limit = 20) {
  const history = await loadHistory();
  return history.slice(0, limit);
}

async function clearHistory() {
  await saveHistory([]);
}

async function getSessionHistory(sessionName) {
  const history = await loadHistory();
  return history.filter(entry => entry.sessionName === sessionName);
}

module.exports = { recordOpen, getHistory, clearHistory, getSessionHistory };

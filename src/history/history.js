const path = require('path');
const fs = require('fs-extra');
const os = require('os');

const HISTORY_FILE = path.join(os.homedir(), '.tabswitch', 'history.json');
const MAX_HISTORY = 100;

async function ensureFile() {
  await fs.ensureFile(HISTORY_FILE);
  const content = await fs.readFile(HISTORY_FILE, 'utf8').catch(() => '');
  if (!content.trim()) await fs.writeJson(HISTORY_FILE, []);
}

async function loadHistory() {
  await ensureFile();
  return fs.readJson(HISTORY_FILE).catch(() => []);
}

async function saveHistory(history) {
  await ensureFile();
  await fs.writeJson(HISTORY_FILE, history, { spaces: 2 });
}

async function recordOpen(sessionName, urls = []) {
  const history = await loadHistory();
  const entry = {
    sessionName,
    urls,
    openedAt: new Date().toISOString()
  };
  history.unshift(entry);
  const trimmed = history.slice(0, MAX_HISTORY);
  await saveHistory(trimmed);
  return entry;
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
  return history.filter(e => e.sessionName === sessionName);
}

module.exports = { recordOpen, getHistory, clearHistory, getSessionHistory };

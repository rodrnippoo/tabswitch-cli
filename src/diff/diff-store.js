const fs = require('fs');
const path = require('path');
const os = require('os');

const DIFF_DIR = path.join(os.homedir(), '.tabswitch', 'diffs');
const DIFF_FILE = path.join(DIFF_DIR, 'diff-log.json');

function ensureDir() {
  if (!fs.existsSync(DIFF_DIR)) {
    fs.mkdirSync(DIFF_DIR, { recursive: true });
  }
}

function loadDiffLog() {
  ensureDir();
  if (!fs.existsSync(DIFF_FILE)) return [];
  return JSON.parse(fs.readFileSync(DIFF_FILE, 'utf-8'));
}

function saveDiffLog(log) {
  ensureDir();
  fs.writeFileSync(DIFF_FILE, JSON.stringify(log, null, 2));
}

function recordDiff(sessionAName, sessionBName, diff) {
  const log = loadDiffLog();
  log.push({
    id: Date.now().toString(),
    sessionA: sessionAName,
    sessionB: sessionBName,
    diff,
    createdAt: new Date().toISOString()
  });
  saveDiffLog(log);
}

function getDiffHistory(limit = 20) {
  const log = loadDiffLog();
  return log.slice(-limit).reverse();
}

function clearDiffLog() {
  saveDiffLog([]);
}

module.exports = { loadDiffLog, saveDiffLog, recordDiff, getDiffHistory, clearDiffLog };

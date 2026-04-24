const fs = require('fs');
const path = require('path');
const os = require('os');

const ACCESS_DIR = path.join(os.homedir(), '.tabswitch');
const ACCESS_FILE = path.join(ACCESS_DIR, 'access-log.json');

function ensureDir() {
  if (!fs.existsSync(ACCESS_DIR)) {
    fs.mkdirSync(ACCESS_DIR, { recursive: true });
  }
}

function loadAccessLog() {
  ensureDir();
  if (!fs.existsSync(ACCESS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(ACCESS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveAccessLog(log) {
  ensureDir();
  fs.writeFileSync(ACCESS_FILE, JSON.stringify(log, null, 2));
}

function updateAccessEntry(sessionId, updater) {
  const log = loadAccessLog();
  const updated = updater(log);
  saveAccessLog(updated);
  return updated;
}

function clearAccessLog() {
  saveAccessLog({});
}

module.exports = {
  ensureDir,
  loadAccessLog,
  saveAccessLog,
  updateAccessEntry,
  clearAccessLog,
};

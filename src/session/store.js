const fs = require('fs');
const path = require('path');
const os = require('os');

const SESSION_DIR = path.join(os.homedir(), '.tabswitch');
const SESSION_FILE = path.join(SESSION_DIR, 'sessions.json');

function ensureDir() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }
}

function loadSessions() {
  ensureDir();
  if (!fs.existsSync(SESSION_FILE)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(SESSION_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveSessions(sessions) {
  ensureDir();
  fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2), 'utf8');
}

function saveSession(name, tabs) {
  const sessions = loadSessions();
  sessions[name] = {
    name,
    tabs,
    createdAt: sessions[name]?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveSessions(sessions);
  return sessions[name];
}

function getSession(name) {
  const sessions = loadSessions();
  return sessions[name] || null;
}

function deleteSession(name) {
  const sessions = loadSessions();
  if (!sessions[name]) return false;
  delete sessions[name];
  saveSessions(sessions);
  return true;
}

function listSessions() {
  const sessions = loadSessions();
  return Object.values(sessions);
}

module.exports = { saveSession, getSession, deleteSession, listSessions, SESSION_FILE };

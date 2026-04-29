const fs = require('fs');
const path = require('path');
const os = require('os');

const AUDIT_DIR = path.join(os.homedir(), '.tabswitch', 'audit');
const AUDIT_FILE = path.join(AUDIT_DIR, 'audit-log.json');

function ensureDir() {
  if (!fs.existsSync(AUDIT_DIR)) {
    fs.mkdirSync(AUDIT_DIR, { recursive: true });
  }
}

function loadAuditLog() {
  ensureDir();
  if (!fs.existsSync(AUDIT_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveAuditLog(entries) {
  ensureDir();
  fs.writeFileSync(AUDIT_FILE, JSON.stringify(entries, null, 2));
}

function appendAuditEntry(entry) {
  const entries = loadAuditLog();
  entries.push(entry);
  saveAuditLog(entries);
}

function clearAuditLog() {
  saveAuditLog([]);
}

function getAuditLog() {
  return loadAuditLog();
}

module.exports = {
  ensureDir,
  loadAuditLog,
  saveAuditLog,
  appendAuditEntry,
  clearAuditLog,
  getAuditLog,
};

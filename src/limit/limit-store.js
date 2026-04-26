// limit-store.js — persist tab limits to disk

const fs = require('fs');
const path = require('path');
const os = require('os');

const LIMITS_DIR = path.join(os.homedir(), '.tabswitch', 'limits');
const LIMITS_FILE = path.join(LIMITS_DIR, 'limits.json');

function ensureDir() {
  if (!fs.existsSync(LIMITS_DIR)) {
    fs.mkdirSync(LIMITS_DIR, { recursive: true });
  }
}

function loadLimits() {
  ensureDir();
  if (!fs.existsSync(LIMITS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(LIMITS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveLimits(limits) {
  ensureDir();
  fs.writeFileSync(LIMITS_FILE, JSON.stringify(limits, null, 2));
}

function saveLimit(limit) {
  const limits = loadLimits();
  limits[limit.sessionId] = limit;
  saveLimits(limits);
}

function getLimit(sessionId) {
  const limits = loadLimits();
  return limits[sessionId] ?? null;
}

function deleteLimit(sessionId) {
  const limits = loadLimits();
  if (!limits[sessionId]) return false;
  delete limits[sessionId];
  saveLimits(limits);
  return true;
}

function listLimits() {
  return Object.values(loadLimits());
}

module.exports = { ensureDir, loadLimits, saveLimits, saveLimit, getLimit, deleteLimit, listLimits };

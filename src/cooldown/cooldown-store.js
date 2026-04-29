// cooldown-store.js — persist cooldown records to disk

const fs = require('fs');
const path = require('path');
const os = require('os');

const COOLDOWN_DIR = path.join(os.homedir(), '.tabswitch', 'cooldowns');
const COOLDOWN_FILE = path.join(COOLDOWN_DIR, 'cooldowns.json');

function ensureDir() {
  if (!fs.existsSync(COOLDOWN_DIR)) {
    fs.mkdirSync(COOLDOWN_DIR, { recursive: true });
  }
}

function loadCooldowns() {
  ensureDir();
  if (!fs.existsSync(COOLDOWN_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(COOLDOWN_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveCooldowns(cooldowns) {
  ensureDir();
  fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(cooldowns, null, 2));
}

function saveCooldown(cooldown) {
  const all = loadCooldowns();
  all[cooldown.sessionId] = cooldown;
  saveCooldowns(all);
}

function getCooldown(sessionId) {
  const all = loadCooldowns();
  return all[sessionId] || null;
}

function deleteCooldown(sessionId) {
  const all = loadCooldowns();
  delete all[sessionId];
  saveCooldowns(all);
}

function listCooldowns() {
  return Object.values(loadCooldowns());
}

module.exports = {
  ensureDir,
  loadCooldowns,
  saveCooldowns,
  saveCooldown,
  getCooldown,
  deleteCooldown,
  listCooldowns,
};

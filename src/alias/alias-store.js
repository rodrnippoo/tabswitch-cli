const fs = require('fs');
const path = require('path');
const os = require('os');

const ALIAS_DIR = path.join(os.homedir(), '.tabswitch');
const ALIAS_FILE = path.join(ALIAS_DIR, 'aliases.json');

function ensureDir() {
  if (!fs.existsSync(ALIAS_DIR)) fs.mkdirSync(ALIAS_DIR, { recursive: true });
}

function loadAliases() {
  ensureDir();
  if (!fs.existsSync(ALIAS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(ALIAS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveAliases(aliases) {
  ensureDir();
  fs.writeFileSync(ALIAS_FILE, JSON.stringify(aliases, null, 2));
}

function saveAlias(alias) {
  const aliases = loadAliases();
  const existing = aliases.findIndex(a => a.name === alias.name);
  if (existing >= 0) aliases[existing] = alias;
  else aliases.push(alias);
  saveAliases(aliases);
}

function deleteAlias(name) {
  const aliases = loadAliases();
  saveAliases(aliases.filter(a => a.name !== name));
}

module.exports = { loadAliases, saveAliases, saveAlias, deleteAlias };

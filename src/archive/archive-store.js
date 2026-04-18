const fs = require('fs');
const path = require('path');
const os = require('os');

const ARCHIVE_DIR = path.join(os.homedir(), '.tabswitch', 'archive');
const ARCHIVE_FILE = path.join(ARCHIVE_DIR, 'archived.json');

function ensureDir() {
  if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

function loadArchive() {
  ensureDir();
  if (!fs.existsSync(ARCHIVE_FILE)) return [];
  return JSON.parse(fs.readFileSync(ARCHIVE_FILE, 'utf-8'));
}

function saveArchive(sessions) {
  ensureDir();
  fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(sessions, null, 2));
}

function addToArchive(session) {
  const archive = loadArchive();
  const exists = archive.find(s => s.name === session.name);
  if (exists) throw new Error(`Session "${session.name}" already archived`);
  archive.push(session);
  saveArchive(archive);
}

function removeFromArchive(name) {
  const archive = loadArchive();
  const updated = archive.filter(s => s.name !== name);
  if (updated.length === archive.length) throw new Error(`Archived session "${name}" not found`);
  saveArchive(updated);
}

function getArchivedSession(name) {
  return loadArchive().find(s => s.name === name) || null;
}

module.exports = { loadArchive, saveArchive, addToArchive, removeFromArchive, getArchivedSession };

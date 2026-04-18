const fs = require('fs');
const path = require('path');
const os = require('os');

const NOTES_DIR = path.join(os.homedir(), '.tabswitch', 'notes');
const NOTES_FILE = path.join(NOTES_DIR, 'notes.json');

function ensureDir() {
  if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
  }
}

function loadNotes() {
  ensureDir();
  if (!fs.existsSync(NOTES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveNotes(notes) {
  ensureDir();
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
}

function saveNote(sessionId, notes) {
  const all = loadNotes();
  all[sessionId] = notes;
  saveNotes(all);
}

function getNotes(sessionId) {
  const all = loadNotes();
  return all[sessionId] || [];
}

function deleteNotes(sessionId) {
  const all = loadNotes();
  delete all[sessionId];
  saveNotes(all);
}

module.exports = { loadNotes, saveNotes, saveNote, getNotes, deleteNotes };

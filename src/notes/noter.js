const { getSession, saveSession } = require('../session/store');

function addNote(sessionId, note) {
  const session = getSession(sessionId);
  if (!session) throw new Error(`Session '${sessionId}' not found`);
  const notes = session.notes || [];
  const entry = { id: Date.now().toString(), text: note, createdAt: new Date().toISOString() };
  notes.push(entry);
  const updated = { ...session, notes };
  saveSession(updated);
  return entry;
}

function removeNote(sessionId, noteId) {
  const session = getSession(sessionId);
  if (!session) throw new Error(`Session '${sessionId}' not found`);
  const notes = (session.notes || []).filter(n => n.id !== noteId);
  saveSession({ ...session, notes });
  return notes;
}

function listNotes(sessionId) {
  const session = getSession(sessionId);
  if (!session) throw new Error(`Session '${sessionId}' not found`);
  return session.notes || [];
}

function editNote(sessionId, noteId, newText) {
  const session = getSession(sessionId);
  if (!session) throw new Error(`Session '${sessionId}' not found`);
  const notes = (session.notes || []).map(n =>
    n.id === noteId ? { ...n, text: newText, updatedAt: new Date().toISOString() } : n
  );
  saveSession({ ...session, notes });
  return notes.find(n => n.id === noteId);
}

module.exports = { addNote, removeNote, listNotes, editNote };

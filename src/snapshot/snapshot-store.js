const { loadSessions, saveSessions } = require('../session/store');

function listSnapshots() {
  const sessions = loadSessions();
  return Object.values(sessions).filter(s => s.type === 'snapshot');
}

function getSnapshot(name) {
  const sessions = loadSessions();
  const snap = sessions[name];
  if (!snap || snap.type !== 'snapshot') return null;
  return snap;
}

function deleteSnapshot(name) {
  const sessions = loadSessions();
  if (!sessions[name] || sessions[name].type !== 'snapshot') {
    throw new Error(`Snapshot "${name}" not found`);
  }
  delete sessions[name];
  saveSessions(sessions);
}

module.exports = { listSnapshots, getSnapshot, deleteSnapshot };

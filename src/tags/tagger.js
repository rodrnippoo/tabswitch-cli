const { loadSessions, saveSessions } = require('../session/store');

async function addTag(sessionName, tag) {
  const sessions = await loadSessions();
  if (!sessions[sessionName]) throw new Error(`Session '${sessionName}' not found`);
  if (!sessions[sessionName].tags) sessions[sessionName].tags = [];
  const normalized = tag.trim().toLowerCase();
  if (sessions[sessionName].tags.includes(normalized)) return sessions[sessionName];
  sessions[sessionName].tags.push(normalized);
  await saveSessions(sessions);
  return sessions[sessionName];
}

async function removeTag(sessionName, tag) {
  const sessions = await loadSessions();
  if (!sessions[sessionName]) throw new Error(`Session '${sessionName}' not found`);
  const normalized = tag.trim().toLowerCase();
  sessions[sessionName].tags = (sessions[sessionName].tags || []).filter(t => t !== normalized);
  await saveSessions(sessions);
  return sessions[sessionName];
}

async function listByTag(tag) {
  const sessions = await loadSessions();
  const normalized = tag.trim().toLowerCase();
  return Object.entries(sessions)
    .filter(([, s]) => Array.isArray(s.tags) && s.tags.includes(normalized))
    .map(([name, s]) => ({ name, ...s }));
}

async function listAllTags() {
  const sessions = await loadSessions();
  const tagSet = new Set();
  Object.values(sessions).forEach(s => (s.tags || []).forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

module.exports = { addTag, removeTag, listByTag, listAllTags };

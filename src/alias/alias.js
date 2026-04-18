// alias.js - create and resolve short aliases for sessions

function createAlias(name, sessionId) {
  if (!name || typeof name !== 'string') throw new Error('Alias name is required');
  if (!sessionId || typeof sessionId !== 'string') throw new Error('Session ID is required');
  return {
    name: name.trim().toLowerCase(),
    sessionId,
    createdAt: new Date().toISOString()
  };
}

function resolveAlias(aliases, name) {
  if (!name) return null;
  return aliases.find(a => a.name === name.trim().toLowerCase()) || null;
}

function removeAlias(aliases, name) {
  const normalized = name.trim().toLowerCase();
  return aliases.filter(a => a.name !== normalized);
}

function listAliases(aliases) {
  return [...aliases].sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { createAlias, resolveAlias, removeAlias, listAliases };

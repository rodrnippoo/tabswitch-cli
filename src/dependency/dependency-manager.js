// dependency-manager.js — high-level API for managing session dependencies

const {
  createDependency,
  addDependency,
  removeDependency,
  getDependencies,
  getDependents,
  hasCycle
} = require('./dependency');
const store = require('./dependency-store');

function addLink(sourceId, targetId, reason = '') {
  const all = store.loadDependencies();
  if (hasCycle(all, sourceId, targetId)) {
    throw new Error(`Adding this dependency would create a cycle: ${sourceId} -> ${targetId}`);
  }
  const updated = addDependency(all, sourceId, targetId, reason);
  store.saveDependencies(updated);
  return updated.find(d => d.sourceId === sourceId && d.targetId === targetId);
}

function removeLink(sourceId, targetId) {
  const all = store.loadDependencies();
  const updated = removeDependency(all, sourceId, targetId);
  store.saveDependencies(updated);
}

function listDependencies(sessionId) {
  return getDependencies(store.loadDependencies(), sessionId);
}

function listDependents(sessionId) {
  return getDependents(store.loadDependencies(), sessionId);
}

function clearSession(sessionId) {
  store.clearDependenciesForSession(sessionId);
}

module.exports = { addLink, removeLink, listDependencies, listDependents, clearSession };

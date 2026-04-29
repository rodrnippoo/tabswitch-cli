// dependency.js — model and core logic for session dependencies

function createDependency(sourceId, targetId, reason = '') {
  if (!sourceId || !targetId) throw new Error('sourceId and targetId are required');
  if (sourceId === targetId) throw new Error('A session cannot depend on itself');
  return {
    sourceId,
    targetId,
    reason: reason.trim(),
    createdAt: new Date().toISOString()
  };
}

function addDependency(dependencies, sourceId, targetId, reason) {
  const existing = dependencies.find(
    d => d.sourceId === sourceId && d.targetId === targetId
  );
  if (existing) throw new Error(`Dependency already exists: ${sourceId} -> ${targetId}`);
  const dep = createDependency(sourceId, targetId, reason);
  return [...dependencies, dep];
}

function removeDependency(dependencies, sourceId, targetId) {
  const next = dependencies.filter(
    d => !(d.sourceId === sourceId && d.targetId === targetId)
  );
  if (next.length === dependencies.length) throw new Error('Dependency not found');
  return next;
}

function getDependencies(dependencies, sessionId) {
  return dependencies.filter(d => d.sourceId === sessionId);
}

function getDependents(dependencies, sessionId) {
  return dependencies.filter(d => d.targetId === sessionId);
}

function hasCycle(dependencies, sourceId, targetId) {
  const visited = new Set();
  const queue = [targetId];
  while (queue.length) {
    const current = queue.shift();
    if (current === sourceId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    dependencies.filter(d => d.sourceId === current).forEach(d => queue.push(d.targetId));
  }
  return false;
}

module.exports = { createDependency, addDependency, removeDependency, getDependencies, getDependents, hasCycle };

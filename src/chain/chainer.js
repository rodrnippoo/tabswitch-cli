/**
 * Session chaining — link sessions into an ordered sequence
 * so they can be opened one after another.
 */

function createChain(name, sessionIds = []) {
  return {
    name,
    sessionIds: [...sessionIds],
    createdAt: new Date().toISOString(),
  };
}

function addToChain(chain, sessionId) {
  if (chain.sessionIds.includes(sessionId)) {
    throw new Error(`Session "${sessionId}" is already in chain "${chain.name}"`);
  }
  return { ...chain, sessionIds: [...chain.sessionIds, sessionId] };
}

function removeFromChain(chain, sessionId) {
  const updated = chain.sessionIds.filter((id) => id !== sessionId);
  if (updated.length === chain.sessionIds.length) {
    throw new Error(`Session "${sessionId}" not found in chain "${chain.name}"`);
  }
  return { ...chain, sessionIds: updated };
}

function reorderChain(chain, fromIndex, toIndex) {
  const ids = [...chain.sessionIds];
  if (fromIndex < 0 || fromIndex >= ids.length || toIndex < 0 || toIndex >= ids.length) {
    throw new Error('Index out of bounds');
  }
  const [moved] = ids.splice(fromIndex, 1);
  ids.splice(toIndex, 0, moved);
  return { ...chain, sessionIds: ids };
}

function renameChain(chain, newName) {
  if (!newName || !newName.trim()) {
    throw new Error('Chain name cannot be empty');
  }
  return { ...chain, name: newName.trim() };
}

function getChainStep(chain, index) {
  if (index < 0 || index >= chain.sessionIds.length) return null;
  return chain.sessionIds[index];
}

module.exports = {
  createChain,
  addToChain,
  removeFromChain,
  reorderChain,
  renameChain,
  getChainStep,
};

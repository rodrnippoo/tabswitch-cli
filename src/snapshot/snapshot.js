const { saveSession, loadSession } = require('../session/store');
const { normalizeUrl } = require('../session/manager');
const { addToHistory } = require('../history/history');

/**
 * Create a snapshot from a raw list of URLs with a given name.
 */
function createSnapshot(name, urls, tags = []) {
  if (!name || typeof name !== 'string') throw new Error('Snapshot name is required');
  if (!Array.isArray(urls) || urls.length === 0) throw new Error('At least one URL is required');

  const normalizedUrls = urls.map(normalizeUrl);
  const snapshot = {
    name,
    urls: normalizedUrls,
    tags,
    createdAt: new Date().toISOString(),
    type: 'snapshot',
  };

  saveSession(name, snapshot);
  addToHistory({ action: 'snapshot-created', name, urlCount: normalizedUrls.length });
  return snapshot;
}

/**
 * Diff two snapshots by name, returning added/removed URLs.
 */
function diffSnapshots(snapshotA, snapshotB) {
  const setA = new Set(snapshotA.urls);
  const setB = new Set(snapshotB.urls);

  const added = snapshotB.urls.filter(u => !setA.has(u));
  const removed = snapshotA.urls.filter(u => !setB.has(u));
  const common = snapshotA.urls.filter(u => setB.has(u));

  return { added, removed, common };
}

/**
 * Load a snapshot by name and return it, or throw if not found.
 */
function getSnapshot(name) {
  if (!name || typeof name !== 'string') throw new Error('Snapshot name is required');
  const snapshot = loadSession(name);
  if (!snapshot) throw new Error(`Snapshot "${name}" not found`);
  if (snapshot.type !== 'snapshot') throw new Error(`"${name}" is not a snapshot`);
  return snapshot;
}

module.exports = { createSnapshot, diffSnapshots, getSnapshot };

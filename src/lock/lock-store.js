const fs = require('fs');
const path = require('path');
const { loadSessions, saveSessions } = require('../session/store');

async function getLockMeta(dataDir) {
  const lockFile = path.join(dataDir, 'locks.json');
  try {
    const raw = await fs.promises.readFile(lockFile, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveLockMeta(dataDir, meta) {
  const lockFile = path.join(dataDir, 'locks.json');
  await fs.promises.writeFile(lockFile, JSON.stringify(meta, null, 2));
}

async function persistLock(dataDir, sessionId, lockedAt) {
  const meta = await getLockMeta(dataDir);
  meta[sessionId] = { lockedAt };
  await saveLockMeta(dataDir, meta);
}

async function persistUnlock(dataDir, sessionId) {
  const meta = await getLockMeta(dataDir);
  delete meta[sessionId];
  await saveLockMeta(dataDir, meta);
}

async function listLockedIds(dataDir) {
  const meta = await getLockMeta(dataDir);
  return Object.keys(meta);
}

module.exports = {
  getLockMeta,
  persistLock,
  persistUnlock,
  listLockedIds,
};

// Session locking — prevent accidental edits or deletions on important sessions

function lockSession(session) {
  if (!session || !session.id) throw new Error('Invalid session');
  return { ...session, locked: true, lockedAt: new Date().toISOString() };
}

function unlockSession(session) {
  if (!session || !session.id) throw new Error('Invalid session');
  const updated = { ...session };
  delete updated.locked;
  delete updated.lockedAt;
  return updated;
}

function isLocked(session) {
  return session && session.locked === true;
}

function assertUnlocked(session) {
  if (isLocked(session)) {
    throw new Error(`Session "${session.name}" is locked. Unlock it first.`);
  }
}

function filterLocked(sessions) {
  return sessions.filter(isLocked);
}

function filterUnlocked(sessions) {
  return sessions.filter(s => !isLocked(s));
}

module.exports = {
  lockSession,
  unlockSession,
  isLocked,
  assertUnlocked,
  filterLocked,
  filterUnlocked,
};

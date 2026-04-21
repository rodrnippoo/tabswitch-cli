const { lockSession, unlockSession, isLocked, filterLocked } = require('../lock/locker');
const { persistLock, persistUnlock, listLockedIds } = require('../lock/lock-store');
const { loadSessions, saveSessions } = require('../session/store');

function registerLockCommands(program, dataDir) {
  const lock = program.command('lock').description('Lock or unlock sessions');

  lock
    .command('add <name>')
    .description('Lock a session to prevent modification')
    .action(async (name) => {
      const sessions = await loadSessions(dataDir);
      const idx = sessions.findIndex(s => s.name === name);
      if (idx === -1) return console.error(`Session "${name}" not found.`);
      if (isLocked(sessions[idx])) return console.log(`Session "${name}" is already locked.`);
      sessions[idx] = lockSession(sessions[idx]);
      await saveSessions(dataDir, sessions);
      await persistLock(dataDir, sessions[idx].id, sessions[idx].lockedAt);
      console.log(`Locked session "${name}".`);
    });

  lock
    .command('remove <name>')
    .description('Unlock a session')
    .action(async (name) => {
      const sessions = await loadSessions(dataDir);
      const idx = sessions.findIndex(s => s.name === name);
      if (idx === -1) return console.error(`Session "${name}" not found.`);
      if (!isLocked(sessions[idx])) return console.log(`Session "${name}" is not locked.`);
      sessions[idx] = unlockSession(sessions[idx]);
      await saveSessions(dataDir, sessions);
      await persistUnlock(dataDir, sessions[idx].id);
      console.log(`Unlocked session "${name}".`);
    });

  lock
    .command('list')
    .description('List all locked sessions')
    .action(async () => {
      const sessions = await loadSessions(dataDir);
      const locked = filterLocked(sessions);
      if (!locked.length) return console.log('No locked sessions.');
      locked.forEach(s => console.log(`  🔒 ${s.name}  (locked at ${s.lockedAt})`));
    });
}

module.exports = { registerLockCommands };

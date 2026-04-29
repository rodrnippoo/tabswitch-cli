const { setExpiry, clearExpiry, isExpired, daysUntilExpiry, purgeExpired } = require('../expiry/expirer');
const { loadSessions, saveSessions, getSession } = require('../session/store');

function registerExpiryCommands(program) {
  const expiry = program.command('expiry').description('Manage session expiry');

  expiry
    .command('set <sessionId> <days>')
    .description('Set a TTL (in days) on a session')
    .action(async (sessionId, days) => {
      const sessions = await loadSessions();
      const session = getSession(sessions, sessionId);
      if (!session) {
        console.error(`Session "${sessionId}" not found.`);
        process.exit(1);
      }
      const d = parseInt(days, 10);
      const updated = setExpiry(session, d);
      const next = sessions.map(s => s.id === sessionId ? updated : s);
      await saveSessions(next);
      console.log(`Expiry set: "${sessionId}" expires in ${d} day(s).`);
    });

  expiry
    .command('clear <sessionId>')
    .description('Remove expiry from a session')
    .action(async (sessionId) => {
      const sessions = await loadSessions();
      const session = getSession(sessions, sessionId);
      if (!session) {
        console.error(`Session "${sessionId}" not found.`);
        process.exit(1);
      }
      const updated = clearExpiry(session);
      const next = sessions.map(s => s.id === sessionId ? updated : s);
      await saveSessions(next);
      console.log(`Expiry cleared for "${sessionId}".`);
    });

  expiry
    .command('status <sessionId>')
    .description('Check expiry status of a session')
    .action(async (sessionId) => {
      const sessions = await loadSessions();
      const session = getSession(sessions, sessionId);
      if (!session) {
        console.error(`Session "${sessionId}" not found.`);
        process.exit(1);
      }
      if (!session.expiresAt) {
        console.log(`"${sessionId}" has no expiry set.`);
      } else if (isExpired(session)) {
        console.log(`"${sessionId}" is EXPIRED.`);
      } else {
        const days = daysUntilExpiry(session);
        console.log(`"${sessionId}" expires in ${days} day(s).`);
      }
    });

  expiry
    .command('purge')
    .description('Remove all expired sessions')
    .action(async () => {
      const sessions = await loadSessions();
      const { remaining, purged } = purgeExpired(sessions);
      await saveSessions(remaining);
      if (purged.length === 0) {
        console.log('No expired sessions found.');
      } else {
        console.log(`Purged ${purged.length} expired session(s):`);
        purged.forEach(s => console.log(`  - ${s.id} (${s.name})`));
      }
    });
}

module.exports = { registerExpiryCommands };

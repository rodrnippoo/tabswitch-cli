const { getDecayLevel, filterByDecay, summarizeDecay, purgeDeadSessions } = require('../decay/decayer');
const { loadSessions, saveSessions } = require('../session/store');

function registerDecayCommands(program) {
  const decay = program.command('decay').description('Manage session decay based on inactivity');

  decay
    .command('status <name>')
    .description('Show decay level for a session')
    .action(async (name) => {
      const sessions = await loadSessions();
      const session = sessions.find(s => s.name === name);
      if (!session) return console.error(`Session "${name}" not found.`);
      const level = getDecayLevel(session);
      console.log(`Session "${name}" decay level: ${level}`);
    });

  decay
    .command('list <level>')
    .description('List sessions at a given decay level (fresh|warn|stale|dead)')
    .action(async (level) => {
      const sessions = await loadSessions();
      const matched = filterByDecay(sessions, level);
      if (!matched.length) return console.log(`No sessions at decay level "${level}".`);
      matched.forEach(s => console.log(`  - ${s.name} (${s.tabs?.length ?? 0} tabs)`));
    });

  decay
    .command('summary')
    .description('Show decay summary across all sessions')
    .action(async () => {
      const sessions = await loadSessions();
      const summary = summarizeDecay(sessions);
      console.log('Decay summary:');
      for (const [level, count] of Object.entries(summary)) {
        console.log(`  ${level}: ${count}`);
      }
    });

  decay
    .command('purge')
    .description('Remove all dead sessions')
    .action(async () => {
      const sessions = await loadSessions();
      const surviving = purgeDeadSessions(sessions);
      const removed = sessions.length - surviving.length;
      await saveSessions(surviving);
      console.log(`Purged ${removed} dead session(s).`);
    });
}

module.exports = { registerDecayCommands };

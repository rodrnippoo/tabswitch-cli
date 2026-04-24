const {
  setPriority,
  getPriority,
  removePriority,
  sortByPriority,
  filterByPriority,
  PRIORITY_LEVELS,
} = require('../priority/prioritizer');
const { loadSessions, saveSessions, getSession } = require('../session/store');

function registerPriorityCommands(program) {
  const priority = program.command('priority').description('Manage session priorities');

  priority
    .command('set <session> <level>')
    .description(`Set priority for a session (${PRIORITY_LEVELS.join('|')})`)
    .action(async (name, level) => {
      try {
        const sessions = await loadSessions();
        const session = getSession(sessions, name);
        if (!session) return console.error(`Session "${name}" not found.`);
        const updated = setPriority(session, level);
        sessions[name] = updated;
        await saveSessions(sessions);
        console.log(`Priority for "${name}" set to "${level}".`);
      } catch (err) {
        console.error(err.message);
      }
    });

  priority
    .command('get <session>')
    .description('Get priority of a session')
    .action(async (name) => {
      const sessions = await loadSessions();
      const session = getSession(sessions, name);
      if (!session) return console.error(`Session "${name}" not found.`);
      console.log(`Priority: ${getPriority(session)}`);
    });

  priority
    .command('clear <session>')
    .description('Remove priority from a session')
    .action(async (name) => {
      const sessions = await loadSessions();
      const session = getSession(sessions, name);
      if (!session) return console.error(`Session "${name}" not found.`);
      sessions[name] = removePriority(session);
      await saveSessions(sessions);
      console.log(`Priority cleared for "${name}".`);
    });

  priority
    .command('list')
    .description('List sessions sorted by priority')
    .option('-f, --filter <level>', 'Filter by exact priority level')
    .action(async (opts) => {
      const sessions = await loadSessions();
      let list = Object.values(sessions);
      if (opts.filter) {
        try {
          list = filterByPriority(list, opts.filter);
        } catch (err) {
          return console.error(err.message);
        }
      }
      const sorted = sortByPriority(list);
      if (!sorted.length) return console.log('No sessions found.');
      sorted.forEach(s => console.log(`[${getPriority(s).toUpperCase()}] ${s.name}`));
    });
}

module.exports = { registerPriorityCommands };

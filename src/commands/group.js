const { listSessions } = require('../session/manager');
const { groupSessions } = require('../group/grouper');

function registerGroupCommands(program) {
  const group = program.command('group').description('Group sessions by various properties');

  group
    .command('by <property>')
    .description('Group sessions by tag, domain, or date')
    .option('--json', 'Output as JSON')
    .action((property, opts) => {
      const sessions = listSessions();
      if (!sessions.length) {
        console.log('No sessions found.');
        return;
      }

      let grouped;
      try {
        grouped = groupSessions(sessions, property);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }

      if (opts.json) {
        console.log(JSON.stringify(grouped, null, 2));
        return;
      }

      for (const [key, items] of Object.entries(grouped)) {
        console.log(`\n[${key}] (${items.length} session${items.length !== 1 ? 's' : ''})`);
        for (const s of items) {
          const urlCount = (s.urls || []).length;
          console.log(`  - ${s.name} (${urlCount} url${urlCount !== 1 ? 's' : ''})`);
        }
      }
    });

  group
    .command('list-keys <property>')
    .description('List unique group keys for a property')
    .action((property) => {
      const sessions = listSessions();
      const grouped = groupSessions(sessions, property);
      const keys = Object.keys(grouped).sort();
      if (!keys.length) {
        console.log('No groups found.');
      } else {
        keys.forEach(k => console.log(k));
      }
    });
}

module.exports = { registerGroupCommands };

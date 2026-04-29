const { record, getAll, forSession, forAction, inRange, summary, clear } = require('../audit/audit-manager');

function registerAuditCommands(program) {
  const audit = program.command('audit').description('View and manage the session audit log');

  audit
    .command('log')
    .description('Show the full audit log')
    .option('--session <id>', 'Filter by session ID')
    .option('--action <action>', 'Filter by action type')
    .action((opts) => {
      let entries = getAll();
      if (opts.session) entries = forSession(opts.session);
      if (opts.action) entries = forAction(opts.action);
      if (entries.length === 0) {
        console.log('No audit entries found.');
        return;
      }
      entries.forEach(e => {
        const ts = new Date(e.timestamp).toISOString();
        console.log(`[${ts}] ${e.action.toUpperCase()} session=${e.sessionId} (${e.id})`);
        if (Object.keys(e.meta).length > 0) {
          console.log('  meta:', JSON.stringify(e.meta));
        }
      });
    });

  audit
    .command('summary')
    .description('Show action counts across the audit log')
    .action(() => {
      const counts = summary();
      if (Object.keys(counts).length === 0) {
        console.log('Audit log is empty.');
        return;
      }
      for (const [action, count] of Object.entries(counts)) {
        console.log(`  ${action}: ${count}`);
      }
    });

  audit
    .command('clear')
    .description('Clear the entire audit log')
    .action(() => {
      clear();
      console.log('Audit log cleared.');
    });
}

module.exports = { registerAuditCommands };

const { trackOpen, getEntry, reset, topAccessed, recentlyOpened } = require('../access/access-tracker');

function registerAccessCommands(program) {
  const access = program.command('access').description('Track and view session access history');

  access
    .command('track <sessionId>')
    .description('Record an access event for a session')
    .action((sessionId) => {
      const entry = trackOpen(sessionId);
      console.log(`Tracked access for "${sessionId}". Total opens: ${entry.openCount}`);
    });

  access
    .command('info <sessionId>')
    .description('Show access info for a session')
    .action((sessionId) => {
      const entry = getEntry(sessionId);
      if (!entry.lastAccessed) {
        console.log(`No access history found for "${sessionId}".`);
      } else {
        console.log(`Session: ${sessionId}`);
        console.log(`  Open count:     ${entry.openCount}`);
        console.log(`  First accessed: ${entry.firstAccessed}`);
        console.log(`  Last accessed:  ${entry.lastAccessed}`);
      }
    });

  access
    .command('top')
    .description('Show most frequently accessed sessions')
    .option('-n, --limit <number>', 'Number of results', '5')
    .action((opts) => {
      const results = topAccessed(parseInt(opts.limit, 10));
      if (!results.length) return console.log('No access data available.');
      results.forEach((r, i) => {
        console.log(`${i + 1}. ${r.sessionId} — ${r.openCount} opens (last: ${r.lastAccessed})`);
      });
    });

  access
    .command('recent')
    .description('Show recently accessed sessions')
    .option('-n, --limit <number>', 'Number of results', '5')
    .action((opts) => {
      const results = recentlyOpened(parseInt(opts.limit, 10));
      if (!results.length) return console.log('No recent access data.');
      results.forEach((r, i) => {
        console.log(`${i + 1}. ${r.sessionId} — last opened ${r.lastAccessed}`);
      });
    });

  access
    .command('reset <sessionId>')
    .description('Clear access history for a session')
    .action((sessionId) => {
      reset(sessionId);
      console.log(`Access history cleared for "${sessionId}".`);
    });
}

module.exports = { registerAccessCommands };

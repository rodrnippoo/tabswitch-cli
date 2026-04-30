const { getSession, listSessions } = require('../session/manager');
const { restoreSession, restoreMany, summarizeRestore } = require('../restore/restorer');

function registerRestoreCommands(program) {
  const restore = program.command('restore').description('Restore browser tab sessions');

  restore
    .command('session <name>')
    .description('Restore a single session by name')
    .option('-b, --browser <browser>', 'browser to use')
    .option('--skip-archived', 'skip if session is archived', false)
    .option('--skip-locked', 'skip if session is locked', false)
    .option('--skip-hidden', 'skip if session is hidden', false)
    .option('--url-filter <pattern>', 'only restore URLs matching pattern')
    .option('--dry-run', 'preview restore without opening browser', false)
    .action(async (name, opts) => {
      const session = await getSession(name);
      if (!session) {
        console.error(`Session "${name}" not found.`);
        process.exit(1);
      }
      const result = await restoreSession(session, {
        browser: opts.browser,
        skipArchived: opts.skipArchived,
        skipLocked: opts.skipLocked,
        skipHidden: opts.skipHidden,
        urlFilter: opts.urlFilter,
        dryRun: opts.dryRun,
      });
      if (result.dryRun) {
        console.log(`[dry-run] Would restore ${result.urls.length} URL(s) from "${result.session}":`);
        result.urls.forEach((u) => console.log(`  ${u}`));
      } else if (result.skipped) {
        console.log(`Skipped "${result.session}": ${result.reason}`);
      } else {
        console.log(`Restored ${result.count} tab(s) from "${result.session}".`);
      }
    });

  restore
    .command('all')
    .description('Restore all sessions')
    .option('-b, --browser <browser>', 'browser to use')
    .option('--skip-archived', 'skip archived sessions', true)
    .option('--skip-locked', 'skip locked sessions', false)
    .option('--skip-hidden', 'skip hidden sessions', false)
    .option('--dry-run', 'preview without opening browser', false)
    .action(async (opts) => {
      const sessions = await listSessions();
      if (!sessions.length) {
        console.log('No sessions found.');
        return;
      }
      const results = await restoreMany(sessions, {
        browser: opts.browser,
        skipArchived: opts.skipArchived,
        skipLocked: opts.skipLocked,
        skipHidden: opts.skipHidden,
        dryRun: opts.dryRun,
      });
      const summary = summarizeRestore(results);
      if (opts.dryRun) {
        console.log(`[dry-run] Would restore ${summary.dryRun} session(s), skip ${summary.skipped}.`);
      } else {
        console.log(`Restored ${summary.restored} session(s), skipped ${summary.skipped}.`);
      }
    });
}

module.exports = { registerRestoreCommands };

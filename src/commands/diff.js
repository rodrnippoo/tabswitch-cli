const { diffSessions, hasDiff, summarizeDiff } = require('../diff/differ');
const { recordDiff, getDiffHistory } = require('../diff/diff-store');
const { getSession, listSessions } = require('../session/manager');

function registerDiffCommands(program) {
  const diff = program.command('diff').description('Diff and compare sessions');

  diff
    .command('compare <sessionA> <sessionB>')
    .description('Compare two sessions and show URL differences')
    .option('--save', 'Save the diff to history')
    .action((sessionAName, sessionBName, opts) => {
      const sessionA = getSession(sessionAName);
      const sessionB = getSession(sessionBName);

      if (!sessionA) return console.error(`Session not found: ${sessionAName}`);
      if (!sessionB) return console.error(`Session not found: ${sessionBName}`);

      const result = diffSessions(sessionA, sessionB);

      console.log(`\nDiff: ${sessionAName} → ${sessionBName}`);
      console.log(`Summary: ${summarizeDiff(result)}\n`);

      if (result.added.length) {
        console.log('Added:');
        result.added.forEach(u => console.log(`  + ${u}`));
      }
      if (result.removed.length) {
        console.log('Removed:');
        result.removed.forEach(u => console.log(`  - ${u}`));
      }
      if (!hasDiff(result)) {
        console.log('Sessions are identical.');
      }

      if (opts.save) {
        recordDiff(sessionAName, sessionBName, result);
        console.log('\nDiff saved to history.');
      }
    });

  diff
    .command('history')
    .description('Show recent diff history')
    .option('-n, --limit <n>', 'Number of entries to show', '10')
    .action(opts => {
      const entries = getDiffHistory(parseInt(opts.limit, 10));
      if (!entries.length) return console.log('No diff history found.');
      entries.forEach(e => {
        console.log(`[${e.createdAt}] ${e.sessionA} vs ${e.sessionB}: ${summarizeDiff(e.diff)}`);
      });
    });
}

module.exports = { registerDiffCommands };

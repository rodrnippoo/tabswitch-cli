const { loadSessions } = require('../session/store');
const { computeStats } = require('../stats/stats');

function registerStatsCommands(program) {
  program
    .command('stats')
    .description('Show usage statistics for all saved sessions')
    .option('--json', 'Output stats as JSON')
    .action(async (opts) => {
      let sessions;
      try {
        sessions = await loadSessions();
      } catch (err) {
        console.error('Failed to load sessions:', err.message);
        process.exit(1);
      }

      if (!sessions.length) {
        console.log('No sessions found.');
        return;
      }

      const stats = computeStats(sessions);

      if (opts.json) {
        console.log(JSON.stringify(stats, null, 2));
        return;
      }

      console.log('\n📊 Session Statistics');
      console.log('─────────────────────────────');
      console.log(`  Total sessions   : ${stats.totalSessions}`);
      console.log(`  Total tabs       : ${stats.totalTabs}`);
      console.log(`  Avg tabs/session : ${stats.averageTabs}`);
      console.log(`  Most used domain : ${stats.mostUsedDomain || 'n/a'}`);
      console.log(`  Oldest session   : ${stats.oldestSession || 'n/a'}`);
      console.log(`  Newest session   : ${stats.newestSession || 'n/a'}`);
      console.log('');
    });
}

module.exports = { registerStatsCommands };

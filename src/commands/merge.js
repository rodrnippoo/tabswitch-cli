const { mergeSessions, previewMerge } = require('../merge/merger');
const { recordMerge } = require('../merge/merge-store');
const { getSession, saveSession, listSessions } = require('../session/store');

function registerMergeCommands(program) {
  const merge = program.command('merge').description('Merge multiple sessions into one');

  merge
    .command('run <name> <sources...>')
    .description('Merge named sessions into a new session')
    .option('--preview', 'Preview the merge without saving')
    .action(async (name, sources, opts) => {
      try {
        const sessions = sources.map(src => {
          const s = getSession(src);
          if (!s) throw new Error(`Session not found: ${src}`);
          return s;
        });

        if (opts.preview) {
          const info = previewMerge(sessions);
          console.log(`Preview merge into "${name}":`);
          console.log(`  Total URLs: ${info.totalUrls}`);
          console.log(`  Unique URLs: ${info.uniqueUrls}`);
          console.log(`  Duplicates removed: ${info.duplicatesRemoved}`);
          info.sources.forEach(s => console.log(`  - ${s.name} (${s.urlCount} URLs)`));
          return;
        }

        const merged = mergeSessions(sessions, name);
        saveSession(merged);
        recordMerge(merged, sources);
        console.log(`Merged ${sources.length} sessions into "${name}" (${merged.urls.length} URLs)`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    });

  merge
    .command('history')
    .description('Show merge history')
    .action(() => {
      const { getMergeHistory } = require('../merge/merge-store');
      const history = getMergeHistory();
      if (!history.length) {
        console.log('No merge history found.');
        return;
      }
      history.forEach(h => {
        console.log(`[${h.timestamp}] ${h.sources.join(' + ')} => "${h.resultName}" (${h.urlCount} URLs)`);
      });
    });
}

module.exports = { registerMergeCommands };

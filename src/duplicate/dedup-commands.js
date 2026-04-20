const { findDuplicatesInSession, findDuplicatesAcrossSessions, deduplicateSession } = require('./duplicate-detector');
const { loadSessions, saveSessions } = require('../session/store');

function registerDedupCommands(program) {
  const dedup = program.command('dedup').description('Detect and remove duplicate URLs in sessions');

  dedup
    .command('check [sessionName]')
    .description('Check for duplicate URLs in one or all sessions')
    .action(async (sessionName) => {
      const sessions = await loadSessions();

      if (sessionName) {
        const session = sessions[sessionName];
        if (!session) {
          console.error(`Session "${sessionName}" not found.`);
          process.exit(1);
        }
        const dupes = findDuplicatesInSession(session);
        if (dupes.length === 0) {
          console.log(`No duplicates found in "${sessionName}".`);
        } else {
          console.log(`Duplicates in "${sessionName}":`);
          dupes.forEach(({ url, indices }) => {
            console.log(`  ${url} (appears at indices: ${indices.join(', ')})`);
          });
        }
      } else {
        const results = findDuplicatesAcrossSessions(sessions);
        if (Object.keys(results).length === 0) {
          console.log('No duplicates found across any session.');
        } else {
          for (const [name, dupes] of Object.entries(results)) {
            console.log(`\n[${name}]`);
            dupes.forEach(({ url, indices }) => {
              console.log(`  ${url} (indices: ${indices.join(', ')})`);
            });
          }
        }
      }
    });

  dedup
    .command('clean <sessionName>')
    .description('Remove duplicate URLs from a session, keeping first occurrence')
    .option('--dry-run', 'Preview changes without saving')
    .action(async (sessionName, opts) => {
      const sessions = await loadSessions();
      const session = sessions[sessionName];
      if (!session) {
        console.error(`Session "${sessionName}" not found.`);
        process.exit(1);
      }
      const { cleaned, removed } = deduplicateSession(session);
      if (removed.length === 0) {
        console.log(`No duplicates to remove in "${sessionName}".`);
        return;
      }
      console.log(`Removed ${removed.length} duplicate(s):`);
      removed.forEach((url) => console.log(`  - ${url}`));
      if (!opts.dryRun) {
        sessions[sessionName] = cleaned;
        await saveSessions(sessions);
        console.log(`Session "${sessionName}" cleaned and saved.`);
      } else {
        console.log('Dry run — no changes saved.');
      }
    });
}

module.exports = { registerDedupCommands };

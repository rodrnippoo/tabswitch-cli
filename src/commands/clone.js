'use strict';

const { cloneSession, buildCloneName } = require('../clone/cloner');
const { loadSessions, saveSessions } = require('../session/store');

/**
 * Register clone-related CLI commands.
 * @param {import('commander').Command} program
 */
function registerCloneCommands(program) {
  const clone = program.command('clone').description('Clone an existing session');

  clone
    .command('create <sessionName> [cloneName]')
    .description('Clone a session. If cloneName is omitted, one is generated automatically.')
    .option('--strip-tags', 'do not copy tags to the clone')
    .option('--strip-notes', 'do not copy notes to the clone')
    .action(async (sessionName, cloneName, opts) => {
      const sessions = await loadSessions();
      const source = sessions.find(s => s.name === sessionName);

      if (!source) {
        console.error(`Session "${sessionName}" not found.`);
        process.exit(1);
      }

      const existingNames = sessions.map(s => s.name);
      const resolvedName = cloneName
        ? cloneName.trim()
        : buildCloneName(sessionName, existingNames);

      if (existingNames.includes(resolvedName)) {
        console.error(`A session named "${resolvedName}" already exists.`);
        process.exit(1);
      }

      const cloned = cloneSession(source, resolvedName, {
        stripTags: opts.stripTags,
        stripNotes: opts.stripNotes,
      });

      await saveSessions([...sessions, cloned]);
      console.log(`Cloned "${sessionName}" → "${resolvedName}" (${cloned.urls.length} tab(s)).`);
    });

  clone
    .command('origin <sessionName>')
    .description('Show which session a clone was copied from')
    .action(async (sessionName) => {
      const sessions = await loadSessions();
      const session = sessions.find(s => s.name === sessionName);

      if (!session) {
        console.error(`Session "${sessionName}" not found.`);
        process.exit(1);
      }

      if (!session.clonedFrom) {
        console.log(`"${sessionName}" is not a clone.`);
        return;
      }

      const origin = sessions.find(s => s.id === session.clonedFrom);
      if (origin) {
        console.log(`Cloned from: ${origin.name} (${origin.id})`);
      } else {
        console.log(`Cloned from session id: ${session.clonedFrom} (original no longer exists)`);
      }
    });
}

module.exports = { registerCloneCommands };

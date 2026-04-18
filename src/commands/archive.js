const { archiveSession, unarchiveSession } = require('../archive/archiver');
const { addToArchive, removeFromArchive, loadArchive, getArchivedSession } = require('../archive/archive-store');
const { saveSession } = require('../session/store');
const { removeSession } = require('../session/manager');

function registerArchiveCommands(program) {
  const archive = program.command('archive').description('Manage archived sessions');

  archive
    .command('add <name>')
    .description('Archive a session')
    .action((name) => {
      try {
        const archived = archiveSession(name);
        addToArchive(archived);
        removeSession(name);
        console.log(`Session "${name}" archived.`);
      } catch (e) {
        console.error(e.message);
      }
    });

  archive
    .command('restore <name>')
    .description('Restore an archived session')
    .action((name) => {
      try {
        const session = getArchivedSession(name);
        if (!session) throw new Error(`Archived session "${name}" not found`);
        const restored = unarchiveSession(session);
        saveSession(restored);
        removeFromArchive(name);
        console.log(`Session "${name}" restored.`);
      } catch (e) {
        console.error(e.message);
      }
    });

  archive
    .command('list')
    .description('List all archived sessions')
    .action(() => {
      const sessions = loadArchive();
      if (!sessions.length) return console.log('No archived sessions.');
      sessions.forEach(s => console.log(`  ${s.name} — archived at ${s.archivedAt}`));
    });

  archive
    .command('delete <name>')
    .description('Permanently delete an archived session')
    .action((name) => {
      try {
        removeFromArchive(name);
        console.log(`Archived session "${name}" deleted permanently.`);
      } catch (e) {
        console.error(e.message);
      }
    });
}

module.exports = { registerArchiveCommands };

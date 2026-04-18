const manager = require('../session/manager');

function registerSessionCommands(program) {
  const session = program.command('session').description('Manage tab sessions');

  session
    .command('save <name> <urls...>')
    .description('Save a new session with the given URLs')
    .action((name, urls) => {
      try {
        const saved = manager.createSession(name, urls);
        console.log(`✔ Session "${saved.name}" saved with ${saved.tabs.length} tab(s).`);
      } catch (err) {
        console.error(`✖ ${err.message}`);
        process.exit(1);
      }
    });

  session
    .command('list')
    .description('List all saved sessions')
    .action(() => {
      const sessions = manager.listSessions();
      if (sessions.length === 0) {
        console.log('No sessions saved yet.');
        return;
      }
      sessions.forEach((s) => {
        console.log(`  ${s.name.padEnd(20)} ${s.tabs.length} tab(s)  [${s.updatedAt}]`);
      });
    });

  session
    .command('show <name>')
    .description('Show tabs in a session')
    .action((name) => {
      try {
        const s = manager.getSession(name);
        console.log(`Session: ${s.name}`);
        s.tabs.forEach((t) => console.log(`  [${t.id}] ${t.url}`));
      } catch (err) {
        console.error(`✖ ${err.message}`);
        process.exit(1);
      }
    });

  session
    .command('delete <name>')
    .description('Delete a saved session')
    .action((name) => {
      try {
        manager.removeSession(name);
        console.log(`✔ Session "${name}" deleted.`);
      } catch (err) {
        console.error(`✖ ${err.message}`);
        process.exit(1);
      }
    });
}

module.exports = { registerSessionCommands };

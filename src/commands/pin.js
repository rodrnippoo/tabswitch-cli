const { pinSession, unpinSession, listPinned } = require('../pin/pinner');

function registerPinCommands(program) {
  const pin = program.command('pin').description('Manage pinned sessions');

  pin
    .command('add <sessionId>')
    .description('Pin a session')
    .action((sessionId) => {
      try {
        const session = pinSession(sessionId);
        console.log(`Pinned session '${session.name || sessionId}'`);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  pin
    .command('remove <sessionId>')
    .description('Unpin a session')
    .action((sessionId) => {
      try {
        const session = unpinSession(sessionId);
        console.log(`Unpinned session '${session.name || sessionId}'`);
      } catch (err) {
        console.error(err.message);
        process.exit(1);
      }
    });

  pin
    .command('list')
    .description('List all pinned sessions')
    .action(() => {
      const pinned = listPinned();
      if (!pinned.length) {
        console.log('No pinned sessions.');
        return;
      }
      pinned.forEach(s => {
        console.log(`[${s.id}] ${s.name || '(unnamed)'} — pinned at ${s.pinnedAt}`);
      });
    });
}

module.exports = { registerPinCommands };

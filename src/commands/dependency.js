// commands/dependency.js — CLI commands for session dependency management

const manager = require('../dependency/dependency-manager');

function registerDependencyCommands(program) {
  const dep = program.command('dep').description('Manage session dependencies');

  dep
    .command('add <sourceId> <targetId>')
    .description('Add a dependency from one session to another')
    .option('-r, --reason <reason>', 'Reason for the dependency', '')
    .action((sourceId, targetId, opts) => {
      try {
        const link = manager.addLink(sourceId, targetId, opts.reason);
        console.log(`Dependency added: ${link.sourceId} -> ${link.targetId}`);
        if (link.reason) console.log(`Reason: ${link.reason}`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
    });

  dep
    .command('remove <sourceId> <targetId>')
    .description('Remove a dependency between two sessions')
    .action((sourceId, targetId) => {
      try {
        manager.removeLink(sourceId, targetId);
        console.log(`Dependency removed: ${sourceId} -> ${targetId}`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
    });

  dep
    .command('list <sessionId>')
    .description('List sessions that <sessionId> depends on')
    .action((sessionId) => {
      const deps = manager.listDependencies(sessionId);
      if (!deps.length) return console.log('No dependencies found.');
      deps.forEach(d => console.log(`  -> ${d.targetId}${d.reason ? ` (${d.reason})` : ''}`));
    });

  dep
    .command('dependents <sessionId>')
    .description('List sessions that depend on <sessionId>')
    .action((sessionId) => {
      const deps = manager.listDependents(sessionId);
      if (!deps.length) return console.log('No dependents found.');
      deps.forEach(d => console.log(`  <- ${d.sourceId}${d.reason ? ` (${d.reason})` : ''}`));
    });

  dep
    .command('clear <sessionId>')
    .description('Remove all dependencies involving a session')
    .action((sessionId) => {
      manager.clearSession(sessionId);
      console.log(`All dependencies cleared for session: ${sessionId}`);
    });
}

module.exports = { registerDependencyCommands };

const { createAlias, resolveAlias, removeAlias, listAliases } = require('../alias/alias');
const { loadAliases, saveAlias, deleteAlias } = require('../alias/alias-store');

function registerAliasCommands(program) {
  const alias = program.command('alias').description('Manage session aliases');

  alias
    .command('add <name> <sessionId>')
    .description('Create an alias for a session')
    .action((name, sessionId) => {
      try {
        const a = createAlias(name, sessionId);
        saveAlias(a);
        console.log(`Alias '${a.name}' -> ${sessionId} created.`);
      } catch (e) {
        console.error('Error:', e.message);
      }
    });

  alias
    .command('remove <name>')
    .description('Remove an alias')
    .action((name) => {
      deleteAlias(name.trim().toLowerCase());
      console.log(`Alias '${name}' removed.`);
    });

  alias
    .command('resolve <name>')
    .description('Resolve alias to session ID')
    .action((name) => {
      const aliases = loadAliases();
      const found = resolveAlias(aliases, name);
      if (!found) return console.log('No alias found.');
      console.log(`${found.name} -> ${found.sessionId}`);
    });

  alias
    .command('list')
    .description('List all aliases')
    .action(() => {
      const aliases = listAliases(loadAliases());
      if (!aliases.length) return console.log('No aliases defined.');
      aliases.forEach(a => console.log(`  ${a.name.padEnd(20)} -> ${a.sessionId}`));
    });
}

module.exports = { registerAliasCommands };

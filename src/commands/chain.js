const {
  createChain,
  addToChain,
  removeFromChain,
  reorderChain,
  renameChain,
} = require('../chain/chainer');

// Simple in-memory store shim — real impl would use a persistent store
let _chains = {};

function getAll() { return _chains; }
function get(name) { return _chains[name] || null; }
function set(name, chain) { _chains[name] = chain; }
function del(name) { delete _chains[name]; }

function registerChainCommands(program) {
  const chain = program.command('chain').description('Manage session chains');

  chain
    .command('new <name>')
    .description('Create a new session chain')
    .action((name) => {
      if (get(name)) return console.error(`Chain "${name}" already exists`);
      set(name, createChain(name));
      console.log(`Chain "${name}" created`);
    });

  chain
    .command('add <chain> <sessionId>')
    .description('Add a session to a chain')
    .action((chainName, sessionId) => {
      const c = get(chainName);
      if (!c) return console.error(`Chain "${chainName}" not found`);
      try {
        set(chainName, addToChain(c, sessionId));
        console.log(`Added "${sessionId}" to chain "${chainName}"`);
      } catch (e) {
        console.error(e.message);
      }
    });

  chain
    .command('remove <chain> <sessionId>')
    .description('Remove a session from a chain')
    .action((chainName, sessionId) => {
      const c = get(chainName);
      if (!c) return console.error(`Chain "${chainName}" not found`);
      try {
        set(chainName, removeFromChain(c, sessionId));
        console.log(`Removed "${sessionId}" from chain "${chainName}"`);
      } catch (e) {
        console.error(e.message);
      }
    });

  chain
    .command('reorder <chain> <from> <to>')
    .description('Move a step within a chain')
    .action((chainName, from, to) => {
      const c = get(chainName);
      if (!c) return console.error(`Chain "${chainName}" not found`);
      try {
        set(chainName, reorderChain(c, Number(from), Number(to)));
        console.log(`Reordered chain "${chainName}"`);
      } catch (e) {
        console.error(e.message);
      }
    });

  chain
    .command('rename <chain> <newName>')
    .description('Rename a chain')
    .action((chainName, newName) => {
      const c = get(chainName);
      if (!c) return console.error(`Chain "${chainName}" not found`);
      try {
        const updated = renameChain(c, newName);
        del(chainName);
        set(newName, updated);
        console.log(`Renamed chain to "${newName}"`);
      } catch (e) {
        console.error(e.message);
      }
    });

  chain
    .command('list')
    .description('List all chains')
    .action(() => {
      const all = getAll();
      const names = Object.keys(all);
      if (!names.length) return console.log('No chains found');
      names.forEach((n) => {
        console.log(`${n}: ${all[n].sessionIds.join(' → ') || '(empty)'}`);
      });
    });
}

module.exports = { registerChainCommands };

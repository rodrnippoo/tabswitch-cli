const { createSnapshot, diffSnapshots } = require('../snapshot/snapshot');
const { listSnapshots, getSnapshot, deleteSnapshot } = require('../snapshot/snapshot-store');

function registerSnapshotCommands(program) {
  const snap = program.command('snapshot').description('Manage URL snapshots');

  snap
    .command('create <name> <urls...>')
    .description('Create a snapshot from a list of URLs')
    .option('-t, --tags <tags>', 'Comma-separated tags', '')
    .action((name, urls, opts) => {
      const tags = opts.tags ? opts.tags.split(',').map(t => t.trim()) : [];
      const snapshot = createSnapshot(name, urls, tags);
      console.log(`Snapshot "${snapshot.name}" created with ${snapshot.urls.length} URL(s).`);
    });

  snap
    .command('list')
    .description('List all snapshots')
    .action(() => {
      const snapshots = listSnapshots();
      if (snapshots.length === 0) return console.log('No snapshots found.');
      snapshots.forEach(s => {
        console.log(`  ${s.name} (${s.urls.length} URLs) — ${s.createdAt}`);
      });
    });

  snap
    .command('diff <nameA> <nameB>')
    .description('Diff two snapshots')
    .action((nameA, nameB) => {
      const a = getSnapshot(nameA);
      const b = getSnapshot(nameB);
      if (!a) return console.error(`Snapshot "${nameA}" not found.`);
      if (!b) return console.error(`Snapshot "${nameB}" not found.`);
      const { added, removed, common } = diffSnapshots(a, b);
      console.log(`Common: ${common.length}, Added: ${added.length}, Removed: ${removed.length}`);
      added.forEach(u => console.log(`  + ${u}`));
      removed.forEach(u => console.log(`  - ${u}`));
    });

  snap
    .command('delete <name>')
    .description('Delete a snapshot')
    .action((name) => {
      deleteSnapshot(name);
      console.log(`Snapshot "${name}" deleted.`);
    });
}

module.exports = { registerSnapshotCommands };

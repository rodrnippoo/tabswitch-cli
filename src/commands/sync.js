const { exportSessions, exportPlaintext } = require('../sync/exporter');
const { importSessions } = require('../sync/importer');

function registerSyncCommands(program) {
  const sync = program.command('sync').description('Import and export tab sessions');

  sync
    .command('export <file>')
    .description('Export all sessions to a JSON file')
    .option('--plain', 'Export as plaintext (one URL per line)')
    .action(async (file, opts) => {
      try {
        const result = opts.plain
          ? await exportPlaintext(file)
          : await exportSessions(file);
        console.log(`✓ Exported ${result.count} session(s) to ${result.path}`);
      } catch (err) {
        console.error('Export failed:', err.message);
        process.exit(1);
      }
    });

  sync
    .command('import <file>')
    .description('Import sessions from a JSON export file')
    .option('--overwrite', 'Overwrite existing sessions with the same name')
    .action(async (file, opts) => {
      try {
        const { imported, skipped } = await importSessions(file, {
          overwrite: opts.overwrite,
        });
        if (imported.length) console.log(`✓ Imported: ${imported.join(', ')}`);
        if (skipped.length)
          console.log(`⚠ Skipped (already exist): ${skipped.join(', ')}`);
        if (!imported.length && !skipped.length)
          console.log('No sessions found in file.');
      } catch (err) {
        console.error('Import failed:', err.message);
        process.exit(1);
      }
    });
}

module.exports = { registerSyncCommands };

const { exportSessions } = require('../export/exporter');

function registerExportCommands(program) {
  program
    .command('export <output>')
    .description('Export sessions to a file')
    .option('-f, --format <format>', 'Output format: json, csv, markdown', 'json')
    .option('-t, --tags <tags>', 'Filter by tags (comma-separated)')
    .option('-n, --names <names>', 'Filter by session names (comma-separated)')
    .action(async (output, opts) => {
      try {
        const options = {};

        if (opts.tags) {
          options.tags = opts.tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        if (opts.names) {
          options.names = opts.names.split(',').map(n => n.trim()).filter(Boolean);
        }

        const result = await exportSessions(output, opts.format, options);
        console.log(`✓ Exported ${result.count} session(s) to ${result.path} [${result.format}]`);
      } catch (err) {
        console.error('Export failed:', err.message);
        process.exit(1);
      }
    });
}

module.exports = { registerExportCommands };

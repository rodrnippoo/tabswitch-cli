const fs = require('fs');
const path = require('path');
const { loadSessions } = require('../session/store');

async function exportSessions(outputPath, options = {}) {
  const sessions = await loadSessions();

  if (!sessions || Object.keys(sessions).length === 0) {
    throw new Error('No sessions found to export.');
  }

  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    sessions,
  };

  const format = options.format || 'json';

  if (format === 'json') {
    const json = JSON.stringify(exportData, null, 2);
    const filePath = outputPath || path.resolve(process.cwd(), 'tabswitch-export.json');
    fs.writeFileSync(filePath, json, 'utf8');
    return filePath;
  }

  throw new Error(`Unsupported export format: ${format}`);
}

module.exports = { exportSessions };

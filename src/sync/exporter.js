const fs = require('fs');
const path = require('path');
const { loadSessions } = require('../session/store');

/**
 * Export sessions to a JSON file
 */
async function exportSessions(outputPath) {
  const sessions = await loadSessions();
  const data = {
    exportedAt: new Date().toISOString(),
    version: 1,
    sessions,
  };
  const resolved = path.resolve(outputPath);
  fs.writeFileSync(resolved, JSON.stringify(data, null, 2), 'utf8');
  return { path: resolved, count: Object.keys(sessions).length };
}

/**
 * Export sessions to a simple plaintext format (one URL per line, sessions separated)
 */
async function exportPlaintext(outputPath) {
  const sessions = await loadSessions();
  const lines = [];
  for (const [name, session] of Object.entries(sessions)) {
    lines.push(`# ${name}`);
    (session.urls || []).forEach(url => lines.push(url));
    lines.push('');
  }
  const resolved = path.resolve(outputPath);
  fs.writeFileSync(resolved, lines.join('\n'), 'utf8');
  return { path: resolved, count: Object.keys(sessions).length };
}

module.exports = { exportSessions, exportPlaintext };

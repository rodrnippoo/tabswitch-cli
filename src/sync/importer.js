const fs = require('fs');
const path = require('path');
const { loadSessions, saveSessions } = require('../session/store');
const { normalizeUrl } = require('../session/manager');

/**
 * Import sessions from a JSON export file
 */
async function importSessions(inputPath, { overwrite = false } = {}) {
  const resolved = path.resolve(inputPath);
  if (!fs.existsSync(resolved)) throw new Error(`File not found: ${resolved}`);

  const raw = fs.readFileSync(resolved, 'utf8');
  const data = JSON.parse(raw);

  if (!data.sessions || typeof data.sessions !== 'object') {
    throw new Error('Invalid export file format');
  }

  const existing = await loadSessions();
  const imported = [];
  const skipped = [];

  for (const [name, session] of Object.entries(data.sessions)) {
    if (existing[name] && !overwrite) {
      skipped.push(name);
      continue;
    }
    existing[name] = {
      ...session,
      urls: (session.urls || []).map(normalizeUrl),
      importedAt: new Date().toISOString(),
    };
    imported.push(name);
  }

  await saveSessions(existing);
  return { imported, skipped };
}

module.exports = { importSessions };

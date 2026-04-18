const fs = require('fs');
const { loadSessions, saveSessions } = require('../session/store');

async function importSessions(filePath, options = {}) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error('Invalid JSON file.');
  }

  if (!parsed.sessions || typeof parsed.sessions !== 'object') {
    throw new Error('Invalid export file: missing sessions field.');
  }

  const incoming = parsed.sessions;
  const existing = await loadSessions();
  const merged = options.overwrite ? { ...existing, ...incoming } : { ...incoming, ...existing };

  await saveSessions(merged);

  return {
    imported: Object.keys(incoming).length,
    total: Object.keys(merged).length,
  };
}

module.exports = { importSessions };

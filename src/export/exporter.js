const fs = require('fs');
const path = require('path');
const { formatSessions } = require('./formatter');
const { loadSessions } = require('../session/store');

const EXTENSION_MAP = {
  json: '.json',
  csv: '.csv',
  markdown: '.md',
  md: '.md',
};

async function exportSessions(outputPath, format = 'json', options = {}) {
  const sessions = await loadSessions();

  let targets = Object.values(sessions);

  if (options.tags && options.tags.length) {
    targets = targets.filter(s =>
      options.tags.every(t => (s.tags || []).includes(t))
    );
  }

  if (options.names && options.names.length) {
    targets = targets.filter(s => options.names.includes(s.name));
  }

  const content = formatSessions(targets, format);

  const ext = EXTENSION_MAP[format.toLowerCase()] || '.txt';
  const resolvedPath = outputPath.endsWith(ext)
    ? outputPath
    : outputPath + ext;

  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  fs.writeFileSync(resolvedPath, content, 'utf8');

  return { path: resolvedPath, count: targets.length, format };
}

module.exports = { exportSessions };

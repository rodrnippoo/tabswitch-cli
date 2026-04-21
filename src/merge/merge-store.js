const fs = require('fs');
const path = require('path');
const os = require('os');

const MERGE_DIR = path.join(os.homedir(), '.tabswitch', 'merges');
const MERGE_LOG = path.join(MERGE_DIR, 'merge-log.json');

function ensureDir() {
  if (!fs.existsSync(MERGE_DIR)) {
    fs.mkdirSync(MERGE_DIR, { recursive: true });
  }
}

function loadMergeLog() {
  ensureDir();
  if (!fs.existsSync(MERGE_LOG)) return [];
  try {
    return JSON.parse(fs.readFileSync(MERGE_LOG, 'utf-8'));
  } catch {
    return [];
  }
}

function saveMergeLog(log) {
  ensureDir();
  fs.writeFileSync(MERGE_LOG, JSON.stringify(log, null, 2));
}

function recordMerge(mergedSession, sourceNames) {
  const log = loadMergeLog();
  log.push({
    id: `merge-${Date.now()}`,
    resultName: mergedSession.name,
    sources: sourceNames,
    timestamp: new Date().toISOString(),
    urlCount: mergedSession.urls.length,
  });
  saveMergeLog(log);
}

function getMergeHistory() {
  return loadMergeLog();
}

module.exports = { recordMerge, getMergeHistory, loadMergeLog };

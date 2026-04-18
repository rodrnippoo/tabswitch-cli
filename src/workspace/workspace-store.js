const fs = require('fs');
const path = require('path');
const os = require('os');

const WORKSPACE_DIR = path.join(os.homedir(), '.tabswitch');
const WORKSPACE_FILE = path.join(WORKSPACE_DIR, 'workspaces.json');

function ensureDir() {
  if (!fs.existsSync(WORKSPACE_DIR)) fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
}

function loadWorkspaces() {
  ensureDir();
  if (!fs.existsSync(WORKSPACE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(WORKSPACE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveWorkspaces(workspaces) {
  ensureDir();
  fs.writeFileSync(WORKSPACE_FILE, JSON.stringify(workspaces, null, 2));
}

function saveWorkspace(workspace) {
  const all = loadWorkspaces();
  all[workspace.name] = workspace;
  saveWorkspaces(all);
}

function getWorkspace(name) {
  return loadWorkspaces()[name] || null;
}

function deleteWorkspace(name) {
  const all = loadWorkspaces();
  delete all[name];
  saveWorkspaces(all);
}

function listWorkspaces() {
  return Object.values(loadWorkspaces());
}

module.exports = { loadWorkspaces, saveWorkspaces, saveWorkspace, getWorkspace, deleteWorkspace, listWorkspaces };

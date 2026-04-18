const { createWorkspace, addSessionToWorkspace, removeSessionFromWorkspace, renameWorkspace } = require('./workspace');
const { saveWorkspace, getWorkspace, deleteWorkspace, listWorkspaces } = require('./workspace-store');
const { getSession } = require('../session/manager');

function newWorkspace(name, sessionNames = []) {
  if (getWorkspace(name)) throw new Error(`Workspace "${name}" already exists.`);
  const ws = createWorkspace(name, sessionNames);
  saveWorkspace(ws);
  return ws;
}

function addSession(workspaceName, sessionName) {
  const ws = getWorkspace(workspaceName);
  if (!ws) throw new Error(`Workspace "${workspaceName}" not found.`);
  if (!getSession(sessionName)) throw new Error(`Session "${sessionName}" not found.`);
  const updated = addSessionToWorkspace(ws, sessionName);
  saveWorkspace(updated);
  return updated;
}

function removeSession(workspaceName, sessionName) {
  const ws = getWorkspace(workspaceName);
  if (!ws) throw new Error(`Workspace "${workspaceName}" not found.`);
  const updated = removeSessionFromWorkspace(ws, sessionName);
  saveWorkspace(updated);
  return updated;
}

function rename(oldName, newName) {
  const ws = getWorkspace(oldName);
  if (!ws) throw new Error(`Workspace "${oldName}" not found.`);
  if (getWorkspace(newName)) throw new Error(`Workspace "${newName}" already exists.`);
  deleteWorkspace(oldName);
  const updated = renameWorkspace(ws, newName);
  saveWorkspace(updated);
  return updated;
}

function remove(name) {
  if (!getWorkspace(name)) throw new Error(`Workspace "${name}" not found.`);
  deleteWorkspace(name);
}

module.exports = { newWorkspace, addSession, removeSession, rename, remove, listWorkspaces, getWorkspace };

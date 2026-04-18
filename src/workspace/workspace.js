const { loadSessions, saveSessions } = require('../session/store');

function createWorkspace(name, sessionNames = []) {
  return {
    name,
    sessionNames,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function addSessionToWorkspace(workspace, sessionName) {
  if (workspace.sessionNames.includes(sessionName)) return workspace;
  return {
    ...workspace,
    sessionNames: [...workspace.sessionNames, sessionName],
    updatedAt: new Date().toISOString(),
  };
}

function removeSessionFromWorkspace(workspace, sessionName) {
  return {
    ...workspace,
    sessionNames: workspace.sessionNames.filter(n => n !== sessionName),
    updatedAt: new Date().toISOString(),
  };
}

function renameWorkspace(workspace, newName) {
  return { ...workspace, name: newName, updatedAt: new Date().toISOString() };
}

module.exports = { createWorkspace, addSessionToWorkspace, removeSessionFromWorkspace, renameWorkspace };

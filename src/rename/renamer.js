/**
 * Renamer — rename sessions with validation and history tracking
 */

const { getSession, saveSession } = require('../session/store');

const MAX_NAME_LENGTH = 64;
const VALID_NAME_RE = /^[a-zA-Z0-9_\- ]+$/;

function validateName(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Session name must be a non-empty string');
  }
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error('Session name cannot be blank');
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new Error(`Session name exceeds max length of ${MAX_NAME_LENGTH}`);
  }
  if (!VALID_NAME_RE.test(trimmed)) {
    throw new Error('Session name contains invalid characters (use letters, numbers, spaces, - or _)');
  }
  return trimmed;
}

function renameSession(sessions, sessionName, newName) {
  const session = sessions[sessionName];
  if (!session) {
    throw new Error(`Session "${sessionName}" not found`);
  }

  const validatedName = validateName(newName);

  if (sessions[validatedName]) {
    throw new Error(`A session named "${validatedName}" already exists`);
  }

  const renamed = {
    ...session,
    name: validatedName,
    renamedAt: new Date().toISOString(),
    previousName: session.name || sessionName,
  };

  const updated = { ...sessions };
  delete updated[sessionName];
  updated[validatedName] = renamed;

  return updated;
}

function getRenameHistory(session) {
  if (!session) throw new Error('Session is required');
  return {
    current: session.name,
    previous: session.previousName || null,
    renamedAt: session.renamedAt || null,
  };
}

module.exports = { validateName, renameSession, getRenameHistory };

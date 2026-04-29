// Audit log: tracks mutations to sessions (create, update, delete, open)

const { v4: uuidv4 } = require('uuid');

const VALID_ACTIONS = ['create', 'update', 'delete', 'open', 'rename', 'archive', 'restore'];

function createAuditEntry(sessionId, action, meta = {}) {
  if (!VALID_ACTIONS.includes(action)) {
    throw new Error(`Invalid audit action: ${action}`);
  }
  return {
    id: uuidv4(),
    sessionId,
    action,
    timestamp: Date.now(),
    meta,
  };
}

function filterBySession(entries, sessionId) {
  return entries.filter(e => e.sessionId === sessionId);
}

function filterByAction(entries, action) {
  return entries.filter(e => e.action === action);
}

function filterByDateRange(entries, from, to) {
  return entries.filter(e => e.timestamp >= from && e.timestamp <= to);
}

function summarizeAudit(entries) {
  const counts = {};
  for (const e of entries) {
    counts[e.action] = (counts[e.action] || 0) + 1;
  }
  return counts;
}

module.exports = {
  createAuditEntry,
  filterBySession,
  filterByAction,
  filterByDateRange,
  summarizeAudit,
};

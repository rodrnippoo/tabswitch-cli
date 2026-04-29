const { createAuditEntry, filterBySession, filterByAction, filterByDateRange, summarizeAudit } = require('./auditor');
const { appendAuditEntry, getAuditLog, clearAuditLog } = require('./audit-store');

function record(sessionId, action, meta = {}) {
  const entry = createAuditEntry(sessionId, action, meta);
  appendAuditEntry(entry);
  return entry;
}

function getAll() {
  return getAuditLog();
}

function forSession(sessionId) {
  return filterBySession(getAuditLog(), sessionId);
}

function forAction(action) {
  return filterByAction(getAuditLog(), action);
}

function inRange(from, to) {
  return filterByDateRange(getAuditLog(), from, to);
}

function summary() {
  return summarizeAudit(getAuditLog());
}

function clear() {
  clearAuditLog();
}

module.exports = { record, getAll, forSession, forAction, inRange, summary, clear };

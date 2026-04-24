/**
 * labeler.js - Assign and manage custom labels on sessions
 */

const VALID_LABEL_RE = /^[a-zA-Z0-9_-]{1,32}$/;

function validateLabel(label) {
  if (!VALID_LABEL_RE.test(label)) {
    throw new Error(`Invalid label "${label}". Labels must be 1-32 alphanumeric characters, dashes, or underscores.`);
  }
}

function addLabel(session, label) {
  validateLabel(label);
  const labels = session.labels ? [...session.labels] : [];
  if (labels.includes(label)) {
    return session;
  }
  return { ...session, labels: [...labels, label] };
}

function removeLabel(session, label) {
  const labels = session.labels ? session.labels.filter(l => l !== label) : [];
  return { ...session, labels };
}

function listLabels(session) {
  return session.labels ? [...session.labels] : [];
}

function hasLabel(session, label) {
  return Array.isArray(session.labels) && session.labels.includes(label);
}

function clearLabels(session) {
  return { ...session, labels: [] };
}

function filterByLabel(sessions, label) {
  return sessions.filter(s => hasLabel(s, label));
}

function renameLabel(sessions, oldLabel, newLabel) {
  validateLabel(newLabel);
  return sessions.map(session => {
    if (!hasLabel(session, oldLabel)) return session;
    const removed = removeLabel(session, oldLabel);
    return addLabel(removed, newLabel);
  });
}

module.exports = {
  addLabel,
  removeLabel,
  listLabels,
  hasLabel,
  clearLabels,
  filterByLabel,
  renameLabel,
};

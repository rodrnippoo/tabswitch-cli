/**
 * Batch operations — apply actions to multiple sessions at once
 */

function validateBatchTarget(sessions, names) {
  if (!Array.isArray(names) || names.length === 0) {
    throw new Error('Batch target must be a non-empty array of session names');
  }
  const missing = names.filter(n => !sessions.find(s => s.name === n));
  if (missing.length > 0) {
    throw new Error(`Sessions not found: ${missing.join(', ')}`);
  }
}

function batchTag(sessions, names, tags) {
  validateBatchTarget(sessions, names);
  return sessions.map(session => {
    if (!names.includes(session.name)) return session;
    const existing = session.tags || [];
    const merged = Array.from(new Set([...existing, ...tags]));
    return { ...session, tags: merged };
  });
}

function batchUntag(sessions, names, tags) {
  validateBatchTarget(sessions, names);
  return sessions.map(session => {
    if (!names.includes(session.name)) return session;
    const existing = session.tags || [];
    return { ...session, tags: existing.filter(t => !tags.includes(t)) };
  });
}

function batchDelete(sessions, names) {
  validateBatchTarget(sessions, names);
  return sessions.filter(s => !names.includes(s.name));
}

function batchArchive(sessions, names) {
  validateBatchTarget(sessions, names);
  return sessions.map(session => {
    if (!names.includes(session.name)) return session;
    return { ...session, archived: true, archivedAt: new Date().toISOString() };
  });
}

function batchSetColor(sessions, names, color) {
  validateBatchTarget(sessions, names);
  return sessions.map(session => {
    if (!names.includes(session.name)) return session;
    return { ...session, color };
  });
}

function summarizeBatch(original, updated, names) {
  return {
    targeted: names.length,
    affected: updated.filter((s, i) => s !== original[i]).length,
    names,
  };
}

module.exports = {
  validateBatchTarget,
  batchTag,
  batchUntag,
  batchDelete,
  batchArchive,
  batchSetColor,
  summarizeBatch,
};

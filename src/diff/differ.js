/**
 * Computes a diff between two sessions, showing added/removed/unchanged URLs.
 */

function diffSessions(sessionA, sessionB) {
  const urlsA = new Set((sessionA.urls || []).map(normalizeUrl));
  const urlsB = new Set((sessionB.urls || []).map(normalizeUrl));

  const added = [...urlsB].filter(u => !urlsA.has(u));
  const removed = [...urlsA].filter(u => !urlsB.has(u));
  const unchanged = [...urlsA].filter(u => urlsB.has(u));

  return { added, removed, unchanged };
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.origin + parsed.pathname;
  } catch {
    return url.trim().toLowerCase();
  }
}

function hasDiff(diff) {
  return diff.added.length > 0 || diff.removed.length > 0;
}

function summarizeDiff(diff) {
  const parts = [];
  if (diff.added.length) parts.push(`+${diff.added.length} added`);
  if (diff.removed.length) parts.push(`-${diff.removed.length} removed`);
  if (diff.unchanged.length) parts.push(`${diff.unchanged.length} unchanged`);
  return parts.join(', ') || 'no changes';
}

function applyDiff(session, diff) {
  const current = new Set((session.urls || []).map(normalizeUrl));
  diff.removed.forEach(u => current.delete(u));
  diff.added.forEach(u => current.add(u));
  return { ...session, urls: [...current] };
}

module.exports = { diffSessions, normalizeUrl, hasDiff, summarizeDiff, applyDiff };

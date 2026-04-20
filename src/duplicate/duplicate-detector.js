const { normalizeUrl } = require('../session/manager');

/**
 * Check if two URLs are considered duplicates after normalization.
 */
function areDuplicateUrls(urlA, urlB) {
  return normalizeUrl(urlA) === normalizeUrl(urlB);
}

/**
 * Find duplicate URLs within a single session's tab list.
 * Returns an array of { url, indices } objects.
 */
function findDuplicatesInSession(session) {
  const seen = new Map();
  const duplicates = [];

  (session.tabs || []).forEach((tab, index) => {
    const normalized = normalizeUrl(tab.url);
    if (seen.has(normalized)) {
      seen.get(normalized).indices.push(index);
    } else {
      seen.set(normalized, { url: tab.url, indices: [index] });
    }
  });

  for (const entry of seen.values()) {
    if (entry.indices.length > 1) {
      duplicates.push(entry);
    }
  }

  return duplicates;
}

/**
 * Find sessions across all sessions that share at least one duplicate URL.
 * Returns a map of normalizedUrl -> [sessionName, ...]
 */
function findDuplicatesAcrossSessions(sessions) {
  const urlToSessions = new Map();

  for (const session of sessions) {
    const seen = new Set();
    for (const tab of session.tabs || []) {
      const normalized = normalizeUrl(tab.url);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        if (!urlToSessions.has(normalized)) {
          urlToSessions.set(normalized, []);
        }
        urlToSessions.get(normalized).push(session.name);
      }
    }
  }

  const result = {};
  for (const [url, sessionNames] of urlToSessions.entries()) {
    if (sessionNames.length > 1) {
      result[url] = sessionNames;
    }
  }

  return result;
}

/**
 * Deduplicate tabs within a session, keeping the first occurrence.
 */
function deduplicateSession(session) {
  const seen = new Set();
  const uniqueTabs = [];

  for (const tab of session.tabs || []) {
    const normalized = normalizeUrl(tab.url);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueTabs.push(tab);
    }
  }

  return { ...session, tabs: uniqueTabs };
}

module.exports = {
  areDuplicateUrls,
  findDuplicatesInSession,
  findDuplicatesAcrossSessions,
  deduplicateSession,
};

/**
 * Normalize a URL for comparison (lowercase, strip trailing slash)
 * @param {string} url
 * @returns {string}
 */
function normalizeUrl(url) {
  return url.trim().toLowerCase().replace(/\/$/, '');
}

/**
 * Check if two URLs are considered duplicates.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function areDuplicateUrls(a, b) {
  return normalizeUrl(a) === normalizeUrl(b);
}

/**
 * Find duplicate URLs within a single session.
 * @param {object} session - session object with a `tabs` array of URL strings
 * @returns {Array<{url: string, indices: number[]}>}
 */
function findDuplicatesInSession(session) {
  const tabs = session.tabs || [];
  const seen = new Map();

  tabs.forEach((url, idx) => {
    const key = normalizeUrl(url);
    if (!seen.has(key)) {
      seen.set(key, { url, indices: [] });
    }
    seen.get(key).indices.push(idx);
  });

  return Array.from(seen.values()).filter((entry) => entry.indices.length > 1);
}

/**
 * Find duplicates across all sessions.
 * @param {object} sessions - map of sessionName -> session
 * @returns {object} map of sessionName -> duplicate entries
 */
function findDuplicatesAcrossSessions(sessions) {
  const results = {};
  for (const [name, session] of Object.entries(sessions)) {
    const dupes = findDuplicatesInSession(session);
    if (dupes.length > 0) {
      results[name] = dupes;
    }
  }
  return results;
}

/**
 * Remove duplicate URLs from a session, keeping the first occurrence.
 * @param {object} session
 * @returns {{ cleaned: object, removed: string[] }}
 */
function deduplicateSession(session) {
  const tabs = session.tabs || [];
  const seen = new Set();
  const removed = [];
  const uniqueTabs = [];

  for (const url of tabs) {
    const key = normalizeUrl(url);
    if (seen.has(key)) {
      removed.push(url);
    } else {
      seen.add(key);
      uniqueTabs.push(url);
    }
  }

  return {
    cleaned: { ...session, tabs: uniqueTabs },
    removed,
  };
}

module.exports = {
  areDuplicateUrls,
  findDuplicatesInSession,
  findDuplicatesAcrossSessions,
  deduplicateSession,
};

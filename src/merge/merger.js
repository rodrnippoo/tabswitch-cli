/**
 * Merges two or more sessions into a single session.
 */

const { normalizeUrl } = require('../session/manager');

function mergeSessions(sessions, newName) {
  if (!sessions || sessions.length < 2) {
    throw new Error('At least two sessions are required to merge');
  }

  const allUrls = sessions.flatMap(s => s.urls || []);
  const uniqueUrls = deduplicateUrls(allUrls);

  const mergedTags = [...new Set(sessions.flatMap(s => s.tags || []))];

  return {
    name: newName || `merged-${Date.now()}`,
    urls: uniqueUrls,
    tags: mergedTags,
    createdAt: new Date().toISOString(),
    mergedFrom: sessions.map(s => s.name),
  };
}

function deduplicateUrls(urls) {
  const seen = new Set();
  return urls.filter(url => {
    const normalized = normalizeUrl(url);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function previewMerge(sessions) {
  const allUrls = sessions.flatMap(s => s.urls || []);
  const unique = deduplicateUrls(allUrls);
  const duplicateCount = allUrls.length - unique.length;
  return {
    totalUrls: allUrls.length,
    uniqueUrls: unique.length,
    duplicatesRemoved: duplicateCount,
    sources: sessions.map(s => ({ name: s.name, urlCount: (s.urls || []).length })),
  };
}

module.exports = { mergeSessions, deduplicateUrls, previewMerge };

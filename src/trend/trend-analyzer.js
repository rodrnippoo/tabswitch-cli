const { recordAccess, getMostAccessed } = require('../access/access-log');

/**
 * Compute access frequency per session over a given window (ms).
 */
function computeFrequency(accessLog, windowMs = 7 * 24 * 60 * 60 * 1000) {
  const now = Date.now();
  const cutoff = now - windowMs;
  const result = {};

  for (const [sessionId, entry] of Object.entries(accessLog)) {
    const recentHits = (entry.history || []).filter(ts => ts >= cutoff);
    result[sessionId] = {
      sessionId,
      count: recentHits.length,
      lastAccessed: entry.lastAccessed || null,
    };
  }

  return result;
}

/**
 * Rank sessions by access trend (most active first).
 */
function rankByTrend(frequencyMap) {
  return Object.values(frequencyMap).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return (b.lastAccessed || 0) - (a.lastAccessed || 0);
  });
}

/**
 * Label a session's trend based on access count thresholds.
 */
function getTrendLabel(count) {
  if (count >= 20) return 'hot';
  if (count >= 10) return 'rising';
  if (count >= 3)  return 'active';
  if (count === 0) return 'cold';
  return 'low';
}

/**
 * Produce a full trend report for all sessions.
 */
function analyzeTrends(accessLog, windowMs) {
  const freq = computeFrequency(accessLog, windowMs);
  const ranked = rankByTrend(freq);

  return ranked.map(entry => ({
    ...entry,
    label: getTrendLabel(entry.count),
  }));
}

module.exports = { computeFrequency, rankByTrend, getTrendLabel, analyzeTrends };

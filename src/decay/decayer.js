/**
 * Session decay — marks sessions as "stale" based on inactivity.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getDecayLevel(session, thresholds = {}) {
  const { warn = 7, stale = 30, dead = 90 } = thresholds;
  const now = Date.now();
  const lastAccessed = session.lastAccessed || session.createdAt || now;
  const daysSince = (now - new Date(lastAccessed).getTime()) / MS_PER_DAY;

  if (daysSince >= dead) return 'dead';
  if (daysSince >= stale) return 'stale';
  if (daysSince >= warn) return 'warn';
  return 'fresh';
}

function applyDecay(session, thresholds) {
  const level = getDecayLevel(session, thresholds);
  return { ...session, decayLevel: level };
}

function filterByDecay(sessions, level, thresholds) {
  return sessions
    .map(s => applyDecay(s, thresholds))
    .filter(s => s.decayLevel === level);
}

function summarizeDecay(sessions, thresholds) {
  const counts = { fresh: 0, warn: 0, stale: 0, dead: 0 };
  for (const s of sessions) {
    const level = getDecayLevel(s, thresholds);
    counts[level]++;
  }
  return counts;
}

function purgeDeadSessions(sessions, thresholds) {
  return sessions.filter(s => getDecayLevel(s, thresholds) !== 'dead');
}

module.exports = {
  getDecayLevel,
  applyDecay,
  filterByDecay,
  summarizeDecay,
  purgeDeadSessions,
};

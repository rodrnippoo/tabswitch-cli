/**
 * Session priority management
 * Allows assigning priority levels to sessions for ordering and filtering
 */

const PRIORITY_LEVELS = ['low', 'normal', 'high', 'critical'];
const DEFAULT_PRIORITY = 'normal';

function validatePriority(priority) {
  if (!PRIORITY_LEVELS.includes(priority)) {
    throw new Error(`Invalid priority "${priority}". Must be one of: ${PRIORITY_LEVELS.join(', ')}`);
  }
}

function setPriority(session, priority) {
  validatePriority(priority);
  return { ...session, priority };
}

function getPriority(session) {
  return session.priority || DEFAULT_PRIORITY;
}

function removePriority(session) {
  const updated = { ...session };
  delete updated.priority;
  return updated;
}

function priorityRank(priority) {
  return PRIORITY_LEVELS.indexOf(priority || DEFAULT_PRIORITY);
}

function sortByPriority(sessions, direction = 'desc') {
  return [...sessions].sort((a, b) => {
    const rankA = priorityRank(getPriority(a));
    const rankB = priorityRank(getPriority(b));
    return direction === 'desc' ? rankB - rankA : rankA - rankB;
  });
}

function filterByPriority(sessions, priority) {
  validatePriority(priority);
  return sessions.filter(s => getPriority(s) === priority);
}

function filterAtLeastPriority(sessions, minPriority) {
  validatePriority(minPriority);
  const minRank = priorityRank(minPriority);
  return sessions.filter(s => priorityRank(getPriority(s)) >= minRank);
}

module.exports = {
  PRIORITY_LEVELS,
  DEFAULT_PRIORITY,
  setPriority,
  getPriority,
  removePriority,
  sortByPriority,
  filterByPriority,
  filterAtLeastPriority,
};

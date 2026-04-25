/**
 * Filter sessions by various criteria
 */

/**
 * Filter sessions by minimum number of tabs
 * @param {Object[]} sessions
 * @param {number} min
 */
function filterByMinTabs(sessions, min) {
  return sessions.filter(s => Array.isArray(s.tabs) && s.tabs.length >= min);
}

/**
 * Filter sessions by maximum number of tabs
 * @param {Object[]} sessions
 * @param {number} max
 */
function filterByMaxTabs(sessions, max) {
  return sessions.filter(s => Array.isArray(s.tabs) && s.tabs.length <= max);
}

/**
 * Filter sessions created after a given date
 * @param {Object[]} sessions
 * @param {string|Date} date
 */
function filterByCreatedAfter(sessions, date) {
  const threshold = new Date(date).getTime();
  return sessions.filter(s => s.createdAt && new Date(s.createdAt).getTime() >= threshold);
}

/**
 * Filter sessions created before a given date
 * @param {Object[]} sessions
 * @param {string|Date} date
 */
function filterByCreatedBefore(sessions, date) {
  const threshold = new Date(date).getTime();
  return sessions.filter(s => s.createdAt && new Date(s.createdAt).getTime() <= threshold);
}

/**
 * Filter sessions by a domain present in their tabs
 * @param {Object[]} sessions
 * @param {string} domain
 */
function filterByDomain(sessions, domain) {
  const normalized = domain.toLowerCase();
  return sessions.filter(s =>
    Array.isArray(s.tabs) &&
    s.tabs.some(tab => {
      try {
        return new URL(tab).hostname.includes(normalized);
      } catch {
        return false;
      }
    })
  );
}

/**
 * Apply multiple filter criteria at once
 * @param {Object[]} sessions
 * @param {Object} criteria
 */
function filterSessions(sessions, criteria = {}) {
  let result = sessions;
  if (criteria.minTabs != null) result = filterByMinTabs(result, criteria.minTabs);
  if (criteria.maxTabs != null) result = filterByMaxTabs(result, criteria.maxTabs);
  if (criteria.createdAfter) result = filterByCreatedAfter(result, criteria.createdAfter);
  if (criteria.createdBefore) result = filterByCreatedBefore(result, criteria.createdBefore);
  if (criteria.domain) result = filterByDomain(result, criteria.domain);
  return result;
}

module.exports = {
  filterByMinTabs,
  filterByMaxTabs,
  filterByCreatedAfter,
  filterByCreatedBefore,
  filterByDomain,
  filterSessions,
};

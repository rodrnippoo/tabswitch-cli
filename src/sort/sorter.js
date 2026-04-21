/**
 * Sorts sessions by various criteria
 */

/**
 * Sort sessions by name (alphabetical)
 * @param {Array} sessions
 * @param {string} order - 'asc' or 'desc'
 */
function sortByName(sessions, order = 'asc') {
  const sorted = [...sessions].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '')
  );
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort sessions by creation date
 * @param {Array} sessions
 * @param {string} order - 'asc' or 'desc'
 */
function sortByDate(sessions, order = 'desc') {
  const sorted = [...sessions].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateA - dateB;
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort sessions by number of URLs
 * @param {Array} sessions
 * @param {string} order - 'asc' or 'desc'
 */
function sortBySize(sessions, order = 'desc') {
  const sorted = [...sessions].sort((a, b) => {
    const sizeA = Array.isArray(a.urls) ? a.urls.length : 0;
    const sizeB = Array.isArray(b.urls) ? b.urls.length : 0;
    return sizeA - sizeB;
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/**
 * Sort sessions by last accessed time
 * @param {Array} sessions
 * @param {string} order - 'asc' or 'desc'
 */
function sortByLastAccessed(sessions, order = 'desc') {
  const sorted = [...sessions].sort((a, b) => {
    const dateA = new Date(a.lastAccessed || a.createdAt || 0).getTime();
    const dateB = new Date(b.lastAccessed || b.createdAt || 0).getTime();
    return dateA - dateB;
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

const SORT_FIELDS = {
  name: sortByName,
  date: sortByDate,
  size: sortBySize,
  accessed: sortByLastAccessed,
};

/**
 * Sort sessions by a given field and order
 * @param {Array} sessions
 * @param {string} field
 * @param {string} order
 */
function sortSessions(sessions, field = 'date', order = 'desc') {
  const fn = SORT_FIELDS[field];
  if (!fn) {
    throw new Error(`Unknown sort field: "${field}". Valid fields: ${Object.keys(SORT_FIELDS).join(', ')}`);
  }
  return fn(sessions, order);
}

module.exports = { sortByName, sortByDate, sortBySize, sortByLastAccessed, sortSessions };

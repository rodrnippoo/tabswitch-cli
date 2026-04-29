/**
 * Session expiry management — mark sessions with a TTL and check/purge expired ones.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function setExpiry(session, days) {
  if (typeof days !== 'number' || days <= 0) {
    throw new Error('Expiry must be a positive number of days');
  }
  const expiresAt = Date.now() + days * MS_PER_DAY;
  return { ...session, expiresAt };
}

function clearExpiry(session) {
  const updated = { ...session };
  delete updated.expiresAt;
  return updated;
}

function isExpired(session, now = Date.now()) {
  if (!session.expiresAt) return false;
  return now >= session.expiresAt;
}

function daysUntilExpiry(session, now = Date.now()) {
  if (!session.expiresAt) return null;
  const diff = session.expiresAt - now;
  return Math.ceil(diff / MS_PER_DAY);
}

function filterExpired(sessions, now = Date.now()) {
  return sessions.filter(s => isExpired(s, now));
}

function filterActive(sessions, now = Date.now()) {
  return sessions.filter(s => !isExpired(s, now));
}

function purgeExpired(sessions, now = Date.now()) {
  const purged = filterExpired(sessions, now);
  const remaining = filterActive(sessions, now);
  return { remaining, purged };
}

module.exports = {
  setExpiry,
  clearExpiry,
  isExpired,
  daysUntilExpiry,
  filterExpired,
  filterActive,
  purgeExpired,
};

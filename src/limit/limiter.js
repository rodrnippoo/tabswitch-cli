// limiter.js — enforce tab count limits on sessions

const DEFAULT_LIMIT = 50;

function createLimit(sessionId, maxTabs, options = {}) {
  if (!sessionId) throw new Error('sessionId is required');
  if (typeof maxTabs !== 'number' || maxTabs < 1) throw new Error('maxTabs must be a positive number');

  return {
    sessionId,
    maxTabs,
    warnAt: options.warnAt ?? Math.floor(maxTabs * 0.8),
    createdAt: new Date().toISOString(),
  };
}

function isOverLimit(session, limit) {
  const tabCount = session.urls?.length ?? 0;
  return tabCount > limit.maxTabs;
}

function isNearLimit(session, limit) {
  const tabCount = session.urls?.length ?? 0;
  return tabCount >= limit.warnAt && tabCount <= limit.maxTabs;
}

function getLimitStatus(session, limit) {
  const tabCount = session.urls?.length ?? 0;
  if (tabCount > limit.maxTabs) return 'over';
  if (tabCount >= limit.warnAt) return 'near';
  return 'ok';
}

function enforceLimit(session, limit) {
  if (!isOverLimit(session, limit)) return session;
  const trimmed = session.urls.slice(0, limit.maxTabs);
  return { ...session, urls: trimmed };
}

function summarizeLimit(session, limit) {
  const tabCount = session.urls?.length ?? 0;
  const status = getLimitStatus(session, limit);
  return {
    sessionId: session.id,
    tabCount,
    maxTabs: limit.maxTabs,
    warnAt: limit.warnAt,
    status,
    remaining: Math.max(0, limit.maxTabs - tabCount),
  };
}

module.exports = { createLimit, isOverLimit, isNearLimit, getLimitStatus, enforceLimit, summarizeLimit, DEFAULT_LIMIT };

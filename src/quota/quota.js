// quota.js — enforce per-session URL count quotas

const DEFAULT_QUOTA = 50;

function createQuota(sessionId, limit = DEFAULT_QUOTA) {
  if (typeof limit !== 'number' || limit < 1) {
    throw new Error(`Invalid quota limit: ${limit}`);
  }
  return {
    sessionId,
    limit,
    createdAt: new Date().toISOString(),
  };
}

function checkQuota(session, quotaMap) {
  const quota = quotaMap[session.id];
  if (!quota) return { enforced: false, count: session.urls.length, limit: null };
  const count = session.urls.length;
  return {
    enforced: true,
    count,
    limit: quota.limit,
    exceeded: count > quota.limit,
    nearLimit: count >= Math.floor(quota.limit * 0.9) && count <= quota.limit,
  };
}

function enforceQuota(session, quotaMap) {
  const status = checkQuota(session, quotaMap);
  if (!status.enforced || !status.exceeded) return session;
  return {
    ...session,
    urls: session.urls.slice(0, status.limit),
  };
}

function removeQuota(sessionId, quotaMap) {
  const updated = { ...quotaMap };
  delete updated[sessionId];
  return updated;
}

function listQuotas(quotaMap) {
  return Object.values(quotaMap);
}

module.exports = {
  createQuota,
  checkQuota,
  enforceQuota,
  removeQuota,
  listQuotas,
  DEFAULT_QUOTA,
};

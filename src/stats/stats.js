// Stats module: compute usage statistics across sessions

function countTotalTabs(sessions) {
  return sessions.reduce((sum, s) => sum + (s.urls ? s.urls.length : 0), 0);
}

function averageTabsPerSession(sessions) {
  if (!sessions.length) return 0;
  return countTotalTabs(sessions) / sessions.length;
}

function mostUsedDomain(sessions) {
  const freq = {};
  for (const session of sessions) {
    for (const url of session.urls || []) {
      try {
        const domain = new URL(url).hostname;
        freq[domain] = (freq[domain] || 0) + 1;
      } catch (_) {}
    }
  }
  let top = null;
  let max = 0;
  for (const [domain, count] of Object.entries(freq)) {
    if (count > max) { max = count; top = domain; }
  }
  return top;
}

function sessionCreatedAt(session) {
  return session.createdAt ? new Date(session.createdAt) : null;
}

function oldestSession(sessions) {
  return sessions.reduce((oldest, s) => {
    const d = sessionCreatedAt(s);
    if (!d) return oldest;
    if (!oldest) return s;
    return d < sessionCreatedAt(oldest) ? s : oldest;
  }, null);
}

function newestSession(sessions) {
  return sessions.reduce((newest, s) => {
    const d = sessionCreatedAt(s);
    if (!d) return newest;
    if (!newest) return s;
    return d > sessionCreatedAt(newest) ? s : newest;
  }, null);
}

function computeStats(sessions) {
  return {
    totalSessions: sessions.length,
    totalTabs: countTotalTabs(sessions),
    averageTabs: parseFloat(averageTabsPerSession(sessions).toFixed(2)),
    mostUsedDomain: mostUsedDomain(sessions),
    oldestSession: oldestSession(sessions)?.name || null,
    newestSession: newestSession(sessions)?.name || null,
  };
}

module.exports = {
  countTotalTabs,
  averageTabsPerSession,
  mostUsedDomain,
  oldestSession,
  newestSession,
  computeStats,
};

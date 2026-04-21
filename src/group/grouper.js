/**
 * Groups sessions by a given property (tag, domain, date)
 */

function groupByTag(sessions) {
  const groups = {};
  for (const session of sessions) {
    const tags = session.tags || ['untagged'];
    for (const tag of tags) {
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(session);
    }
  }
  return groups;
}

function groupByDomain(sessions) {
  const groups = {};
  for (const session of sessions) {
    const urls = session.urls || [];
    const domains = [...new Set(urls.map(url => {
      try {
        return new URL(url).hostname;
      } catch {
        return 'unknown';
      }
    }))];
    for (const domain of domains) {
      if (!groups[domain]) groups[domain] = [];
      if (!groups[domain].includes(session)) groups[domain].push(session);
    }
  }
  return groups;
}

function groupByDate(sessions) {
  const groups = {};
  for (const session of sessions) {
    const date = session.createdAt
      ? new Date(session.createdAt).toISOString().split('T')[0]
      : 'unknown';
    if (!groups[date]) groups[date] = [];
    groups[date].push(session);
  }
  return groups;
}

function groupSessions(sessions, by = 'tag') {
  switch (by) {
    case 'tag': return groupByTag(sessions);
    case 'domain': return groupByDomain(sessions);
    case 'date': return groupByDate(sessions);
    default: throw new Error(`Unknown grouping: ${by}`);
  }
}

module.exports = { groupByTag, groupByDomain, groupByDate, groupSessions };

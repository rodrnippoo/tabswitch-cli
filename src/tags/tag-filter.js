function matchesAllTags(session, tags) {
  if (!tags || tags.length === 0) return true;
  const sessionTags = session.tags || [];
  return tags.every(t => sessionTags.includes(t.trim().toLowerCase()));
}

function matchesAnyTag(session, tags) {
  if (!tags || tags.length === 0) return true;
  const sessionTags = session.tags || [];
  return tags.some(t => sessionTags.includes(t.trim().toLowerCase()));
}

function filterSessions(sessions, tags, mode = 'all') {
  const fn = mode === 'any' ? matchesAnyTag : matchesAllTags;
  return sessions.filter(s => fn(s, tags));
}

module.exports = { matchesAllTags, matchesAnyTag, filterSessions };

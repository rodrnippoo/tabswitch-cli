/**
 * Search sessions by URL, name, or tags
 */

function searchByQuery(sessions, query) {
  if (!query || query.trim() === '') return sessions;
  const q = query.toLowerCase();
  return sessions.filter(session => {
    const nameMatch = session.name && session.name.toLowerCase().includes(q);
    const urlMatch = session.urls && session.urls.some(url => url.toLowerCase().includes(q));
    const tagMatch = session.tags && session.tags.some(tag => tag.toLowerCase().includes(q));
    return nameMatch || urlMatch || tagMatch;
  });
}

function searchByUrl(sessions, urlFragment) {
  if (!urlFragment) return sessions;
  const frag = urlFragment.toLowerCase();
  return sessions.filter(session =>
    session.urls && session.urls.some(url => url.toLowerCase().includes(frag))
  );
}

function searchByName(sessions, name) {
  if (!name) return sessions;
  const n = name.toLowerCase();
  return sessions.filter(session =>
    session.name && session.name.toLowerCase().includes(n)
  );
}

function rankResults(sessions, query) {
  const q = query.toLowerCase();
  return sessions
    .map(session => {
      let score = 0;
      if (session.name && session.name.toLowerCase() === q) score += 10;
      else if (session.name && session.name.toLowerCase().startsWith(q)) score += 5;
      else if (session.name && session.name.toLowerCase().includes(q)) score += 2;
      if (session.urls) {
        session.urls.forEach(url => {
          if (url.toLowerCase().includes(q)) score += 1;
        });
      }
      return { session, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(r => r.session);
}

module.exports = { searchByQuery, searchByUrl, searchByName, rankResults };

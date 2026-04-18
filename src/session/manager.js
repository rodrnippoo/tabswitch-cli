const store = require('./store');

function createSession(name, urls) {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Session name is required');
  }
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error('At least one URL is required');
  }
  const tabs = urls.map((url, index) => ({
    id: index + 1,
    url: normalizeUrl(url),
  }));
  return store.saveSession(name.trim(), tabs);
}

function normalizeUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

function getSession(name) {
  const session = store.getSession(name);
  if (!session) throw new Error(`Session "${name}" not found`);
  return session;
}

function removeSession(name) {
  const removed = store.deleteSession(name);
  if (!removed) throw new Error(`Session "${name}" not found`);
  return true;
}

function listSessions() {
  return store.listSessions();
}

module.exports = { createSession, getSession, removeSession, listSessions };

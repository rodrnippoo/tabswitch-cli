// bookmark-manager.js — high-level bookmark operations

const { addBookmark, removeBookmark, listBookmarks, findBookmark } = require('./bookmarker');
const store = require('./bookmark-store');

function add(sessionId, url, label) {
  const all = store.loadBookmarks();
  const updated = addBookmark(all, sessionId, url, label);
  store.saveBookmarks(updated);
  return updated[updated.length - 1];
}

function remove(sessionId, url) {
  const all = store.loadBookmarks();
  const updated = removeBookmark(all, sessionId, url);
  store.saveBookmarks(updated);
}

function list(sessionId) {
  const all = store.loadBookmarks();
  return listBookmarks(all, sessionId);
}

function find(sessionId, url) {
  const all = store.loadBookmarks();
  return findBookmark(all, sessionId, url);
}

function clearSession(sessionId) {
  const all = store.loadBookmarks();
  const updated = all.filter((b) => b.sessionId !== sessionId);
  store.saveBookmarks(updated);
}

module.exports = { add, remove, list, find, clearSession };

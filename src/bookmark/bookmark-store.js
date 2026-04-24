// bookmark-store.js — persist bookmarks to disk

const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = path.join(os.homedir(), '.tabswitch');
const BOOKMARKS_FILE = path.join(DATA_DIR, 'bookmarks.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadBookmarks() {
  ensureDir();
  if (!fs.existsSync(BOOKMARKS_FILE)) return [];
  try {
    const raw = fs.readFileSync(BOOKMARKS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks) {
  ensureDir();
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
}

function addBookmarkToStore(bookmark) {
  const all = loadBookmarks();
  const updated = [...all, bookmark];
  saveBookmarks(updated);
}

function removeBookmarkFromStore(sessionId, url) {
  const all = loadBookmarks();
  const updated = all.filter(
    (b) => !(b.sessionId === sessionId && b.url === url)
  );
  saveBookmarks(updated);
}

function getBookmarksForSession(sessionId) {
  return loadBookmarks().filter((b) => b.sessionId === sessionId);
}

module.exports = {
  loadBookmarks,
  saveBookmarks,
  addBookmarkToStore,
  removeBookmarkFromStore,
  getBookmarksForSession,
};

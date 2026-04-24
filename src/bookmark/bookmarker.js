// bookmarker.js — add/remove/list bookmarks on sessions

function createBookmark(sessionId, url, label = '') {
  return {
    sessionId,
    url,
    label: label || url,
    createdAt: new Date().toISOString(),
  };
}

function addBookmark(bookmarks, sessionId, url, label) {
  const existing = bookmarks.find(
    (b) => b.sessionId === sessionId && b.url === url
  );
  if (existing) throw new Error(`Bookmark already exists for URL: ${url}`);
  const bookmark = createBookmark(sessionId, url, label);
  return [...bookmarks, bookmark];
}

function removeBookmark(bookmarks, sessionId, url) {
  const next = bookmarks.filter(
    (b) => !(b.sessionId === sessionId && b.url === url)
  );
  if (next.length === bookmarks.length)
    throw new Error(`No bookmark found for URL: ${url}`);
  return next;
}

function listBookmarks(bookmarks, sessionId) {
  if (sessionId) return bookmarks.filter((b) => b.sessionId === sessionId);
  return bookmarks;
}

function findBookmark(bookmarks, sessionId, url) {
  return bookmarks.find((b) => b.sessionId === sessionId && b.url === url) || null;
}

module.exports = { createBookmark, addBookmark, removeBookmark, listBookmarks, findBookmark };

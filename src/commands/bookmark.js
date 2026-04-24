// commands/bookmark.js — CLI commands for bookmarks

const manager = require('../bookmark/bookmark-manager');

function registerBookmarkCommands(program) {
  const bookmark = program.command('bookmark').description('Manage bookmarked URLs within sessions');

  bookmark
    .command('add <sessionId> <url> [label]')
    .description('Bookmark a URL in a session')
    .action((sessionId, url, label) => {
      try {
        const bm = manager.add(sessionId, url, label);
        console.log(`Bookmarked "${bm.label}" in session "${sessionId}"`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    });

  bookmark
    .command('remove <sessionId> <url>')
    .description('Remove a bookmark from a session')
    .action((sessionId, url) => {
      try {
        manager.remove(sessionId, url);
        console.log(`Removed bookmark for ${url} from session "${sessionId}"`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    });

  bookmark
    .command('list [sessionId]')
    .description('List bookmarks, optionally filtered by session')
    .action((sessionId) => {
      const results = manager.list(sessionId);
      if (!results.length) {
        console.log('No bookmarks found.');
        return;
      }
      results.forEach((b) => {
        console.log(`[${b.sessionId}] ${b.label} — ${b.url} (${b.createdAt})`);
      });
    });

  bookmark
    .command('clear <sessionId>')
    .description('Remove all bookmarks for a session')
    .action((sessionId) => {
      manager.clearSession(sessionId);
      console.log(`Cleared all bookmarks for session "${sessionId}"`);
    });
}

module.exports = { registerBookmarkCommands };

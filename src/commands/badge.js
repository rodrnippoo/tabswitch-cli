const { addBadge, removeBadge, listBadges, clearBadges, filterByBadge, VALID_BADGES } = require('../badge/badger');
const { loadSessions, saveSessions } = require('../session/store');

function registerBadgeCommands(program) {
  const badge = program.command('badge').description('Manage session badges');

  badge
    .command('add <session> <badge>')
    .description(`Add a badge to a session (${VALID_BADGES.join(', ')})`)
    .action(async (sessionName, badgeName) => {
      const sessions = await loadSessions();
      const idx = sessions.findIndex(s => s.name === sessionName);
      if (idx === -1) return console.error(`Session "${sessionName}" not found.`);
      try {
        sessions[idx] = addBadge(sessions[idx], badgeName);
        await saveSessions(sessions);
        console.log(`Badge "${badgeName}" added to "${sessionName}".`);
      } catch (e) {
        console.error(e.message);
      }
    });

  badge
    .command('remove <session> <badge>')
    .description('Remove a badge from a session')
    .action(async (sessionName, badgeName) => {
      const sessions = await loadSessions();
      const idx = sessions.findIndex(s => s.name === sessionName);
      if (idx === -1) return console.error(`Session "${sessionName}" not found.`);
      try {
        sessions[idx] = removeBadge(sessions[idx], badgeName);
        await saveSessions(sessions);
        console.log(`Badge "${badgeName}" removed from "${sessionName}".`);
      } catch (e) {
        console.error(e.message);
      }
    });

  badge
    .command('list <session>')
    .description('List all badges on a session')
    .action(async (sessionName) => {
      const sessions = await loadSessions();
      const session = sessions.find(s => s.name === sessionName);
      if (!session) return console.error(`Session "${sessionName}" not found.`);
      const badges = listBadges(session);
      if (badges.length === 0) return console.log('No badges assigned.');
      badges.forEach(b => console.log(`  • ${b}`));
    });

  badge
    .command('clear <session>')
    .description('Clear all badges from a session')
    .action(async (sessionName) => {
      const sessions = await loadSessions();
      const idx = sessions.findIndex(s => s.name === sessionName);
      if (idx === -1) return console.error(`Session "${sessionName}" not found.`);
      sessions[idx] = clearBadges(sessions[idx]);
      await saveSessions(sessions);
      console.log(`All badges cleared from "${sessionName}".`);
    });

  badge
    .command('filter <badge>')
    .description('List sessions that have a specific badge')
    .action(async (badgeName) => {
      const sessions = await loadSessions();
      try {
        const matches = filterByBadge(sessions, badgeName);
        if (matches.length === 0) return console.log(`No sessions with badge "${badgeName}".`);
        matches.forEach(s => console.log(`  ${s.name}`));
      } catch (e) {
        console.error(e.message);
      }
    });
}

module.exports = { registerBadgeCommands };

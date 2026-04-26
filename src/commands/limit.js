// limit.js — CLI commands for tab limit management

const { createLimit, enforceLimit, summarizeLimit, DEFAULT_LIMIT } = require('../limit/limiter');
const { saveLimit, getLimit, deleteLimit, listLimits } = require('../limit/limit-store');
const { getSession, saveSessions, loadSessions } = require('../session/store');

function registerLimitCommands(program) {
  const limit = program.command('limit').description('manage tab count limits for sessions');

  limit
    .command('set <sessionId> <maxTabs>')
    .description('set a tab limit for a session')
    .option('--warn-at <n>', 'warn threshold (default: 80% of maxTabs)', parseInt)
    .action((sessionId, maxTabs, opts) => {
      const session = getSession(sessionId);
      if (!session) return console.error(`Session '${sessionId}' not found.`);
      const lim = createLimit(sessionId, parseInt(maxTabs), { warnAt: opts.warnAt });
      saveLimit(lim);
      console.log(`Limit set: ${sessionId} → max ${lim.maxTabs} tabs (warn at ${lim.warnAt})`);
    });

  limit
    .command('status <sessionId>')
    .description('show limit status for a session')
    .action((sessionId) => {
      const session = getSession(sessionId);
      if (!session) return console.error(`Session '${sessionId}' not found.`);
      const lim = getLimit(sessionId);
      if (!lim) return console.log(`No limit set for '${sessionId}'.`);
      const summary = summarizeLimit(session, lim);
      console.log(`[${summary.status.toUpperCase()}] ${sessionId}: ${summary.tabCount}/${summary.maxTabs} tabs (${summary.remaining} remaining)`);
    });

  limit
    .command('enforce <sessionId>')
    .description('trim session to its tab limit')
    .action((sessionId) => {
      const session = getSession(sessionId);
      if (!session) return console.error(`Session '${sessionId}' not found.`);
      const lim = getLimit(sessionId);
      if (!lim) return console.log(`No limit set for '${sessionId}'.`);
      const trimmed = enforceLimit(session, lim);
      const sessions = loadSessions();
      sessions[sessionId] = trimmed;
      saveSessions(sessions);
      console.log(`Enforced: '${sessionId}' trimmed to ${trimmed.urls.length} tabs.`);
    });

  limit
    .command('remove <sessionId>')
    .description('remove the tab limit for a session')
    .action((sessionId) => {
      const removed = deleteLimit(sessionId);
      if (removed) console.log(`Limit removed for '${sessionId}'.`);
      else console.log(`No limit found for '${sessionId}'.`);
    });

  limit
    .command('list')
    .description('list all session limits')
    .action(() => {
      const limits = listLimits();
      if (!limits.length) return console.log('No limits configured.');
      limits.forEach(l => console.log(`  ${l.sessionId}: max ${l.maxTabs} tabs (warn at ${l.warnAt})`));
    });
}

module.exports = { registerLimitCommands };

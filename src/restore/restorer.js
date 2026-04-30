/**
 * Restorer — restore sessions to a browser with optional filtering
 */

const { launchBrowser } = require('../browser/launcher');
const { isArchived } = require('../archive/archiver');
const { isLocked } = require('../lock/locker');
const { isHidden } = require('../visibility/visibility');

function buildRestoreOptions(opts = {}) {
  return {
    browser: opts.browser || null,
    skipArchived: opts.skipArchived !== false,
    skipLocked: opts.skipLocked || false,
    skipHidden: opts.skipHidden || false,
    urlFilter: opts.urlFilter || null,
    dryRun: opts.dryRun || false,
  };
}

function filterUrls(urls, urlFilter) {
  if (!urlFilter) return urls;
  const pattern = new RegExp(urlFilter, 'i');
  return urls.filter((u) => pattern.test(u));
}

function shouldSkipSession(session, opts) {
  if (opts.skipArchived && isArchived(session)) return true;
  if (opts.skipLocked && isLocked(session)) return true;
  if (opts.skipHidden && isHidden(session)) return true;
  return false;
}

async function restoreSession(session, opts = {}) {
  const options = buildRestoreOptions(opts);

  if (shouldSkipSession(session, options)) {
    return { skipped: true, reason: 'filtered', session: session.name };
  }

  const urls = filterUrls(session.urls || [], options.urlFilter);

  if (urls.length === 0) {
    return { skipped: true, reason: 'no_urls', session: session.name };
  }

  if (options.dryRun) {
    return { dryRun: true, session: session.name, urls };
  }

  await launchBrowser(urls, { browser: options.browser });
  return { restored: true, session: session.name, count: urls.length };
}

async function restoreMany(sessions, opts = {}) {
  const results = [];
  for (const session of sessions) {
    const result = await restoreSession(session, opts);
    results.push(result);
  }
  return results;
}

function summarizeRestore(results) {
  const restored = results.filter((r) => r.restored).length;
  const skipped = results.filter((r) => r.skipped).length;
  const dryRun = results.filter((r) => r.dryRun).length;
  return { restored, skipped, dryRun, total: results.length };
}

module.exports = { buildRestoreOptions, filterUrls, shouldSkipSession, restoreSession, restoreMany, summarizeRestore };

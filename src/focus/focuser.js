/**
 * Focus mode: restrict active session to a subset of tabs by domain or tag.
 */

/**
 * Create a focus state for a session.
 * @param {string} sessionId
 * @param {string[]} allowedDomains
 * @param {string[]} allowedTags
 * @returns {object}
 */
function createFocus(sessionId, allowedDomains = [], allowedTags = []) {
  if (!sessionId) throw new Error('sessionId is required');
  return {
    sessionId,
    allowedDomains: allowedDomains.map(d => d.toLowerCase().trim()),
    allowedTags: allowedTags.map(t => t.toLowerCase().trim()),
    createdAt: new Date().toISOString(),
    active: true,
  };
}

/**
 * Extract the hostname from a URL string.
 * @param {string} url
 * @returns {string}
 */
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Filter a session's tabs according to a focus state.
 * @param {object} session  - session with a `tabs` array of { url, tags? }
 * @param {object} focus    - focus object from createFocus
 * @returns {object[]}      - filtered tabs
 */
function applyFocus(session, focus) {
  if (!focus || !focus.active) return session.tabs;
  const { allowedDomains, allowedTags } = focus;
  const hasDomains = allowedDomains.length > 0;
  const hasTags = allowedTags.length > 0;

  return session.tabs.filter(tab => {
    if (hasDomains) {
      const domain = extractDomain(tab.url);
      if (allowedDomains.includes(domain)) return true;
    }
    if (hasTags) {
      const tabTags = (tab.tags || []).map(t => t.toLowerCase());
      if (allowedTags.some(t => tabTags.includes(t))) return true;
    }
    return false;
  });
}

/**
 * Deactivate a focus state.
 * @param {object} focus
 * @returns {object}
 */
function clearFocus(focus) {
  return { ...focus, active: false };
}

/**
 * Summarize what a focus state allows.
 * @param {object} focus
 * @returns {string}
 */
function describeFocus(focus) {
  const parts = [];
  if (focus.allowedDomains.length) parts.push(`domains: ${focus.allowedDomains.join(', ')}`);
  if (focus.allowedTags.length) parts.push(`tags: ${focus.allowedTags.join(', ')}`);
  return parts.length ? parts.join(' | ') : 'no restrictions';
}

module.exports = { createFocus, extractDomain, applyFocus, clearFocus, describeFocus };

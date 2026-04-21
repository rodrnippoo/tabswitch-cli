// hotkey.js — assign and resolve keyboard shortcut aliases for sessions

/**
 * Create a hotkey binding for a session
 * @param {string} key - e.g. "ctrl+1" or "f5"
 * @param {string} sessionId
 * @returns {object}
 */
function createHotkey(key, sessionId) {
  if (!key || typeof key !== 'string') throw new Error('Invalid hotkey key');
  if (!sessionId) throw new Error('sessionId is required');
  return {
    key: normalizeKey(key),
    sessionId,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Normalize a key string to lowercase trimmed form
 * @param {string} key
 * @returns {string}
 */
function normalizeKey(key) {
  return key.trim().toLowerCase();
}

/**
 * Resolve which session a hotkey points to
 * @param {string} key
 * @param {object[]} hotkeys
 * @returns {string|null} sessionId or null
 */
function resolveHotkey(key, hotkeys) {
  const normalized = normalizeKey(key);
  const match = hotkeys.find((h) => h.key === normalized);
  return match ? match.sessionId : null;
}

/**
 * Remove a hotkey binding by key
 * @param {string} key
 * @param {object[]} hotkeys
 * @returns {object[]}
 */
function removeHotkey(key, hotkeys) {
  const normalized = normalizeKey(key);
  return hotkeys.filter((h) => h.key !== normalized);
}

/**
 * List all hotkeys, optionally filtered by sessionId
 * @param {object[]} hotkeys
 * @param {string} [sessionId]
 * @returns {object[]}
 */
function listHotkeys(hotkeys, sessionId) {
  if (sessionId) return hotkeys.filter((h) => h.sessionId === sessionId);
  return [...hotkeys];
}

/**
 * Check if a key is already bound
 * @param {string} key
 * @param {object[]} hotkeys
 * @returns {boolean}
 */
function isBound(key, hotkeys) {
  return hotkeys.some((h) => h.key === normalizeKey(key));
}

module.exports = { createHotkey, normalizeKey, resolveHotkey, removeHotkey, listHotkeys, isBound };

// cloner.js — deep-copy a session under a new name

'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Create a deep clone of a session with a new id and name.
 * @param {object} session - source session object
 * @param {string} newName - name for the cloned session
 * @param {object} [opts]
 * @param {boolean} [opts.stripTags=false] - omit tags from clone
 * @param {boolean} [opts.stripNotes=false] - omit notes from clone
 * @returns {object} cloned session
 */
function cloneSession(session, newName, opts = {}) {
  if (!session || typeof session !== 'object') {
    throw new Error('cloneSession: session must be an object');
  }
  if (!newName || typeof newName !== 'string' || !newName.trim()) {
    throw new Error('cloneSession: newName must be a non-empty string');
  }

  const clone = {
    ...session,
    id: uuidv4(),
    name: newName.trim(),
    urls: Array.isArray(session.urls) ? [...session.urls] : [],
    tags: opts.stripTags ? [] : Array.isArray(session.tags) ? [...session.tags] : [],
    notes: opts.stripNotes ? [] : Array.isArray(session.notes) ? [...session.notes] : [],
    createdAt: new Date().toISOString(),
    clonedFrom: session.id,
  };

  return clone;
}

/**
 * Build a unique clone name by appending " (copy)" or " (copy N)".
 * @param {string} baseName
 * @param {string[]} existingNames
 * @returns {string}
 */
function buildCloneName(baseName, existingNames = []) {
  const base = `${baseName} (copy)`;
  if (!existingNames.includes(base)) return base;

  let n = 2;
  while (existingNames.includes(`${baseName} (copy ${n})`)) n++;
  return `${baseName} (copy ${n})`;
}

/**
 * Check whether a session was cloned from another.
 * @param {object} session
 * @returns {boolean}
 */
function isClone(session) {
  return Boolean(session && session.clonedFrom);
}

module.exports = { cloneSession, buildCloneName, isClone };

// cooldown.js — rate-limit how often a session can be opened

const DEFAULT_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

function createCooldown(sessionId, durationMs = DEFAULT_COOLDOWN_MS) {
  if (!sessionId || typeof sessionId !== 'string') {
    throw new Error('sessionId must be a non-empty string');
  }
  if (typeof durationMs !== 'number' || durationMs <= 0) {
    throw new Error('durationMs must be a positive number');
  }
  return {
    sessionId,
    durationMs,
    lastTriggeredAt: null,
    createdAt: new Date().toISOString(),
  };
}

function triggerCooldown(cooldown) {
  return { ...cooldown, lastTriggeredAt: new Date().toISOString() };
}

function isOnCooldown(cooldown, now = new Date()) {
  if (!cooldown.lastTriggeredAt) return false;
  const last = new Date(cooldown.lastTriggeredAt).getTime();
  return now.getTime() - last < cooldown.durationMs;
}

function timeRemaining(cooldown, now = new Date()) {
  if (!isOnCooldown(cooldown, now)) return 0;
  const last = new Date(cooldown.lastTriggeredAt).getTime();
  return cooldown.durationMs - (now.getTime() - last);
}

function resetCooldown(cooldown) {
  return { ...cooldown, lastTriggeredAt: null };
}

function describeCooldown(cooldown, now = new Date()) {
  if (!isOnCooldown(cooldown, now)) return 'not on cooldown';
  const ms = timeRemaining(cooldown, now);
  const minutes = Math.ceil(ms / 60000);
  return `on cooldown for ${minutes} more minute(s)`;
}

module.exports = {
  createCooldown,
  triggerCooldown,
  isOnCooldown,
  timeRemaining,
  resetCooldown,
  describeCooldown,
};

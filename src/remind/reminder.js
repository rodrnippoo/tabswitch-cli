const { loadSessions } = require('../session/store');

const REMINDER_DEFAULTS = {
  intervalMinutes: 60,
  maxReminders: 5,
};

function createReminder(sessionName, options = {}) {
  const { intervalMinutes, maxReminders } = { ...REMINDER_DEFAULTS, ...options };
  return {
    sessionName,
    intervalMinutes,
    maxReminders,
    reminderCount: 0,
    createdAt: new Date().toISOString(),
    lastRemindedAt: null,
  };
}

function isDue(reminder) {
  if (!reminder.lastRemindedAt) return true;
  const last = new Date(reminder.lastRemindedAt).getTime();
  const now = Date.now();
  return now - last >= reminder.intervalMinutes * 60 * 1000;
}

function isExpired(reminder) {
  return reminder.reminderCount >= reminder.maxReminders;
}

async function getSessionForReminder(reminder) {
  const sessions = await loadSessions();
  return sessions[reminder.sessionName] || null;
}

function tickReminder(reminder) {
  return {
    ...reminder,
    reminderCount: reminder.reminderCount + 1,
    lastRemindedAt: new Date().toISOString(),
  };
}

module.exports = { createReminder, isDue, isExpired, getSessionForReminder, tickReminder };

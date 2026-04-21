'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Create a new scheduled open event for a session.
 */
function createSchedule(sessionName, browser, scheduledAt, options = {}) {
  return {
    id: uuidv4(),
    sessionName,
    browser: browser || null,
    scheduledAt: new Date(scheduledAt).toISOString(),
    repeat: options.repeat || null, // 'daily' | 'weekly' | null
    createdAt: new Date().toISOString(),
    fired: false,
  };
}

/**
 * Check if a schedule is due (scheduled time <= now and not yet fired).
 */
function isDue(schedule) {
  if (schedule.fired) return false;
  return new Date(schedule.scheduledAt) <= new Date();
}

/**
 * Advance a repeating schedule to its next occurrence.
 */
function advanceSchedule(schedule) {
  if (!schedule.repeat) return { ...schedule, fired: true };

  const next = new Date(schedule.scheduledAt);
  if (schedule.repeat === 'daily') next.setDate(next.getDate() + 1);
  if (schedule.repeat === 'weekly') next.setDate(next.getDate() + 7);

  return { ...schedule, scheduledAt: next.toISOString(), fired: false };
}

/**
 * Filter schedules that are due.
 */
function getDueSchedules(schedules) {
  return schedules.filter(isDue);
}

module.exports = { createSchedule, isDue, advanceSchedule, getDueSchedules };

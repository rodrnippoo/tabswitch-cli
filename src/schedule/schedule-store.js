'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const SCHEDULE_DIR = path.join(os.homedir(), '.tabswitch');
const SCHEDULE_FILE = path.join(SCHEDULE_DIR, 'schedules.json');

function ensureDir() {
  if (!fs.existsSync(SCHEDULE_DIR)) {
    fs.mkdirSync(SCHEDULE_DIR, { recursive: true });
  }
}

function loadSchedules() {
  ensureDir();
  if (!fs.existsSync(SCHEDULE_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveSchedules(schedules) {
  ensureDir();
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
}

function addSchedule(schedule) {
  const schedules = loadSchedules();
  schedules.push(schedule);
  saveSchedules(schedules);
}

function removeSchedule(id) {
  const schedules = loadSchedules();
  const updated = schedules.filter((s) => s.id !== id);
  saveSchedules(updated);
  return updated.length < schedules.length;
}

function updateSchedule(id, changes) {
  const schedules = loadSchedules();
  const idx = schedules.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  schedules[idx] = { ...schedules[idx], ...changes };
  saveSchedules(schedules);
  return true;
}

module.exports = { loadSchedules, saveSchedules, addSchedule, removeSchedule, updateSchedule };

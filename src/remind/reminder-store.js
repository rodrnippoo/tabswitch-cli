const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const REMINDERS_PATH = path.join(os.homedir(), '.tabswitch', 'reminders.json');

async function loadReminders() {
  await fs.ensureDir(path.dirname(REMINDERS_PATH));
  if (!(await fs.pathExists(REMINDERS_PATH))) return [];
  return fs.readJSON(REMINDERS_PATH);
}

async function saveReminders(reminders) {
  await fs.ensureDir(path.dirname(REMINDERS_PATH));
  await fs.writeJSON(REMINDERS_PATH, reminders, { spaces: 2 });
}

async function addReminder(reminder) {
  const reminders = await loadReminders();
  reminders.push(reminder);
  await saveReminders(reminders);
}

async function removeReminder(sessionName) {
  const reminders = await loadReminders();
  const updated = reminders.filter(r => r.sessionName !== sessionName);
  await saveReminders(updated);
  return updated.length < reminders.length;
}

async function updateReminder(updated) {
  const reminders = await loadReminders();
  const index = reminders.findIndex(r => r.sessionName === updated.sessionName);
  if (index === -1) return false;
  reminders[index] = updated;
  await saveReminders(reminders);
  return true;
}

module.exports = { loadReminders, saveReminders, addReminder, removeReminder, updateReminder };

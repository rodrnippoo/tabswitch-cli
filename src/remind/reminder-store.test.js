const fs = require('fs-extra');
const path = require('path');
const os = require('os');

jest.mock('fs-extra');

const REMINDERS_PATH = path.join(os.homedir(), '.tabswitch', 'reminders.json');

const { loadReminders, saveReminders, addReminder, removeReminder, updateReminder } = require('./reminder-store');

beforeEach(() => {
  fs.ensureDir.mockResolvedValue();
  fs.pathExists.mockResolvedValue(true);
  fs.readJSON.mockResolvedValue([]);
  fs.writeJSON.mockResolvedValue();
});

test('loadReminders returns empty array if file missing', async () => {
  fs.pathExists.mockResolvedValue(false);
  const result = await loadReminders();
  expect(result).toEqual([]);
});

test('loadReminders returns parsed reminders', async () => {
  fs.readJSON.mockResolvedValue([{ sessionName: 'work' }]);
  const result = await loadReminders();
  expect(result[0].sessionName).toBe('work');
});

test('addReminder appends and saves', async () => {
  fs.readJSON.mockResolvedValue([]);
  await addReminder({ sessionName: 'dev' });
  expect(fs.writeJSON).toHaveBeenCalledWith(
    expect.any(String),
    [{ sessionName: 'dev' }],
    { spaces: 2 }
  );
});

test('removeReminder removes by sessionName', async () => {
  fs.readJSON.mockResolvedValue([{ sessionName: 'dev' }, { sessionName: 'work' }]);
  const removed = await removeReminder('dev');
  expect(removed).toBe(true);
  expect(fs.writeJSON).toHaveBeenCalledWith(expect.any(String), [{ sessionName: 'work' }], { spaces: 2 });
});

test('updateReminder updates matching entry', async () => {
  fs.readJSON.mockResolvedValue([{ sessionName: 'dev', reminderCount: 0 }]);
  const ok = await updateReminder({ sessionName: 'dev', reminderCount: 1 });
  expect(ok).toBe(true);
  expect(fs.writeJSON).toHaveBeenCalledWith(
    expect.any(String),
    [{ sessionName: 'dev', reminderCount: 1 }],
    { spaces: 2 }
  );
});

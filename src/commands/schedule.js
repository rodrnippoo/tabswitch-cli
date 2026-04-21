'use strict';

const { createSchedule, getDueSchedules, advanceSchedule } = require('../schedule/scheduler');
const { loadSchedules, addSchedule, removeSchedule, updateSchedule } = require('../schedule/schedule-store');
const { getSession } = require('../session/manager');
const { launchBrowser } = require('../browser/launcher');

function registerScheduleCommands(program) {
  const schedule = program.command('schedule').description('Schedule sessions to open automatically');

  schedule
    .command('add <session> <datetime>')
    .description('Schedule a session to open at a given time (ISO 8601 or natural date)')
    .option('-b, --browser <browser>', 'Browser to use')
    .option('-r, --repeat <interval>', 'Repeat interval: daily or weekly')
    .action((session, datetime, opts) => {
      const entry = createSchedule(session, opts.browser, datetime, { repeat: opts.repeat });
      addSchedule(entry);
      console.log(`Scheduled "${session}" for ${entry.scheduledAt}${opts.repeat ? ` (${opts.repeat})` : ''} [id: ${entry.id}]`);
    });

  schedule
    .command('list')
    .description('List all scheduled sessions')
    .action(() => {
      const schedules = loadSchedules();
      if (!schedules.length) return console.log('No schedules found.');
      schedules.forEach((s) => {
        const status = s.fired ? 'done' : 'pending';
        console.log(`[${s.id.slice(0, 8)}] ${s.sessionName} @ ${s.scheduledAt} | ${status}${s.repeat ? ` | repeats ${s.repeat}` : ''}`);
      });
    });

  schedule
    .command('remove <id>')
    .description('Remove a scheduled session by ID prefix')
    .action((id) => {
      const schedules = loadSchedules();
      const match = schedules.find((s) => s.id.startsWith(id));
      if (!match) return console.error(`No schedule found matching id: ${id}`);
      removeSchedule(match.id);
      console.log(`Removed schedule ${match.id}`);
    });

  schedule
    .command('run')
    .description('Check and fire any due schedules (run via cron or manually)')
    .action(async () => {
      const schedules = loadSchedules();
      const due = getDueSchedules(schedules);
      if (!due.length) return console.log('No schedules due.');
      for (const s of due) {
        const session = getSession(s.sessionName);
        if (!session) {
          console.warn(`Session "${s.sessionName}" not found, skipping.`);
        } else {
          console.log(`Opening session "${s.sessionName}"...`);
          for (const url of session.urls) {
            await launchBrowser(url, s.browser);
          }
        }
        const next = advanceSchedule(s);
        updateSchedule(s.id, next);
      }
      console.log(`Fired ${due.length} schedule(s).`);
    });
}

module.exports = { registerScheduleCommands };

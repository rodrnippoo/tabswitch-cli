const chalk = require('chalk');
const { createReminder, isDue, isExpired, tickReminder } = require('../remind/reminder');
const { loadReminders, addReminder, removeReminder, updateReminder } = require('../remind/reminder-store');

function registerRemindCommands(program) {
  const remind = program.command('remind').description('Manage session reminders');

  remind
    .command('add <session>')
    .description('Add a reminder for a session')
    .option('-i, --interval <minutes>', 'Reminder interval in minutes', '60')
    .option('-m, --max <count>', 'Max number of reminders', '5')
    .action(async (session, opts) => {
      const reminder = createReminder(session, {
        intervalMinutes: parseInt(opts.interval, 10),
        maxReminders: parseInt(opts.max, 10),
      });
      await addReminder(reminder);
      console.log(chalk.green(`Reminder set for session "${session}" every ${opts.interval} min.`));
    });

  remind
    .command('list')
    .description('List all reminders')
    .action(async () => {
      const reminders = await loadReminders();
      if (!reminders.length) return console.log(chalk.yellow('No reminders set.'));
      reminders.forEach(r => {
        const status = isExpired(r) ? chalk.red('expired') : isDue(r) ? chalk.green('due') : chalk.gray('waiting');
        console.log(`  ${chalk.bold(r.sessionName)} — every ${r.intervalMinutes}m [${status}] (${r.reminderCount}/${r.maxReminders})`);
      });
    });

  remind
    .command('remove <session>')
    .description('Remove a reminder')
    .action(async (session) => {
      const removed = await removeReminder(session);
      if (removed) console.log(chalk.green(`Reminder for "${session}" removed.`));
      else console.log(chalk.red(`No reminder found for "${session}".`));
    });

  remind
    .command('check')
    .description('Check and display due reminders')
    .action(async () => {
      const reminders = await loadReminders();
      const due = reminders.filter(r => !isExpired(r) && isDue(r));
      if (!due.length) return console.log(chalk.gray('No reminders due.'));
      for (const r of due) {
        console.log(chalk.cyan(`⏰ Reminder: open session "${r.sessionName}"?`));
        const ticked = tickReminder(r);
        await updateReminder(ticked);
      }
    });
}

module.exports = { registerRemindCommands };

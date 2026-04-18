const chalk = require('chalk');
const { getSession } = require('../session/manager');
const { launchBrowser } = require('../browser/launcher');
const { detectInstalledBrowsers, getDefaultBrowser } = require('../browser/detector');

function registerOpenCommands(program) {
  program
    .command('open <name>')
    .description('Open a saved session in a browser')
    .option('-b, --browser <browser>', 'Browser to use (chrome, firefox, brave, edge)')
    .option('-l, --list-browsers', 'List detected browsers and exit')
    .action(async (name, opts) => {
      if (opts.listBrowsers) {
        const found = detectInstalledBrowsers();
        if (found.length === 0) {
          console.log(chalk.yellow('No supported browsers detected.'));
        } else {
          console.log(chalk.cyan('Detected browsers:'));
          found.forEach(b => console.log(`  ${chalk.green('✔')} ${b}`));
        }
        return;
      }

      const session = getSession(name);
      if (!session) {
        console.error(chalk.red(`Session "${name}" not found.`));
        process.exit(1);
      }

      const browser = opts.browser || getDefaultBrowser();
      if (!browser) {
        console.error(chalk.red('No supported browser detected. Use --browser to specify one.'));
        process.exit(1);
      }

      console.log(chalk.cyan(`Opening session "${name}" in ${browser} (${session.urls.length} tab(s))...`));

      try {
        await launchBrowser(browser, session.urls);
        console.log(chalk.green('Done!'));
      } catch (err) {
        console.error(chalk.red(`Failed to open browser: ${err.message}`));
        process.exit(1);
      }
    });
}

module.exports = { registerOpenCommands };

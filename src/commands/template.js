const manager = require('../template/template-manager');
const { createSession } = require('../session/manager');

function registerTemplateCommands(program) {
  const tpl = program.command('template').description('Manage reusable tab templates');

  tpl
    .command('create <name> [urls...]')
    .description('Create a new template with optional URLs')
    .option('-d, --description <desc>', 'Template description', '')
    .action((name, urls, opts) => {
      try {
        const t = manager.newTemplate(name, urls, opts.description);
        console.log(`Template "${t.name}" created with ${t.urls.length} URL(s).`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
    });

  tpl
    .command('add-url <name> <url>')
    .description('Add a URL to a template')
    .action((name, url) => {
      try {
        const t = manager.addUrl(name, url);
        console.log(`Added URL to "${t.name}". Total: ${t.urls.length}`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
    });

  tpl
    .command('remove-url <name> <url>')
    .description('Remove a URL from a template')
    .action((name, url) => {
      try {
        const t = manager.removeUrl(name, url);
        console.log(`Removed URL from "${t.name}". Remaining: ${t.urls.length}`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
    });

  tpl
    .command('list')
    .description('List all templates')
    .action(() => {
      const templates = manager.list();
      if (!templates.length) return console.log('No templates found.');
      templates.forEach(t => {
        console.log(`  ${t.name} (${t.urls.length} URLs)${t.description ? ' — ' + t.description : ''}`);
      });
    });

  tpl
    .command('delete <name>')
    .description('Delete a template')
    .action((name) => {
      try {
        manager.remove(name);
        console.log(`Template "${name}" deleted.`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
    });

  tpl
    .command('use <name> <sessionName>')
    .description('Create a new session from a template')
    .action((name, sessionName) => {
      try {
        const t = manager.get(name);
        if (!t) return console.error(`Template "${name}" not found.`);
        const session = createSession(sessionName, t.urls);
        console.log(`Session "${session.name}" created from template "${name}" with ${session.tabs.length} tab(s).`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
      }
    });
}

module.exports = { registerTemplateCommands };

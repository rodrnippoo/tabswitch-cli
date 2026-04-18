const { addTag, removeTag, listByTag, listAllTags } = require('../tags/tagger');

function registerTagCommands(program) {
  const tag = program.command('tag').description('Manage session tags');

  tag
    .command('add <session> <tag>')
    .description('Add a tag to a session')
    .action(async (session, tagName) => {
      try {
        const updated = await addTag(session, tagName);
        console.log(`Tag '${tagName}' added to '${session}'. Tags: ${updated.tags.join(', ')}`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
      }
    });

  tag
    .command('remove <session> <tag>')
    .description('Remove a tag from a session')
    .action(async (session, tagName) => {
      try {
        const updated = await removeTag(session, tagName);
        console.log(`Tag '${tagName}' removed. Remaining tags: ${(updated.tags || []).join(', ') || 'none'}`);
      } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
      }
    });

  tag
    .command('list [tag]')
    .description('List sessions by tag, or list all tags')
    .action(async (tagName) => {
      try {
        if (tagName) {
          const sessions = await listByTag(tagName);
          if (!sessions.length) return console.log(`No sessions found with tag '${tagName}'`);
          sessions.forEach(s => console.log(`  ${s.name} — ${(s.urls || []).length} url(s)`));
        } else {
          const tags = await listAllTags();
          if (!tags.length) return console.log('No tags found.');
          tags.forEach(t => console.log(`  #${t}`));
        }
      } catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
      }
    });
}

module.exports = { registerTagCommands };

const { newWorkspace, addSession, removeSession, rename, remove, listWorkspaces, getWorkspace } = require('../workspace/workspace-manager');

function registerWorkspaceCommands(program) {
  const ws = program.command('workspace').description('Manage workspaces grouping multiple sessions');

  ws.command('create <name>')
    .description('Create a new workspace')
    .action(name => {
      try {
        const w = newWorkspace(name);
        console.log(`Workspace "${w.name}" created.`);
      } catch (e) { console.error(e.message); }
    });

  ws.command('add <workspace> <session>')
    .description('Add a session to a workspace')
    .action((workspace, session) => {
      try {
        addSession(workspace, session);
        console.log(`Session "${session}" added to workspace "${workspace}".`);
      } catch (e) { console.error(e.message); }
    });

  ws.command('remove-session <workspace> <session>')
    .description('Remove a session from a workspace')
    .action((workspace, session) => {
      try {
        removeSession(workspace, session);
        console.log(`Session "${session}" removed from workspace "${workspace}".`);
      } catch (e) { console.error(e.message); }
    });

  ws.command('rename <old> <new>')
    .description('Rename a workspace')
    .action((old, newName) => {
      try {
        rename(old, newName);
        console.log(`Workspace renamed to "${newName}".`);
      } catch (e) { console.error(e.message); }
    });

  ws.command('delete <name>')
    .description('Delete a workspace')
    .action(name => {
      try {
        remove(name);
        console.log(`Workspace "${name}" deleted.`);
      } catch (e) { console.error(e.message); }
    });

  ws.command('list')
    .description('List all workspaces')
    .action(() => {
      const all = listWorkspaces();
      if (!all.length) return console.log('No workspaces found.');
      all.forEach(w => console.log(`${w.name} (${w.sessionNames.length} sessions)`));
    });
}

module.exports = { registerWorkspaceCommands };

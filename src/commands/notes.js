const { addNote, removeNote, listNotes, editNote } = require('../notes/noter');
const { getNotes } = require('../notes/notes-store');

function registerNotesCommands(program) {
  const notes = program.command('notes').description('Manage notes for sessions');

  notes
    .command('add <sessionId> <text>')
    .description('Add a note to a session')
    .action((sessionId, text) => {
      try {
        const updated = addNote(sessionId, text);
        console.log(`Note added to session "${sessionId}".`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    });

  notes
    .command('list <sessionId>')
    .description('List all notes for a session')
    .action((sessionId) => {
      try {
        const items = listNotes(sessionId);
        if (!items.length) {
          console.log(`No notes for session "${sessionId}".`);
          return;
        }
        items.forEach((note, i) => {
          console.log(`[${i}] ${note.text}  (${new Date(note.createdAt).toLocaleString()})`);
        });
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    });

  notes
    .command('edit <sessionId> <index> <newText>')
    .description('Edit a note by index')
    .action((sessionId, index, newText) => {
      try {
        editNote(sessionId, parseInt(index, 10), newText);
        console.log(`Note ${index} updated.`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    });

  notes
    .command('remove <sessionId> <index>')
    .description('Remove a note by index')
    .action((sessionId, index) => {
      try {
        removeNote(sessionId, parseInt(index, 10));
        console.log(`Note ${index} removed from session "${sessionId}".`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
      }
    });
}

module.exports = { registerNotesCommands };

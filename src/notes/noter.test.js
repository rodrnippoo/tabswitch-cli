const { addNote, removeNote, listNotes, editNote } = require('./noter');
const store = require('../session/store');

jest.mock('../session/store');

const mockSession = { id: 'ses1', name: 'Work', urls: [], notes: [] };

beforeEach(() => {
  jest.clearAllMocks();
  store.getSession.mockReturnValue({ ...mockSession, notes: [] });
  store.saveSession.mockImplementation(() => {});
});

test('addNote adds a note to session', () => {
  const note = addNote('ses1', 'Remember to check PR');
  expect(note.text).toBe('Remember to check PR');
  expect(note.id).toBeDefined();
  expect(note.createdAt).toBeDefined();
  expect(store.saveSession).toHaveBeenCalledTimes(1);
});

test('addNote throws if session not found', () => {
  store.getSession.mockReturnValue(null);
  expect(() => addNote('bad', 'note')).toThrow("Session 'bad' not found");
});

test('listNotes returns empty array when no notes', () => {
  const notes = listNotes('ses1');
  expect(notes).toEqual([]);
});

test('removeNote removes correct note', () => {
  const existingNote = { id: '42', text: 'old note', createdAt: '' };
  store.getSession.mockReturnValue({ ...mockSession, notes: [existingNote] });
  const remaining = removeNote('ses1', '42');
  expect(remainingaveLength(0);
  expect(store.saveSession).toHaveBeenCalled();
});

test('editNote updates note text', () => {
  const existingNote = { id: '99', text: 'original', createdAt: '' };
  store.getSession.mockReturnValue({ ...mockSession, notes: [existingNote] });
  const updated = editNote('ses1', '99', 'updated text');
  expect(updated.text).toBe('updated text');
  expect(updated.updatedAt).toBeDefined();
});

test('editNote throws if session not found', () => {
  store.getSession.mockReturnValue(null);
  expect(() => editNote('bad', '1', 'text')).toThrow("Session 'bad' not found");
});

const { pinSession, unpinSession, listPinned, isPinned } = require('./pinner');
const store = require('../session/store');

jest.mock('../session/store');

const mockSessions = () => ({
  abc: { id: 'abc', name: 'Work', urls: [] },
  xyz: { id: 'xyz', name: 'Personal', urls: [] },
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('pinSession marks session as pinned', () => {
  const sessions = mockSessions();
  store.loadSessions.mockReturnValue(sessions);
  store.saveSessions.mockImplementation(() => {});

  const result = pinSession('abc');
  expect(result.pinned).toBe(true);
  expect(result.pinnedAt).toBeDefined();
  expect(store.saveSessions).toHaveBeenCalled();
});

test('pinSession throws if session not found', () => {
  store.loadSessions.mockReturnValue({});
  expect(() => pinSession('missing')).toThrow("Session 'missing' not found");
});

test('unpinSession removes pinned flag', () => {
  const sessions = mockSessions();
  sessions.abc.pinned = true;
  sessions.abc.pinnedAt = new Date().toISOString();
  store.loadSessions.mockReturnValue(sessions);
  store.saveSessions.mockImplementation(() => {});

  const result = unpinSession('abc');
  expect(result.pinned).toBe(false);
  expect(result.pinnedAt).toBeUndefined();
});

test('listPinned returns only pinned sessions sorted by pinnedAt', () => {
  const sessions = mockSessions();
  sessions.abc.pinned = true;
  sessions.abc.pinnedAt = '2024-01-01T00:00:00.000Z';
  store.loadSessions.mockReturnValue(sessions);

  const result = listPinned();
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe('abc');
});

test('isPinned returns correct boolean', () => {
  const sessions = mockSessions();
  sessions.abc.pinned = true;
  store.loadSessions.mockReturnValue(sessions);

  expect(isPinned('abc')).toBe(true);
  expect(isPinned('xyz')).toBe(false);
});

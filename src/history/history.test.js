const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('../session/store', () => ({
  ensureDir: jest.fn().mockResolvedValue(undefined),
  loadSessions: jest.fn(),
  saveSessions: jest.fn()
}));

const HISTORY_FILE = path.join(os.homedir(), '.tabswitch', 'history.json');

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

const { recordOpen, getHistory, clearHistory, getSessionHistory } = require('./history');

beforeEach(() => {
  jest.clearAllMocks();
  fs.existsSync.mockReturnValue(false);
});

test('recordOpen adds entry to history', async () => {
  fs.existsSync.mockReturnValue(false);
  const entry = await recordOpen('work', ['https://github.com']);
  expect(entry.sessionName).toBe('work');
  expect(entry.urls).toEqual(['https://github.com']);
  expect(entry.openedAt).toBeDefined();
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('getHistory returns limited entries', async () => {
  const mockData = Array.from({ length: 30 }, (_, i) => ({
    sessionName: `session-${i}`,
    urls: [],
    openedAt: new Date().toISOString()
  }));
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
  const history = await getHistory(10);
  expect(history).toHaveLength(10);
});

test('clearHistory empties history', async () => {
  await clearHistory();
  const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
  expect(written).toEqual([]);
});

test('getSessionHistory filters by session name', async () => {
  const mockData = [
    { sessionName: 'work', urls: [], openedAt: '' },
    { sessionName: 'personal', urls: [], openedAt: '' },
    { sessionName: 'work', urls: [], openedAt: '' }
  ];
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
  const result = await getSessionHistory('work');
  expect(result).toHaveLength(2);
  expect(result.every(e => e.sessionName === 'work')).toBe(true);
});

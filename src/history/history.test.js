const fs = require('fs-extra');
const path = require('path');
const os = require('os');

jest.mock('fs-extra');

const HISTORY_FILE = path.join(os.homedir(), '.tabswitch', 'history.json');

const { recordOpen, getHistory, clearHistory, getSessionHistory } = require('./history');

beforeEach(() => {
  jest.clearAllMocks();
  fs.ensureFile.mockResolvedValue();
  fs.readFile.mockResolvedValue(JSON.stringify([]));
  fs.readJson.mockResolvedValue([]);
  fs.writeJson.mockResolvedValue();
});

describe('recordOpen', () => {
  it('adds an entry to history', async () => {
    const entry = await recordOpen('work', ['https://github.com']);
    expect(entry.sessionName).toBe('work');
    expect(entry.urls).toContain('https://github.com');
    expect(entry.openedAt).toBeDefined();
    expect(fs.writeJson).toHaveBeenCalled();
  });

  it('prepends new entries', async () => {
    const existing = [{ sessionName: 'old', urls: [], openedAt: '2024-01-01T00:00:00.000Z' }];
    fs.readJson.mockResolvedValue(existing);
    await recordOpen('new-session', []);
    const saved = fs.writeJson.mock.calls[0][1];
    expect(saved[0].sessionName).toBe('new-session');
  });
});

describe('getHistory', () => {
  it('returns limited history entries', async () => {
    const entries = Array.from({ length: 30 }, (_, i) => ({
      sessionName: `session-${i}`,
      urls: [],
      openedAt: new Date().toISOString()
    }));
    fs.readJson.mockResolvedValue(entries);
    const result = await getHistory(10);
    expect(result).toHaveLength(10);
  });
});

describe('clearHistory', () => {
  it('writes empty array', async () => {
    await clearHistory();
    expect(fs.writeJson).toHaveBeenCalledWith(HISTORY_FILE, [], expect.any(Object));
  });
});

describe('getSessionHistory', () => {
  it('filters by session name', async () => {
    fs.readJson.mockResolvedValue([
      { sessionName: 'work', urls: [], openedAt: '' },
      { sessionName: 'personal', urls: [], openedAt: '' },
      { sessionName: 'work', urls: [], openedAt: '' }
    ]);
    const result = await getSessionHistory('work');
    expect(result).toHaveLength(2);
    expect(result.every(e => e.sessionName === 'work')).toBe(true);
  });
});

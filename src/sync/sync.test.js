const fs = require('fs');
const os = require('os');
const path = require('path');
const { exportSessions } = require('./exporter');
const { importSessions } = require('./importer');

jest.mock('../session/store', () => {
  let store = {};
  return {
    loadSessions: jest.fn(async () => ({ ...store })),
    saveSessions: jest.fn(async (data) => { store = { ...data }; }),
    __setStore: (data) => { store = { ...data }; },
  };
});

const { __setStore, loadSessions, saveSessions } = require('../session/store');

beforeEach(() => {
  __setStore({
    work: { urls: ['https://github.com', 'https://jira.example.com'], createdAt: '2024-01-01' },
    personal: { urls: ['https://news.ycombinator.com'], createdAt: '2024-01-02' },
  });
});

describe('exportSessions', () => {
  it('writes a valid JSON file with session data', async () => {
    const tmp = path.join(os.tmpdir(), `tabswitch-test-${Date.now()}.json`);
    const result = await exportSessions(tmp);
    expect(result.count).toBe(2);
    const data = JSON.parse(fs.readFileSync(tmp, 'utf8'));
    expect(data.version).toBe(1);
    expect(data.sessions.work.urls).toContain('https://github.com');
    fs.unlinkSync(tmp);
  });
});

describe('importSessions', () => {
  it('imports sessions from a valid export file', async () => {
    const tmp = path.join(os.tmpdir(), `tabswitch-import-${Date.now()}.json`);
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: { newSession: { urls: ['https://example.com'] } },
    };
    fs.writeFileSync(tmp, JSON.stringify(payload));
    __setStore({});
    const { imported, skipped } = await importSessions(tmp);
    expect(imported).toContain('newSession');
    expect(skipped).toHaveLength(0);
    fs.unlinkSync(tmp);
  });

  it('skips existing sessions without overwrite flag', async () => {
    const tmp = path.join(os.tmpdir(), `tabswitch-skip-${Date.now()}.json`);
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: { work: { urls: ['https://example.com'] } },
    };
    fs.writeFileSync(tmp, JSON.stringify(payload));
    const { imported, skipped } = await importSessions(tmp, { overwrite: false });
    expect(skipped).toContain('work');
    expect(imported).toHaveLength(0);
    fs.unlinkSync(tmp);
  });
});

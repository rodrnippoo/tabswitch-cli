const fs = require('fs');
const path = require('path');
const os = require('os');
const { exportSessions } = require('./exporter');
const { importSessions } = require('./importer');

jest.mock('../session/store', () => ({
  loadSessions: jest.fn(),
  saveSessions: jest.fn(),
}));

const { loadSessions, saveSessions } = require('../session/store');

describe('exporter', () => {
  it('throws if no sessions exist', async () => {
    loadSessions.mockResolvedValue({});
    await expect(exportSessions()).rejects.toThrow('No sessions found');
  });

  it('writes sessions to a json file', async () => {
    loadSessions.mockResolvedValue({ work: { urls: ['https://github.com'] } });
    const tmpFile = path.join(os.tmpdir(), 'ts-export-test.json');
    const result = await exportSessions(tmpFile);
    expect(result).toBe(tmpFile);
    const content = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    expect(content.sessions).toHaveProperty('work');
    fs.unlinkSync(tmpFile);
  });
});

describe('importer', () => {
  it('throws if file does not exist', async () => {
    await expect(importSessions('/nonexistent/file.json')).rejects.toThrow('File not found');
  });

  it('imports and merges sessions', async () => {
    loadSessions.mockResolvedValue({ existing: { urls: ['https://example.com'] } });
    saveSessions.mockResolvedValue();

    const tmpFile = path.join(os.tmpdir(), 'ts-import-test.json');
    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: { work: { urls: ['https://github.com'] } },
    };
    fs.writeFileSync(tmpFile, JSON.stringify(exportData));

    const result = await importSessions(tmpFile);
    expect(result.imported).toBe(1);
    expect(saveSessions).toHaveBeenCalled();
    fs.unlinkSync(tmpFile);
  });
});

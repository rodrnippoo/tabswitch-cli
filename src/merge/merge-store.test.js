const fs = require('fs');
const os = require('os');
const path = require('path');

const MERGE_LOG = path.join(os.homedir(), '.tabswitch', 'merges', 'merge-log.json');

beforeEach(() => {
  if (fs.existsSync(MERGE_LOG)) {
    fs.unlinkSync(MERGE_LOG);
  }
});

const { recordMerge, getMergeHistory } = require('./merge-store');

describe('recordMerge', () => {
  test('records a merge entry', () => {
    const session = { name: 'combined', urls: ['https://example.com'] };
    recordMerge(session, ['a', 'b']);
    const history = getMergeHistory();
    expect(history.length).toBe(1);
    expect(history[0].resultName).toBe('combined');
    expect(history[0].sources).toEqual(['a', 'b']);
    expect(history[0].urlCount).toBe(1);
  });

  test('appends multiple entries', () => {
    const s1 = { name: 'first', urls: ['https://a.com'] };
    const s2 = { name: 'second', urls: ['https://b.com', 'https://c.com'] };
    recordMerge(s1, ['x', 'y']);
    recordMerge(s2, ['y', 'z']);
    const history = getMergeHistory();
    expect(history.length).toBe(2);
    expect(history[1].resultName).toBe('second');
  });

  test('each entry has a timestamp', () => {
    recordMerge({ name: 'ts-test', urls: [] }, ['a']);
    const history = getMergeHistory();
    expect(history[0].timestamp).toBeDefined();
  });
});

describe('getMergeHistory', () => {
  test('returns empty array when no history', () => {
    const history = getMergeHistory();
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBe(0);
  });
});

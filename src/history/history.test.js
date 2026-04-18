const { recordOpen, getHistory, clearHistory, findInHistory } = require('./history');

jest.mock('../session/store', () => {
  let store = {};
  return {
    loadSessions: jest.fn(async () => JSON.parse(JSON.stringify(store))),
    saveSessions: jest.fn(async (data) => { store = JSON.parse(JSON.stringify(data)); }),
    __reset: () => { store = {}; },
  };
});

const storeModule = require('../session/store');

beforeEach(() => {
  storeModule.__reset();
  jest.clearAllMocks();
});

test('recordOpen adds an entry to history', async () => {
  const entry = await recordOpen('work', ['https://github.com', 'https://slack.com']);
  expect(entry.sessionName).toBe('work');
  expect(entry.urls).toHaveLength(2);
  expect(entry.openedAt).toBeDefined();
});

test('getHistory returns entries in reverse chronological order', async () => {
  await recordOpen('session-a', ['https://a.com']);
  await recordOpen('session-b', ['https://b.com']);
  const history = await getHistory(10);
  expect(history[0].sessionName).toBe('session-b');
  expect(history[1].sessionName).toBe('session-a');
});

test('getHistory respects limit', async () => {
  await recordOpen('s1', ['https://one.com']);
  await recordOpen('s2', ['https://two.com']);
  await recordOpen('s3', ['https://three.com']);
  const history = await getHistory(2);
  expect(history).toHaveLength(2);
});

test('clearHistory empties the history', async () => {
  await recordOpen('work', ['https://github.com']);
  await clearHistory();
  const history = await getHistory();
  expect(history).toHaveLength(0);
});

test('findInHistory filters by session name', async () => {
  await recordOpen('work', ['https://github.com']);
  await recordOpen('personal', ['https://twitter.com']);
  const results = await findInHistory('work');
  expect(results).toHaveLength(1);
  expect(results[0].sessionName).toBe('work');
});

test('findInHistory filters by url', async () => {
  await recordOpen('misc', ['https://github.com', 'https://npmjs.com']);
  const results = await findInHistory('github');
  expect(results).toHaveLength(1);
});

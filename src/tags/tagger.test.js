const { addTag, removeTag, listByTag, listAllTags } = require('./tagger');
const store = require('../session/store');

jest.mock('../session/store');

const mockSessions = () => ({
  work: { urls: ['https://github.com'], tags: ['dev'] },
  personal: { urls: ['https://reddit.com'], tags: [] },
});

beforeEach(() => {
  store.loadSessions.mockResolvedValue(mockSessions());
  store.saveSessions.mockResolvedValue();
});

test('addTag adds a new tag to a session', async () => {
  const result = await addTag('personal', 'fun');
  expect(result.tags).toContain('fun');
  expect(store.saveSessions).toHaveBeenCalled();
});

test('addTag normalizes tag to lowercase', async () => {
  const result = await addTag('personal', 'FUN');
  expect(result.tags).toContain('fun');
});

test('addTag does not duplicate existing tag', async () => {
  const result = await addTag('work', 'dev');
  expect(result.tags.filter(t => t === 'dev').length).toBe(1);
});

test('addTag throws if session not found', async () => {
  await expect(addTag('ghost', 'x')).rejects.toThrow("Session 'ghost' not found");
});

test('removeTag removes an existing tag', async () => {
  const result = await removeTag('work', 'dev');
  expect(result.tags).not.toContain('dev');
});

test('listByTag returns matching sessions', async () => {
  const results = await listByTag('dev');
  expect(results.map(s => s.name)).toContain('work');
});

test('listAllTags returns sorted unique tags', async () => {
  const tags = await listAllTags();
  expect(tags).toContain('dev');
  expect(tags).toEqual([...tags].sort());
});

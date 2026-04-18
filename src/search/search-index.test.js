const { SearchIndex } = require('./search-index');

const sessions = [
  { name: 'work', urls: ['https://github.com/myorg'], tags: ['dev'] },
  { name: 'reading', urls: ['https://news.ycombinator.com'], tags: ['news', 'tech'] },
];

let idx;
beforeEach(() => {
  idx = new SearchIndex();
  idx.build(sessions);
});

test('lookup finds session name by token', () => {
  const result = idx.lookup('work');
  expect(result.has('work')).toBe(true);
});

test('lookup finds by URL token', () => {
  const result = idx.lookup('github');
  expect(result.has('work')).toBe(true);
});

test('lookup finds by tag', () => {
  const result = idx.lookup('dev');
  expect(result.has('work')).toBe(true);
});

test('lookup returns empty set for unknown token', () => {
  const result = idx.lookup('zzznomatch');
  expect(result.size).toBe(0);
});

test('suggest returns matching prefixes', () => {
  const suggestions = idx.suggest('gi');
  expect(suggestions).toContain('github');
});

test('suggest returns empty for no match', () => {
  expect(idx.suggest('zzz')).toHaveLength(0);
});

test('build clears previous index', () => {
  idx.build([]);
  expect(idx.suggest('github')).toHaveLength(0);
});

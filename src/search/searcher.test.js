const { searchByQuery, searchByUrl, searchByName, rankResults } = require('./searcher');

const sessions = [
  { name: 'work', urls: ['https://github.com', 'https://jira.company.com'], tags: ['dev'] },
  { name: 'news', urls: ['https://hn.algolia.com', 'https://reddit.com/r/programming'], tags: ['reading'] },
  { name: 'github-prs', urls: ['https://github.com/pulls'], tags: ['dev', 'review'] },
];

test('searchByQuery matches name', () => {
  const res = searchByQuery(sessions, 'work');
  expect(res).toHaveLength(1);
  expect(res[0].name).toBe('work');
});

test('searchByQuery matches URL fragment', () => {
  const res = searchByQuery(sessions, 'github');
  expect(res).toHaveLength(2);
});

test('searchByQuery matches tag', () => {
  const res = searchByQuery(sessions, 'reading');
  expect(res).toHaveLength(1);
  expect(res[0].name).toBe('news');
});

test('searchByQuery returns all on empty query', () => {
  expect(searchByQuery(sessions, '')).toHaveLength(3);
});

test('searchByUrl filters by URL fragment', () => {
  const res = searchByUrl(sessions, 'reddit');
  expect(res).toHaveLength(1);
});

test('searchByName is case insensitive', () => {
  const res = searchByName(sessions, 'WORK');
  expect(res).toHaveLength(1);
});

test('rankResults puts exact name match first', () => {
  const res = rankResults(sessions, 'work');
  expect(res[0].name).toBe('work');
});

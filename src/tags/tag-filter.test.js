const { matchesAllTags, matchesAnyTag, filterSessions } = require('./tag-filter');

const sessions = [
  { name: 'work', tags: ['dev', 'important'] },
  { name: 'news', tags: ['reading'] },
  { name: 'misc', tags: [] },
];

test('matchesAllTags returns true when session has all tags', () => {
  expect(matchesAllTags(sessions[0], ['dev', 'important'])).toBe(true);
});

test('matchesAllTags returns false when session missing a tag', () => {
  expect(matchesAllTags(sessions[0], ['dev', 'reading'])).toBe(false);
});

test('matchesAllTags returns true for empty tag list', () => {
  expect(matchesAllTags(sessions[2], [])).toBe(true);
});

test('matchesAnyTag returns true when at least one tag matches', () => {
  expect(matchesAnyTag(sessions[0], ['dev', 'reading'])).toBe(true);
});

test('matchesAnyTag returns false when no tags match', () => {
  expect(matchesAnyTag(sessions[1], ['dev'])).toBe(false);
});

test('filterSessions with mode all filters correctly', () => {
  const result = filterSessions(sessions, ['dev'], 'all');
  expect(result.map(s => s.name)).toEqual(['work']);
});

test('filterSessions with mode any filters correctly', () => {
  const result = filterSessions(sessions, ['dev', 'reading'], 'any');
  expect(result.map(s => s.name)).toEqual(['work', 'news']);
});

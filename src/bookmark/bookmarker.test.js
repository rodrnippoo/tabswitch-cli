const {
  createBookmark,
  addBookmark,
  removeBookmark,
  listBookmarks,
  findBookmark,
} = require('./bookmarker');

describe('createBookmark', () => {
  it('creates a bookmark with provided fields', () => {
    const bm = createBookmark('s1', 'https://example.com', 'Example');
    expect(bm.sessionId).toBe('s1');
    expect(bm.url).toBe('https://example.com');
    expect(bm.label).toBe('Example');
    expect(bm.createdAt).toBeDefined();
  });

  it('uses url as label when no label provided', () => {
    const bm = createBookmark('s1', 'https://example.com');
    expect(bm.label).toBe('https://example.com');
  });
});

describe('addBookmark', () => {
  it('adds a new bookmark', () => {
    const result = addBookmark([], 's1', 'https://a.com', 'A');
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://a.com');
  });

  it('throws if bookmark already exists', () => {
    const existing = [createBookmark('s1', 'https://a.com')];
    expect(() => addBookmark(existing, 's1', 'https://a.com')).toThrow();
  });
});

describe('removeBookmark', () => {
  it('removes an existing bookmark', () => {
    const bms = [createBookmark('s1', 'https://a.com')];
    const result = removeBookmark(bms, 's1', 'https://a.com');
    expect(result).toHaveLength(0);
  });

  it('throws if bookmark not found', () => {
    expect(() => removeBookmark([], 's1', 'https://missing.com')).toThrow();
  });
});

describe('listBookmarks', () => {
  const bms = [
    createBookmark('s1', 'https://a.com'),
    createBookmark('s2', 'https://b.com'),
    createBookmark('s1', 'https://c.com'),
  ];

  it('lists all bookmarks when no sessionId given', () => {
    expect(listBookmarks(bms)).toHaveLength(3);
  });

  it('filters by sessionId', () => {
    expect(listBookmarks(bms, 's1')).toHaveLength(2);
  });
});

describe('findBookmark', () => {
  it('returns matching bookmark', () => {
    const bms = [createBookmark('s1', 'https://a.com', 'A')];
    expect(findBookmark(bms, 's1', 'https://a.com')).not.toBeNull();
  });

  it('returns null when not found', () => {
    expect(findBookmark([], 's1', 'https://x.com')).toBeNull();
  });
});

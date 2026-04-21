const { mergeSessions, deduplicateUrls, previewMerge } = require('./merger');

const sessionA = {
  name: 'work',
  urls: ['https://github.com', 'https://jira.example.com'],
  tags: ['dev', 'work'],
};

const sessionB = {
  name: 'research',
  urls: ['https://github.com', 'https://stackoverflow.com'],
  tags: ['dev', 'research'],
};

describe('mergeSessions', () => {
  test('merges two sessions into one', () => {
    const result = mergeSessions([sessionA, sessionB], 'combined');
    expect(result.name).toBe('combined');
    expect(result.urls).toContain('https://github.com');
    expect(result.urls).toContain('https://jira.example.com');
    expect(result.urls).toContain('https://stackoverflow.com');
  });

  test('deduplicates URLs across sessions', () => {
    const result = mergeSessions([sessionA, sessionB], 'combined');
    const githubCount = result.urls.filter(u => u === 'https://github.com').length;
    expect(githubCount).toBe(1);
  });

  test('merges tags from all sessions', () => {
    const result = mergeSessions([sessionA, sessionB], 'combined');
    expect(result.tags).toContain('dev');
    expect(result.tags).toContain('work');
    expect(result.tags).toContain('research');
  });

  test('throws if fewer than 2 sessions provided', () => {
    expect(() => mergeSessions([sessionA], 'fail')).toThrow();
  });

  test('records merged source names', () => {
    const result = mergeSessions([sessionA, sessionB], 'combined');
    expect(result.mergedFrom).toEqual(['work', 'research']);
  });
});

describe('deduplicateUrls', () => {
  test('removes duplicate URLs', () => {
    const urls = ['https://github.com', 'https://github.com/', 'https://example.com'];
    const result = deduplicateUrls(urls);
    expect(result.length).toBe(2);
  });
});

describe('previewMerge', () => {
  test('returns correct counts', () => {
    const info = previewMerge([sessionA, sessionB]);
    expect(info.totalUrls).toBe(4);
    expect(info.uniqueUrls).toBe(3);
    expect(info.duplicatesRemoved).toBe(1);
  });
});

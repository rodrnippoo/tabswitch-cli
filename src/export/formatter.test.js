const { toJSON, toCSV, toMarkdown, formatSessions } = require('./formatter');

const mockSessions = [
  { name: 'work', urls: ['https://github.com', 'https://jira.com'], tags: ['dev'], createdAt: '2024-01-01' },
  { name: 'reading', urls: ['https://news.ycombinator.com'], tags: ['read', 'tech'], createdAt: '2024-01-02' },
];

describe('formatter', () => {
  test('toJSON returns valid JSON string', () => {
    const result = toJSON(mockSessions);
    expect(() => JSON.parse(result)).not.toThrow();
    expect(JSON.parse(result)).toHaveLength(2);
  });

  test('toCSV includes header row', () => {
    const result = toCSV(mockSessions);
    const lines = result.split('\n');
    expect(lines[0]).toBe('name,url,tags,createdAt');
    expect(lines).toHaveLength(3);
  });

  test('toCSV separates urls and tags with pipe', () => {
    const result = toCSV(mockSessions);
    expect(result).toContain('github.com|https://jira.com');
    expect(result).toContain('read|tech');
  });

  test('toMarkdown includes session names as headings', () => {
    const result = toMarkdown(mockSessions);
    expect(result).toContain('## work');
    expect(result).toContain('## reading');
  });

  test('toMarkdown lists urls as bullet points', () => {
    const result = toMarkdown(mockSessions);
    expect(result).toContain('- https://github.com');
    expect(result).toContain('- https://news.ycombinator.com');
  });

  test('formatSessions dispatches to correct formatter', () => {
    expect(formatSessions(mockSessions, 'csv')).toContain('name,url');
    expect(formatSessions(mockSessions, 'markdown')).toContain('## work');
    expect(formatSessions(mockSessions, 'json')).toContain('"name"');
  });

  test('formatSessions defaults to json', () => {
    const result = formatSessions(mockSessions);
    expect(() => JSON.parse(result)).not.toThrow();
  });
});

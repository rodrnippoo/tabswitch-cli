const { createTemplate, addUrlToTemplate, removeUrlFromTemplate, renameTemplate } = require('./template');

describe('createTemplate', () => {
  test('creates a template with required fields', () => {
    const t = createTemplate('work', ['https://github.com', 'https://jira.example.com']);
    expect(t.name).toBe('work');
    expect(t.urls).toHaveLength(2);
    expect(t.id).toMatch(/^tpl_/);
    expect(t.createdAt).toBeDefined();
  });

  test('throws if name is missing', () => {
    expect(() => createTemplate('')).toThrow('Template name is required');
  });

  test('throws if urls is not an array', () => {
    expect(() => createTemplate('x', 'not-array')).toThrow('urls must be an array');
  });

  test('filters out blank URLs', () => {
    const t = createTemplate('t', ['https://a.com', '', '  ']);
    expect(t.urls).toHaveLength(1);
  });
});

describe('addUrlToTemplate', () => {
  test('adds a new URL', () => {
    const t = createTemplate('t', ['https://a.com']);
    const updated = addUrlToTemplate(t, 'https://b.com');
    expect(updated.urls).toHaveLength(2);
  });

  test('does not add duplicate URLs', () => {
    const t = createTemplate('t', ['https://a.com']);
    const updated = addUrlToTemplate(t, 'https://a.com');
    expect(updated.urls).toHaveLength(1);
  });

  test('throws if url is empty', () => {
    const t = createTemplate('t', []);
    expect(() => addUrlToTemplate(t, '')).toThrow('url is required');
  });
});

describe('removeUrlFromTemplate', () => {
  test('removes an existing URL', () => {
    const t = createTemplate('t', ['https://a.com', 'https://b.com']);
    const updated = removeUrlFromTemplate(t, 'https://a.com');
    expect(updated.urls).toEqual(['https://b.com']);
  });

  test('is a no-op for non-existent URL', () => {
    const t = createTemplate('t', ['https://a.com']);
    const updated = removeUrlFromTemplate(t, 'https://z.com');
    expect(updated.urls).toHaveLength(1);
  });
});

describe('renameTemplate', () => {
  test('renames a template', () => {
    const t = createTemplate('old', []);
    const updated = renameTemplate(t, 'new');
    expect(updated.name).toBe('new');
  });

  test('throws if new name is empty', () => {
    const t = createTemplate('old', []);
    expect(() => renameTemplate(t, '')).toThrow('New name is required');
  });
});

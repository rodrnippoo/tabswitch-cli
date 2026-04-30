const {
  validateBatchTarget,
  batchTag,
  batchUntag,
  batchDelete,
  batchArchive,
  batchSetColor,
  summarizeBatch,
} = require('./batcher');

const makeSessions = () => [
  { name: 'work', urls: ['https://github.com'], tags: ['dev'] },
  { name: 'news', urls: ['https://hn.com'], tags: ['read'] },
  { name: 'music', urls: ['https://spotify.com'], tags: [] },
];

describe('validateBatchTarget', () => {
  it('throws on empty names array', () => {
    expect(() => validateBatchTarget(makeSessions(), [])).toThrow();
  });

  it('throws when a session name is not found', () => {
    expect(() => validateBatchTarget(makeSessions(), ['missing'])).toThrow(/not found/);
  });

  it('passes for valid names', () => {
    expect(() => validateBatchTarget(makeSessions(), ['work', 'news'])).not.toThrow();
  });
});

describe('batchTag', () => {
  it('adds tags to targeted sessions', () => {
    const result = batchTag(makeSessions(), ['work', 'music'], ['important']);
    expect(result.find(s => s.name === 'work').tags).toContain('important');
    expect(result.find(s => s.name === 'music').tags).toContain('important');
    expect(result.find(s => s.name === 'news').tags).not.toContain('important');
  });

  it('does not duplicate existing tags', () => {
    const result = batchTag(makeSessions(), ['work'], ['dev']);
    expect(result.find(s => s.name === 'work').tags.filter(t => t === 'dev').length).toBe(1);
  });
});

describe('batchUntag', () => {
  it('removes specified tags from targeted sessions', () => {
    const result = batchUntag(makeSessions(), ['work'], ['dev']);
    expect(result.find(s => s.name === 'work').tags).not.toContain('dev');
  });
});

describe('batchDelete', () => {
  it('removes targeted sessions', () => {
    const result = batchDelete(makeSessions(), ['news']);
    expect(result.find(s => s.name === 'news')).toBeUndefined();
    expect(result.length).toBe(2);
  });
});

describe('batchArchive', () => {
  it('marks targeted sessions as archived', () => {
    const result = batchArchive(makeSessions(), ['work', 'music']);
    expect(result.find(s => s.name === 'work').archived).toBe(true);
    expect(result.find(s => s.name === 'news').archived).toBeUndefined();
  });

  it('sets archivedAt timestamp', () => {
    const result = batchArchive(makeSessions(), ['work']);
    expect(result.find(s => s.name === 'work').archivedAt).toBeDefined();
  });
});

describe('batchSetColor', () => {
  it('sets color on targeted sessions', () => {
    const result = batchSetColor(makeSessions(), ['news', 'music'], 'blue');
    expect(result.find(s => s.name === 'news').color).toBe('blue');
    expect(result.find(s => s.name === 'work').color).toBeUndefined();
  });
});

describe('summarizeBatch', () => {
  it('returns correct targeted and affected counts', () => {
    const original = makeSessions();
    const updated = batchTag(original, ['work'], ['new-tag']);
    const summary = summarizeBatch(original, updated, ['work']);
    expect(summary.targeted).toBe(1);
    expect(summary.affected).toBe(1);
  });
});

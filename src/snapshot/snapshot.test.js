const { createSnapshot, diffSnapshots } = require('./snapshot');
const store = require('../session/store');
const history = require('../history/history');

jest.mock('../session/store');
jest.mock('../history/history');

describe('createSnapshot', () => {
  beforeEach(() => jest.clearAllMocks());

  test('creates a snapshot with normalized URLs', () => {
    store.saveSession.mockImplementation(() => {});
    history.addToHistory.mockImplementation(() => {});

    const snap = createSnapshot('work', ['example.com', 'https://github.com']);
    expect(snap.name).toBe('work');
    expect(snap.type).toBe('snapshot');
    expect(snap.urls).toContain('https://example.com');
    expect(snap.urls).toContain('https://github.com');
    expect(store.saveSession).toHaveBeenCalledWith('work', expect.objectContaining({ name: 'work' }));
  });

  test('throws if name is missing', () => {
    expect(() => createSnapshot('', ['https://a.com'])).toThrow('Snapshot name is required');
  });

  test('throws if no URLs provided', () => {
    expect(() => createSnapshot('test', [])).toThrow('At least one URL is required');
  });
});

describe('diffSnapshots', () => {
  const snapA = { urls: ['https://a.com', 'https://b.com'] };
  const snapB = { urls: ['https://b.com', 'https://c.com'] };

  test('detects added URLs', () => {
    const { added } = diffSnapshots(snapA, snapB);
    expect(added).toEqual(['https://c.com']);
  });

  test('detects removed URLs', () => {
    const { removed } = diffSnapshots(snapA, snapB);
    expect(removed).toEqual(['https://a.com']);
  });

  test('detects common URLs', () => {
    const { common } = diffSnapshots(snapA, snapB);
    expect(common).toEqual(['https://b.com']);
  });
});

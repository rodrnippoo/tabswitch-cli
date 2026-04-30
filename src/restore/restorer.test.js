const { buildRestoreOptions, filterUrls, shouldSkipSession, restoreSession, restoreMany, summarizeRestore } = require('./restorer');

jest.mock('../browser/launcher', () => ({ launchBrowser: jest.fn().mockResolvedValue(true) }));
jest.mock('../archive/archiver', () => ({ isArchived: jest.fn(() => false) }));
jest.mock('../lock/locker', () => ({ isLocked: jest.fn(() => false) }));
jest.mock('../visibility/visibility', () => ({ isHidden: jest.fn(() => false) }));

const { isArchived } = require('../archive/archiver');
const { isLocked } = require('../lock/locker');
const { isHidden } = require('../visibility/visibility');

const makeSession = (overrides = {}) => ({
  name: 'test',
  urls: ['https://example.com', 'https://github.com'],
  ...overrides,
});

describe('buildRestoreOptions', () => {
  it('returns defaults when no options provided', () => {
    const opts = buildRestoreOptions();
    expect(opts.skipArchived).toBe(true);
    expect(opts.dryRun).toBe(false);
    expect(opts.browser).toBeNull();
  });

  it('respects provided options', () => {
    const opts = buildRestoreOptions({ browser: 'firefox', dryRun: true });
    expect(opts.browser).toBe('firefox');
    expect(opts.dryRun).toBe(true);
  });
});

describe('filterUrls', () => {
  it('returns all urls when no filter', () => {
    expect(filterUrls(['https://a.com', 'https://b.com'], null)).toHaveLength(2);
  });

  it('filters by pattern', () => {
    const result = filterUrls(['https://github.com', 'https://example.com'], 'github');
    expect(result).toEqual(['https://github.com']);
  });
});

describe('shouldSkipSession', () => {
  it('skips archived sessions when flag is set', () => {
    isArchived.mockReturnValueOnce(true);
    expect(shouldSkipSession(makeSession(), { skipArchived: true })).toBe(true);
  });

  it('does not skip when flags are false', () => {
    expect(shouldSkipSession(makeSession(), { skipArchived: false, skipLocked: false, skipHidden: false })).toBe(false);
  });
});

describe('restoreSession', () => {
  it('returns dryRun result without launching browser', async () => {
    const result = await restoreSession(makeSession(), { dryRun: true });
    expect(result.dryRun).toBe(true);
    expect(result.urls).toHaveLength(2);
  });

  it('skips session with no matching urls', async () => {
    const result = await restoreSession(makeSession(), { urlFilter: 'nonexistent' });
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe('no_urls');
  });

  it('restores session and returns count', async () => {
    const result = await restoreSession(makeSession());
    expect(result.restored).toBe(true);
    expect(result.count).toBe(2);
  });
});

describe('summarizeRestore', () => {
  it('counts results correctly', () => {
    const results = [
      { restored: true },
      { restored: true },
      { skipped: true, reason: 'filtered' },
      { dryRun: true },
    ];
    const summary = summarizeRestore(results);
    expect(summary.restored).toBe(2);
    expect(summary.skipped).toBe(1);
    expect(summary.dryRun).toBe(1);
    expect(summary.total).toBe(4);
  });
});

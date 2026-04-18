const { detectInstalledBrowsers, isBrowserInstalled, getDefaultBrowser, BROWSERS } = require('./detector');
const { buildOpenCommand } = require('./launcher');

describe('detector', () => {
  test('BROWSERS has expected keys', () => {
    expect(Object.keys(BROWSERS)).toEqual(expect.arrayContaining(['chrome', 'firefox', 'brave', 'edge']));
  });

  test('detectInstalledBrowsers returns an array', () => {
    const result = detectInstalledBrowsers();
    expect(Array.isArray(result)).toBe(true);
  });

  test('isBrowserInstalled returns boolean', () => {
    expect(typeof isBrowserInstalled('chrome')).toBe('boolean');
  });

  test('getDefaultBrowser returns string or null', () => {
    const result = getDefaultBrowser();
    expect(result === null || typeof result === 'string').toBe(true);
  });
});

describe('launcher - buildOpenCommand', () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  test('throws on unknown browser', () => {
    expect(() => buildOpenCommand('netscape', ['https://example.com'])).toThrow();
  });

  test('builds a command string containing the url', () => {
    const cmd = buildOpenCommand('chrome', ['https://example.com']);
    expect(cmd).toContain('example.com');
  });

  test('includes multiple urls', () => {
    const cmd = buildOpenCommand('firefox', ['https://a.com', 'https://b.com']);
    expect(cmd).toContain('a.com');
    expect(cmd).toContain('b.com');
  });
});

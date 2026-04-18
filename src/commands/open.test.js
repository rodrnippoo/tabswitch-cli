jest.mock('../session/manager');
jest.mock('../browser/launcher');
jest.mock('../browser/detector');

const { getSession } = require('../session/manager');
const { launchBrowser } = require('../browser/launcher');
const { getDefaultBrowser, detectInstalledBrowsers } = require('../browser/detector');

describe('open command logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('launchBrowser is called with correct browser and urls', async () => {
    getSession.mockReturnValue({ name: 'work', urls: ['https://github.com', 'https://notion.so'] });
    getDefaultBrowser.mockReturnValue('chrome');
    launchBrowser.mockResolvedValue({ browser: 'chrome', urls: ['https://github.com'] });

    const session = getSession('work');
    expect(session.urls).toHaveLength(2);

    await launchBrowser('chrome', session.urls);
    expect(launchBrowser).toHaveBeenCalledWith('chrome', ['https://github.com', 'https://notion.so']);
  });

  test('getSession returns null for missing session', () => {
    getSession.mockReturnValue(null);
    expect(getSession('nonexistent')).toBeNull();
  });

  test('detectInstalledBrowsers returns array', () => {
    detectInstalledBrowsers.mockReturnValue(['chrome', 'firefox']);
    expect(detectInstalledBrowsers()).toContain('chrome');
  });

  test('launchBrowser rejects on bad browser', async () => {
    launchBrowser.mockRejectedValue(new Error('not installed'));
    await expect(launchBrowser('netscape', ['https://x.com'])).rejects.toThrow('not installed');
  });
});

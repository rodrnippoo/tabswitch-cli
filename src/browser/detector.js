const { execSync } = require('child_process');
const os = require('os');

const BROWSERS = {
  chrome: {
    name: 'Google Chrome',
    mac: 'Google Chrome',
    linux: 'google-chrome',
    win: 'chrome',
  },
  firefox: {
    name: 'Firefox',
    mac: 'Firefox',
    linux: 'firefox',
    win: 'firefox',
  },
  brave: {
    name: 'Brave Browser',
    mac: 'Brave Browser',
    linux: 'brave-browser',
    win: 'brave',
  },
  edge: {
    name: 'Microsoft Edge',
    mac: 'Microsoft Edge',
    linux: 'microsoft-edge',
    win: 'msedge',
  },
};

function getPlatformKey() {
  const p = os.platform();
  if (p === 'darwin') return 'mac';
  if (p === 'win32') return 'win';
  return 'linux';
}

function isBrowserInstalled(browser) {
  const key = getPlatformKey();
  const bin = BROWSERS[browser]?.[key];
  if (!bin) return false;
  try {
    const cmd = key === 'win' ? `where ${bin}` : `which ${bin}`;
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function detectInstalledBrowsers() {
  return Object.keys(BROWSERS).filter(isBrowserInstalled);
}

function getDefaultBrowser() {
  const installed = detectInstalledBrowsers();
  return installed[0] || null;
}

module.exports = { BROWSERS, detectInstalledBrowsers, isBrowserInstalled, getDefaultBrowser };

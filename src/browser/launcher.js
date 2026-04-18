const { exec } = require('child_process');
const os = require('os');
const { BROWSERS, isBrowserInstalled } = require('./detector');

function getPlatformKey() {
  const p = os.platform();
  if (p === 'darwin') return 'mac';
  if (p === 'win32') return 'win';
  return 'linux';
}

function buildOpenCommand(browser, urls) {
  const key = getPlatformKey();
  const bin = BROWSERS[browser]?.[key];
  if (!bin) throw new Error(`Unknown browser: ${browser}`);
  const urlArgs = urls.map(u => `"${u}"`).join(' ');
  if (key === 'mac') {
    return `open -a "${bin}" ${urlArgs}`;
  }
  if (key === 'win') {
    return `start ${bin} ${urlArgs}`;
  }
  return `${bin} ${urlArgs}`;
}

function launchBrowser(browser, urls) {
  return new Promise((resolve, reject) => {
    if (!isBrowserInstalled(browser)) {
      return reject(new Error(`Browser "${browser}" is not installed or not found in PATH`));
    }
    if (!urls || urls.length === 0) {
      return reject(new Error('No URLs provided'));
    }
    const cmd = buildOpenCommand(browser, urls);
    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve({ browser, urls });
    });
  });
}

module.exports = { launchBrowser, buildOpenCommand };

/**
 * Clipboard module — copy session URLs to system clipboard
 */

const { execSync } = require('child_process');

function getPlatformCopyCommand() {
  switch (process.platform) {
    case 'darwin': return 'pbcopy';
    case 'win32': return 'clip';
    default: return 'xclip -selection clipboard || xsel --clipboard --input';
  }
}

function copyToClipboard(text) {
  const cmd = getPlatformCopyCommand();
  try {
    execSync(cmd, { input: text, stdio: ['pipe', 'ignore', 'ignore'] });
    return true;
  } catch (err) {
    throw new Error(`Failed to copy to clipboard: ${err.message}`);
  }
}

function formatSessionUrls(session, options = {}) {
  const { separator = '\n', includeTitle = false } = options;
  if (!session || !Array.isArray(session.urls)) {
    throw new Error('Invalid session: missing urls array');
  }
  if (includeTitle) {
    const lines = [`# ${session.name}`, ...session.urls];
    return lines.join(separator);
  }
  return session.urls.join(separator);
}

function copySession(session, options = {}) {
  const text = formatSessionUrls(session, options);
  copyToClipboard(text);
  return text;
}

function copySingleUrl(session, index) {
  if (!session || !Array.isArray(session.urls)) {
    throw new Error('Invalid session: missing urls array');
  }
  if (index < 0 || index >= session.urls.length) {
    throw new Error(`URL index ${index} out of range (0-${session.urls.length - 1})`);
  }
  const url = session.urls[index];
  copyToClipboard(url);
  return url;
}

module.exports = { getPlatformCopyCommand, copyToClipboard, formatSessionUrls, copySession, copySingleUrl };

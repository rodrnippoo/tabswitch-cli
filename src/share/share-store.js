const fs = require('fs');
const path = require('path');
const os = require('os');

const SHARE_DIR = path.join(os.homedir(), '.tabswitch', 'shares');
const SHARE_FILE = path.join(SHARE_DIR, 'shares.json');

function ensureDir() {
  if (!fs.existsSync(SHARE_DIR)) {
    fs.mkdirSync(SHARE_DIR, { recursive: true });
  }
}

function loadShares() {
  ensureDir();
  if (!fs.existsSync(SHARE_FILE)) return {};
  return JSON.parse(fs.readFileSync(SHARE_FILE, 'utf8'));
}

function saveShares(shares) {
  ensureDir();
  fs.writeFileSync(SHARE_FILE, JSON.stringify(shares, null, 2));
}

function addShare(shareToken) {
  const shares = loadShares();
  shares[shareToken.token] = shareToken;
  saveShares(shares);
  return shareToken;
}

function removeShare(token) {
  const shares = loadShares();
  if (!shares[token]) throw new Error(`Share token not found: ${token}`);
  delete shares[token];
  saveShares(shares);
}

function getShare(token) {
  const shares = loadShares();
  return shares[token] || null;
}

function listShares() {
  return Object.values(loadShares());
}

module.exports = {
  ensureDir,
  loadShares,
  saveShares,
  addShare,
  removeShare,
  getShare,
  listShares,
};

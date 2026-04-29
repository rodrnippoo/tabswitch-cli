// Generates shareable representations of sessions

const { v4: uuidv4 } = require('uuid');

function createShareToken(session) {
  return {
    token: uuidv4(),
    sessionName: session.name,
    urls: session.urls,
    createdAt: new Date().toISOString(),
    expiresAt: null,
  };
}

function setExpiry(shareToken, hours) {
  if (typeof hours !== 'number' || hours <= 0) {
    throw new Error('hours must be a positive number');
  }
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return { ...shareToken, expiresAt: expiry.toISOString() };
}

function isExpired(shareToken) {
  if (!shareToken.expiresAt) return false;
  return new Date() > new Date(shareToken.expiresAt);
}

function encodeShareLink(shareToken, baseUrl = 'https://tabswitch.app/share') {
  const payload = Buffer.from(JSON.stringify(shareToken)).toString('base64url');
  return `${baseUrl}?data=${payload}`;
}

function decodeShareLink(link) {
  const url = new URL(link);
  const payload = url.searchParams.get('data');
  if (!payload) throw new Error('Invalid share link: missing data param');
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Invalid share link: could not decode payload');
  }
}

function formatShareText(shareToken) {
  const lines = [
    `Session: ${shareToken.sessionName}`,
    `Tabs (${shareToken.urls.length}):`,
    ...shareToken.urls.map((u, i) => `  ${i + 1}. ${u}`),
  ];
  if (shareToken.expiresAt) {
    lines.push(`Expires: ${shareToken.expiresAt}`);
  }
  return lines.join('\n');
}

module.exports = {
  createShareToken,
  setExpiry,
  isExpired,
  encodeShareLink,
  decodeShareLink,
  formatShareText,
};

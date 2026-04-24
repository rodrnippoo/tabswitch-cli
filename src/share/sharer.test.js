const {
  createShareToken,
  setExpiry,
  isExpired,
  encodeShareLink,
  decodeShareLink,
  formatShareText,
} = require('./sharer');

const mockSession = {
  name: 'work',
  urls: ['https://github.com', 'https://notion.so'],
};

describe('createShareToken', () => {
  it('creates a token with session info', () => {
    const token = createShareToken(mockSession);
    expect(token.sessionName).toBe('work');
    expect(token.urls).toEqual(mockSession.urls);
    expect(token.token).toBeDefined();
    expect(token.expiresAt).toBeNull();
  });
});

describe('setExpiry', () => {
  it('sets expiresAt to a future date', () => {
    const token = createShareToken(mockSession);
    const withExpiry = setExpiry(token, 2);
    expect(withExpiry.expiresAt).not.toBeNull();
    expect(new Date(withExpiry.expiresAt) > new Date()).toBe(true);
  });
});

describe('isExpired', () => {
  it('returns false for tokens without expiry', () => {
    const token = createShareToken(mockSession);
    expect(isExpired(token)).toBe(false);
  });

  it('returns true for tokens with past expiry', () => {
    const token = createShareToken(mockSession);
    const expired = { ...token, expiresAt: new Date(Date.now() - 1000).toISOString() };
    expect(isExpired(expired)).toBe(true);
  });

  it('returns false for tokens with future expiry', () => {
    const token = setExpiry(createShareToken(mockSession), 1);
    expect(isExpired(token)).toBe(false);
  });
});

describe('encodeShareLink / decodeShareLink', () => {
  it('roundtrips a share token through encode/decode', () => {
    const token = createShareToken(mockSession);
    const link = encodeShareLink(token);
    const decoded = decodeShareLink(link);
    expect(decoded.sessionName).toBe(token.sessionName);
    expect(decoded.urls).toEqual(token.urls);
  });

  it('throws on invalid link', () => {
    expect(() => decodeShareLink('https://tabswitch.app/share?foo=bar')).toThrow();
  });
});

describe('formatShareText', () => {
  it('formats token into readable text', () => {
    const token = createShareToken(mockSession);
    const text = formatShareText(token);
    expect(text).toContain('work');
    expect(text).toContain('https://github.com');
  });
});

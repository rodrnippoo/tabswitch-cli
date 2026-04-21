const { getPlatformCopyCommand, formatSessionUrls, copySession, copySingleUrl } = require('./clipboard');

const mockSession = {
  name: 'work',
  urls: ['https://github.com', 'https://notion.so', 'https://slack.com']
};

describe('getPlatformCopyCommand', () => {
  it('returns pbcopy on darwin', () => {
    const original = process.platform;
    Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
    expect(getPlatformCopyCommand()).toBe('pbcopy');
    Object.defineProperty(process, 'platform', { value: original, configurable: true });
  });

  it('returns clip on win32', () => {
    Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
    expect(getPlatformCopyCommand()).toBe('clip');
    Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
  });
});

describe('formatSessionUrls', () => {
  it('joins urls with newline by default', () => {
    const result = formatSessionUrls(mockSession);
    expect(result).toBe('https://github.com\nhttps://notion.so\nhttps://slack.com');
  });

  it('uses custom separator', () => {
    const result = formatSessionUrls(mockSession, { separator: ', ' });
    expect(result).toBe('https://github.com, https://notion.so, https://slack.com');
  });

  it('includes title when includeTitle is true', () => {
    const result = formatSessionUrls(mockSession, { includeTitle: true });
    expect(result.startsWith('# work')).toBe(true);
    expect(result).toContain('https://github.com');
  });

  it('throws on invalid session', () => {
    expect(() => formatSessionUrls(null)).toThrow('Invalid session');
    expect(() => formatSessionUrls({ name: 'x' })).toThrow('Invalid session');
  });
});

describe('copySingleUrl', () => {
  it('throws on invalid session', () => {
    expect(() => copySingleUrl(null, 0)).toThrow('Invalid session');
  });

  it('throws when index is out of range', () => {
    expect(() => copySingleUrl(mockSession, 5)).toThrow('out of range');
    expect(() => copySingleUrl(mockSession, -1)).toThrow('out of range');
  });
});

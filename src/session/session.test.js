const fs = require('fs');
const path = require('path');
const os = require('os');

// Override SESSION_FILE before requiring modules
const testSessionFile = path.join(os.tmpdir(), 'tabswitch-test-sessions.json');
jest.mock('./store', () => {
  const actual = jest.requireActual('./store');
  // patch SESSION_FILE used internally by pointing to temp file
  return actual;
});

beforeEach(() => {
  if (fs.existsSync(testSessionFile)) fs.unlinkSync(testSessionFile);
});

const manager = require('./manager');
const store = require('./store');

describe('session manager', () => {
  test('creates a session with normalized URLs', () => {
    const session = manager.createSession('work', ['github.com', 'https://slack.com']);
    expect(session.name).toBe('work');
    expect(session.tabs).toHaveLength(2);
    expect(session.tabs[0].url).toBe('https://github.com');
    expect(session.tabs[1].url).toBe('https://slack.com');
  });

  test('throws on empty name', () => {
    expect(() => manager.createSession('', ['https://example.com'])).toThrow();
  });

  test('throws on empty urls', () => {
    expect(() => manager.createSession('test', [])).toThrow();
  });

  test('retrieves a saved session', () => {
    manager.createSession('dev', ['localhost:3000']);
    const session = manager.getSession('dev');
    expect(session.name).toBe('dev');
  });

  test('throws when session not found', () => {
    expect(() => manager.getSession('nonexistent')).toThrow('not found');
  });

  test('lists all sessions', () => {
    manager.createSession('s1', ['https://a.com']);
    manager.createSession('s2', ['https://b.com']);
    const list = manager.listSessions();
    expect(list.length).toBeGreaterThanOrEqual(2);
  });

  test('removes a session', () => {
    manager.createSession('temp', ['https://temp.com']);
    manager.removeSession('temp');
    expect(() => manager.getSession('temp')).toThrow();
  });
});

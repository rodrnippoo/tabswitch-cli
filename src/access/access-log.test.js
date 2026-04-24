const {
  recordAccess,
  getAccessEntry,
  resetAccess,
  getMostAccessed,
  getRecentlyAccessed,
} = require('./access-log');

describe('access-log', () => {
  describe('recordAccess', () => {
    it('creates a new entry on first access', () => {
      const log = recordAccess({}, 'session-1');
      expect(log['session-1'].openCount).toBe(1);
      expect(log['session-1'].firstAccessed).toBeTruthy();
      expect(log['session-1'].lastAccessed).toBeTruthy();
    });

    it('increments openCount on subsequent access', () => {
      let log = recordAccess({}, 'session-1');
      log = recordAccess(log, 'session-1');
      expect(log['session-1'].openCount).toBe(2);
    });

    it('preserves firstAccessed on subsequent access', () => {
      let log = recordAccess({}, 'session-1');
      const first = log['session-1'].firstAccessed;
      log = recordAccess(log, 'session-1');
      expect(log['session-1'].firstAccessed).toBe(first);
    });
  });

  describe('getAccessEntry', () => {
    it('returns default entry for unknown session', () => {
      const entry = getAccessEntry({}, 'unknown');
      expect(entry.openCount).toBe(0);
      expect(entry.lastAccessed).toBeNull();
    });

    it('returns existing entry', () => {
      const log = recordAccess({}, 'session-a');
      const entry = getAccessEntry(log, 'session-a');
      expect(entry.openCount).toBe(1);
    });
  });

  describe('resetAccess', () => {
    it('removes entry from log', () => {
      let log = recordAccess({}, 'session-x');
      log = resetAccess(log, 'session-x');
      expect(log['session-x']).toBeUndefined();
    });
  });

  describe('getMostAccessed', () => {
    it('returns sessions sorted by open count', () => {
      let log = {};
      log = recordAccess(log, 'a');
      log = recordAccess(log, 'a');
      log = recordAccess(log, 'b');
      const top = getMostAccessed(log, 2);
      expect(top[0].sessionId).toBe('a');
      expect(top[1].sessionId).toBe('b');
    });
  });

  describe('getRecentlyAccessed', () => {
    it('returns sessions sorted by lastAccessed descending', () => {
      let log = {};
      log = recordAccess(log, 'old');
      log = recordAccess(log, 'new');
      const recent = getRecentlyAccessed(log, 2);
      expect(recent[0].sessionId).toBe('new');
    });
  });
});

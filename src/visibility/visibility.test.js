const {
  hideSession,
  showSession,
  isHidden,
  filterVisible,
  filterHidden,
  toggleVisibility,
} = require('./visibility');

const baseSession = { name: 'work', urls: ['https://github.com'] };

describe('hideSession', () => {
  it('sets hidden to true', () => {
    const result = hideSession(baseSession);
    expect(result.hidden).toBe(true);
  });

  it('adds hiddenAt timestamp', () => {
    const result = hideSession(baseSession);
    expect(typeof result.hiddenAt).toBe('string');
  });

  it('does not mutate original session', () => {
    hideSession(baseSession);
    expect(baseSession.hidden).toBeUndefined();
  });
});

describe('showSession', () => {
  it('removes hidden flag', () => {
    const hidden = hideSession(baseSession);
    const visible = showSession(hidden);
    expect(visible.hidden).toBeUndefined();
  });

  it('removes hiddenAt field', () => {
    const hidden = hideSession(baseSession);
    const visible = showSession(hidden);
    expect(visible.hiddenAt).toBeUndefined();
  });

  it('preserves other fields', () => {
    const hidden = hideSession(baseSession);
    const visible = showSession(hidden);
    expect(visible.name).toBe('work');
    expect(visible.urls).toEqual(['https://github.com']);
  });
});

describe('isHidden', () => {
  it('returns true for hidden session', () => {
    expect(isHidden(hideSession(baseSession))).toBe(true);
  });

  it('returns false for visible session', () => {
    expect(isHidden(baseSession)).toBe(false);
  });
});

describe('filterVisible', () => {
  it('excludes hidden sessions', () => {
    const sessions = [baseSession, hideSession({ name: 'secret', urls: [] })];
    expect(filterVisible(sessions)).toHaveLength(1);
    expect(filterVisible(sessions)[0].name).toBe('work');
  });
});

describe('filterHidden', () => {
  it('returns only hidden sessions', () => {
    const sessions = [baseSession, hideSession({ name: 'secret', urls: [] })];
    const result = filterHidden(sessions);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('secret');
  });
});

describe('toggleVisibility', () => {
  it('hides a visible session', () => {
    expect(isHidden(toggleVisibility(baseSession))).toBe(true);
  });

  it('shows a hidden session', () => {
    const hidden = hideSession(baseSession);
    expect(isHidden(toggleVisibility(hidden))).toBe(false);
  });
});

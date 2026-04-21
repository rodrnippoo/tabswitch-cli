const {
  PALETTE,
  assignColor,
  setColor,
  removeColor,
  getColor,
  listColors
} = require('./colorizer');

describe('assignColor', () => {
  test('assigns a color from the palette to a new name', () => {
    const color = assignColor('work');
    expect(PALETTE).toContain(color);
  });

  test('returns existing color if already assigned', () => {
    const map = { work: 'blue' };
    expect(assignColor('work', map)).toBe('blue');
  });

  test('avoids already-used colors when possible', () => {
    const usedColors = PALETTE.slice(0, PALETTE.length - 1);
    const map = {};
    usedColors.forEach((c, i) => { map[`session${i}`] = c; });
    const color = assignColor('newSession', map);
    expect(PALETTE).toContain(color);
  });

  test('falls back to palette when all colors are used', () => {
    const map = {};
    PALETTE.forEach((c, i) => { map[`s${i}`] = c; });
    const color = assignColor('overflow', map);
    expect(PALETTE).toContain(color);
  });
});

describe('setColor', () => {
  test('sets a valid color for a name', () => {
    const map = setColor('work', 'green');
    expect(map.work).toBe('green');
  });

  test('throws on invalid color', () => {
    expect(() => setColor('work', 'pink')).toThrow(/Invalid color/);
  });

  test('does not mutate original map', () => {
    const original = { work: 'blue' };
    const updated = setColor('personal', 'red', original);
    expect(original.personal).toBeUndefined();
    expect(updated.personal).toBe('red');
  });
});

describe('removeColor', () => {
  test('removes an existing color entry', () => {
    const map = { work: 'blue', personal: 'red' };
    const updated = removeColor('work', map);
    expect(updated.work).toBeUndefined();
    expect(updated.personal).toBe('red');
  });
});

describe('getColor', () => {
  test('returns color if present', () => {
    expect(getColor('work', { work: 'cyan' })).toBe('cyan');
  });

  test('returns null if not present', () => {
    expect(getColor('missing', {})).toBeNull();
  });
});

describe('listColors', () => {
  test('returns array of name/color pairs', () => {
    const map = { work: 'blue', personal: 'green' };
    const list = listColors(map);
    expect(list).toHaveLength(2);
    expect(list).toContainEqual({ name: 'work', color: 'blue' });
  });

  test('returns empty array for empty map', () => {
    expect(listColors({})).toEqual([]);
  });
});

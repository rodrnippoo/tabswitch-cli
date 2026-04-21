const { sortByName, sortByDate, sortBySize, sortByLastAccessed, sortSessions } = require('./sorter');

const makeSessions = () => [
  { name: 'Charlie', urls: ['a', 'b', 'c'], createdAt: '2024-01-03T00:00:00Z', lastAccessed: '2024-03-01T00:00:00Z' },
  { name: 'Alice',   urls: ['a'],           createdAt: '2024-01-01T00:00:00Z', lastAccessed: '2024-01-15T00:00:00Z' },
  { name: 'Bob',     urls: ['a', 'b'],      createdAt: '2024-01-02T00:00:00Z', lastAccessed: '2024-02-10T00:00:00Z' },
];

describe('sortByName', () => {
  it('sorts ascending by default', () => {
    const result = sortByName(makeSessions());
    expect(result.map(s => s.name)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('sorts descending when specified', () => {
    const result = sortByName(makeSessions(), 'desc');
    expect(result.map(s => s.name)).toEqual(['Charlie', 'Bob', 'Alice']);
  });
});

describe('sortByDate', () => {
  it('sorts newest first by default', () => {
    const result = sortByDate(makeSessions());
    expect(result[0].name).toBe('Charlie');
    expect(result[2].name).toBe('Alice');
  });

  it('sorts oldest first when asc', () => {
    const result = sortByDate(makeSessions(), 'asc');
    expect(result[0].name).toBe('Alice');
  });
});

describe('sortBySize', () => {
  it('sorts largest first by default', () => {
    const result = sortBySize(makeSessions());
    expect(result[0].name).toBe('Charlie');
    expect(result[2].name).toBe('Alice');
  });

  it('sorts smallest first when asc', () => {
    const result = sortBySize(makeSessions(), 'asc');
    expect(result[0].name).toBe('Alice');
  });
});

describe('sortByLastAccessed', () => {
  it('sorts most recently accessed first by default', () => {
    const result = sortByLastAccessed(makeSessions());
    expect(result[0].name).toBe('Charlie');
  });
});

describe('sortSessions', () => {
  it('delegates to the correct sort function', () => {
    const result = sortSessions(makeSessions(), 'name', 'asc');
    expect(result[0].name).toBe('Alice');
  });

  it('throws for unknown field', () => {
    expect(() => sortSessions(makeSessions(), 'unknown')).toThrow(/Unknown sort field/);
  });

  it('defaults to date desc', () => {
    const result = sortSessions(makeSessions());
    expect(result[0].name).toBe('Charlie');
  });
});

const { archiveSession, unarchiveSession, isArchived, filterArchived, filterActive } = require('./archiver');

jest.mock('../session/manager', () => ({
  getSession: jest.fn(),
}));

const { getSession } = require('../session/manager');

const mockSession = { name: 'work', urls: ['https://github.com'], tags: [] };

describe('archiver', () => {
  beforeEach(() => jest.clearAllMocks());

  test('archiveSession returns session with archived flag', () => {
    getSession.mockReturnValue(mockSession);
    const result = archiveSession('work', '2024-01-01T00:00:00.000Z');
    expect(result.archived).toBe(true);
    expect(result.archivedAt).toBe('2024-01-01T00:00:00.000Z');
    expect(result.name).toBe('work');
  });

  test('archiveSession throws if session not found', () => {
    getSession.mockReturnValue(null);
    expect(() => archiveSession('nope')).toThrow('Session "nope" not found');
  });

  test('unarchiveSession removes archived fields', () => {
    const archived = { ...mockSession, archived: true, archivedAt: '2024-01-01T00:00:00.000Z' };
    const result = unarchiveSession(archived);
    expect(result.archived).toBeUndefined();
    expect(result.archivedAt).toBeUndefined();
    expect(result.name).toBe('work');
  });

  test('unarchiveSession throws if not archived', () => {
    expect(() => unarchiveSession(mockSession)).toThrow('Session is not archived');
  });

  test('isArchived returns true for archived sessions', () => {
    expect(isArchived({ ...mockSession, archived: true })).toBe(true);
    expect(isArchived(mockSession)).toBe(false);
  });

  test('filterArchived returns only archived sessions', () => {
    const sessions = [mockSession, { ...mockSession, name: 'old', archived: true }];
    expect(filterArchived(sessions)).toHaveLength(1);
  });

  test('filterActive returns only non-archived sessions', () => {
    const sessions = [mockSession, { ...mockSession, name: 'old', archived: true }];
    expect(filterActive(sessions)).toHaveLength(1);
    expect(filterActive(sessions)[0].name).toBe('work');
  });
});

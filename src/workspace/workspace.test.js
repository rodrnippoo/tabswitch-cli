const { createWorkspace, addSessionToWorkspace, removeSessionFromWorkspace, renameWorkspace } = require('./workspace');

describe('createWorkspace', () => {
  it('creates workspace with name and empty sessions by default', () => {
    const ws = createWorkspace('work');
    expect(ws.name).toBe('work');
    expect(ws.sessionNames).toEqual([]);
    expect(ws.createdAt).toBeDefined();
  });

  it('creates workspace with provided session names', () => {
    const ws = createWorkspace('dev', ['session1', 'session2']);
    expect(ws.sessionNames).toEqual(['session1', 'session2']);
  });
});

describe('addSessionToWorkspace', () => {
  it('adds a session', () => {
    const ws = createWorkspace('w');
    const updated = addSessionToWorkspace(ws, 'news');
    expect(updated.sessionNames).toContain('news');
  });

  it('does not duplicate sessions', () => {
    const ws = createWorkspace('w', ['news']);
    const updated = addSessionToWorkspace(ws, 'news');
    expect(updated.sessionNames.filter(s => s === 'news').length).toBe(1);
  });
});

describe('removeSessionFromWorkspace', () => {
  it('removes a session', () => {
    const ws = createWorkspace('w', ['a', 'b']);
    const updated = removeSessionFromWorkspace(ws, 'a');
    expect(updated.sessionNames).not.toContain('a');
    expect(updated.sessionNames).toContain('b');
  });
});

describe('renameWorkspace', () => {
  it('renames the workspace', () => {
    const ws = createWorkspace('old');
    const updated = renameWorkspace(ws, 'new');
    expect(updated.name).toBe('new');
    expect(updated.sessionNames).toEqual(ws.sessionNames);
  });
});

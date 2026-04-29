// dependency.test.js

const {
  createDependency,
  addDependency,
  removeDependency,
  getDependencies,
  getDependents,
  hasCycle
} = require('./dependency');

describe('createDependency', () => {
  it('creates a valid dependency object', () => {
    const dep = createDependency('a', 'b', 'needs b to be open');
    expect(dep.sourceId).toBe('a');
    expect(dep.targetId).toBe('b');
    expect(dep.reason).toBe('needs b to be open');
    expect(dep.createdAt).toBeDefined();
  });

  it('throws if sourceId equals targetId', () => {
    expect(() => createDependency('a', 'a')).toThrow();
  });

  it('throws if sourceId is missing', () => {
    expect(() => createDependency('', 'b')).toThrow();
  });
});

describe('addDependency', () => {
  it('adds a new dependency', () => {
    const result = addDependency([], 'a', 'b');
    expect(result).toHaveLength(1);
    expect(result[0].sourceId).toBe('a');
  });

  it('throws on duplicate dependency', () => {
    const deps = addDependency([], 'a', 'b');
    expect(() => addDependency(deps, 'a', 'b')).toThrow();
  });
});

describe('removeDependency', () => {
  it('removes an existing dependency', () => {
    const deps = addDependency([], 'a', 'b');
    const result = removeDependency(deps, 'a', 'b');
    expect(result).toHaveLength(0);
  });

  it('throws if dependency does not exist', () => {
    expect(() => removeDependency([], 'a', 'b')).toThrow();
  });
});

describe('getDependencies / getDependents', () => {
  const deps = [...addDependency([], 'a', 'b'), ...addDependency([], 'a', 'c')];

  it('returns sessions that a depends on', () => {
    expect(getDependencies(deps, 'a')).toHaveLength(2);
  });

  it('returns sessions that depend on b', () => {
    expect(getDependents(deps, 'b')).toHaveLength(1);
  });
});

describe('hasCycle', () => {
  it('detects a direct cycle', () => {
    const deps = addDependency([], 'a', 'b');
    expect(hasCycle(deps, 'b', 'a')).toBe(true);
  });

  it('detects a transitive cycle', () => {
    let deps = addDependency([], 'a', 'b');
    deps = [...deps, ...addDependency(deps, 'b', 'c')];
    expect(hasCycle(deps, 'c', 'a')).toBe(true);
  });

  it('returns false when no cycle', () => {
    const deps = addDependency([], 'a', 'b');
    expect(hasCycle(deps, 'b', 'c')).toBe(false);
  });
});

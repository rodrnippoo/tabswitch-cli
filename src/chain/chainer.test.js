const {
  createChain,
  addToChain,
  removeFromChain,
  reorderChain,
  renameChain,
  getChainStep,
} = require('./chainer');

describe('createChain', () => {
  it('creates a chain with a name and empty sessionIds by default', () => {
    const chain = createChain('morning');
    expect(chain.name).toBe('morning');
    expect(chain.sessionIds).toEqual([]);
    expect(chain.createdAt).toBeDefined();
  });

  it('accepts an initial list of session ids', () => {
    const chain = createChain('work', ['s1', 's2']);
    expect(chain.sessionIds).toEqual(['s1', 's2']);
  });
});

describe('addToChain', () => {
  it('appends a session id to the chain', () => {
    const chain = createChain('test', ['s1']);
    const updated = addToChain(chain, 's2');
    expect(updated.sessionIds).toEqual(['s1', 's2']);
  });

  it('throws if the session is already in the chain', () => {
    const chain = createChain('test', ['s1']);
    expect(() => addToChain(chain, 's1')).toThrow();
  });
});

describe('removeFromChain', () => {
  it('removes a session id from the chain', () => {
    const chain = createChain('test', ['s1', 's2']);
    const updated = removeFromChain(chain, 's1');
    expect(updated.sessionIds).toEqual(['s2']);
  });

  it('throws if session is not in the chain', () => {
    const chain = createChain('test', ['s1']);
    expect(() => removeFromChain(chain, 'nope')).toThrow();
  });
});

describe('reorderChain', () => {
  it('moves a session from one position to another', () => {
    const chain = createChain('test', ['a', 'b', 'c']);
    const updated = reorderChain(chain, 0, 2);
    expect(updated.sessionIds).toEqual(['b', 'c', 'a']);
  });

  it('throws on out-of-bounds index', () => {
    const chain = createChain('test', ['a', 'b']);
    expect(() => reorderChain(chain, 0, 5)).toThrow();
  });
});

describe('renameChain', () => {
  it('renames the chain', () => {
    const chain = createChain('old');
    expect(renameChain(chain, 'new').name).toBe('new');
  });

  it('throws on empty name', () => {
    const chain = createChain('old');
    expect(() => renameChain(chain, '  ')).toThrow();
  });
});

describe('getChainStep', () => {
  it('returns the session id at the given index', () => {
    const chain = createChain('test', ['a', 'b', 'c']);
    expect(getChainStep(chain, 1)).toBe('b');
  });

  it('returns null for out-of-bounds index', () => {
    const chain = createChain('test', ['a']);
    expect(getChainStep(chain, 5)).toBeNull();
  });
});

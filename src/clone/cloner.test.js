'use strict';

const { cloneSession, buildCloneName, isClone } = require('./cloner');

describe('cloneSession', () => {
  const base = {
    id: 'abc-123',
    name: 'Work',
    urls: ['https://github.com', 'https://jira.example.com'],
    tags: ['work', 'dev'],
    notes: ['important'],
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  it('returns a new object with a different id', () => {
    const clone = cloneSession(base, 'Work Clone');
    expect(clone.id).not.toBe(base.id);
  });

  it('sets the correct name on the clone', () => {
    const clone = cloneSession(base, 'Work Clone');
    expect(clone.name).toBe('Work Clone');
  });

  it('copies urls, tags, and notes by default', () => {
    const clone = cloneSession(base, 'Work Clone');
    expect(clone.urls).toEqual(base.urls);
    expect(clone.tags).toEqual(base.tags);
    expect(clone.notes).toEqual(base.notes);
  });

  it('strips tags when stripTags option is set', () => {
    const clone = cloneSession(base, 'Work Clone', { stripTags: true });
    expect(clone.tags).toEqual([]);
  });

  it('strips notes when stripNotes option is set', () => {
    const clone = cloneSession(base, 'Work Clone', { stripNotes: true });
    expect(clone.notes).toEqual([]);
  });

  it('sets clonedFrom to the source id', () => {
    const clone = cloneSession(base, 'Work Clone');
    expect(clone.clonedFrom).toBe('abc-123');
  });

  it('sets a new createdAt timestamp', () => {
    const clone = cloneSession(base, 'Work Clone');
    expect(clone.createdAt).not.toBe(base.createdAt);
  });

  it('throws if session is not an object', () => {
    expect(() => cloneSession(null, 'X')).toThrow();
  });

  it('throws if newName is empty', () => {
    expect(() => cloneSession(base, '  ')).toThrow();
  });
});

describe('buildCloneName', () => {
  it('returns "Name (copy)" when no conflict', () => {
    expect(buildCloneName('Work', [])).toBe('Work (copy)');
  });

  it('returns "Name (copy 2)" when "Name (copy)" already exists', () => {
    expect(buildCloneName('Work', ['Work (copy)'])).toBe('Work (copy 2)');
  });

  it('increments until a free name is found', () => {
    const existing = ['Work (copy)', 'Work (copy 2)', 'Work (copy 3)'];
    expect(buildCloneName('Work', existing)).toBe('Work (copy 4)');
  });
});

describe('isClone', () => {
  it('returns true when clonedFrom is present', () => {
    expect(isClone({ clonedFrom: 'abc' })).toBe(true);
  });

  it('returns false when clonedFrom is absent', () => {
    expect(isClone({ name: 'Work' })).toBe(false);
  });

  it('returns false for null input', () => {
    expect(isClone(null)).toBe(false);
  });
});

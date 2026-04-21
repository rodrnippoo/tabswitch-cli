'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('fs');

const SCHEDULE_FILE = path.join(os.homedir(), '.tabswitch', 'schedules.json');

const { loadSchedules, saveSchedules, addSchedule, removeSchedule, updateSchedule } = require('./schedule-store');

beforeEach(() => {
  jest.resetAllMocks();
  fs.existsSync.mockReturnValue(true);
});

describe('loadSchedules', () => {
  it('returns empty array if file does not exist', () => {
    fs.existsSync.mockReturnValue(false);
    expect(loadSchedules()).toEqual([]);
  });

  it('parses and returns schedules from file', () => {
    const data = [{ id: '1', sessionName: 'work' }];
    fs.readFileSync.mockReturnValue(JSON.stringify(data));
    expect(loadSchedules()).toEqual(data);
  });

  it('returns empty array on parse error', () => {
    fs.readFileSync.mockReturnValue('invalid json');
    expect(loadSchedules()).toEqual([]);
  });
});

describe('saveSchedules', () => {
  it('writes schedules as JSON', () => {
    const data = [{ id: '1', sessionName: 'test' }];
    saveSchedules(data);
    expect(fs.writeFileSync).toHaveBeenCalledWith(SCHEDULE_FILE, JSON.stringify(data, null, 2));
  });
});

describe('addSchedule', () => {
  it('appends a schedule to the list', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    addSchedule({ id: 'abc', sessionName: 'news' });
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written).toHaveLength(1);
    expect(written[0].id).toBe('abc');
  });
});

describe('removeSchedule', () => {
  it('removes a schedule by id', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([{ id: 'abc' }, { id: 'xyz' }]));
    const removed = removeSchedule('abc');
    expect(removed).toBe(true);
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written).toHaveLength(1);
    expect(written[0].id).toBe('xyz');
  });

  it('returns false if id not found', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([{ id: 'xyz' }]));
    const removed = removeSchedule('nope');
    expect(removed).toBe(false);
  });
});

describe('updateSchedule', () => {
  it('updates matching schedule fields', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([{ id: 'abc', fired: false }]));
    const result = updateSchedule('abc', { fired: true });
    expect(result).toBe(true);
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written[0].fired).toBe(true);
  });

  it('returns false if id not found', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));
    expect(updateSchedule('missing', { fired: true })).toBe(false);
  });
});

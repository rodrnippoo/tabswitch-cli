const { createReplayPlan, getReplayStep, summarizeReplay, executeReplay } = require('./replayer');

const mockSession = {
  name: 'work',
  urls: ['https://github.com', 'https://notion.so', 'https://linear.app'],
};

describe('createReplayPlan', () => {
  it('creates a plan with defaults', () => {
    const plan = createReplayPlan(mockSession);
    expect(plan.sessionName).toBe('work');
    expect(plan.urls).toHaveLength(3);
    expect(plan.delay).toBe(800);
    expect(plan.startIndex).toBe(0);
  });

  it('respects custom delay and startIndex', () => {
    const plan = createReplayPlan(mockSession, { delay: 200, startIndex: 1 });
    expect(plan.delay).toBe(200);
    expect(plan.urls).toHaveLength(2);
    expect(plan.urls[0]).toBe('https://notion.so');
  });

  it('clamps startIndex to valid range', () => {
    const plan = createReplayPlan(mockSession, { startIndex: 99 });
    expect(plan.urls).toHaveLength(1);
  });

  it('throws on empty session', () => {
    expect(() => createReplayPlan({ name: 'x', urls: [] })).toThrow();
    expect(() => createReplayPlan(null)).toThrow();
  });
});

describe('getReplayStep', () => {
  const plan = createReplayPlan(mockSession);

  it('returns correct step info', () => {
    const step = getReplayStep(plan, 0);
    expect(step.url).toBe('https://github.com');
    expect(step.isLast).toBe(false);
    expect(step.remaining).toBe(2);
  });

  it('marks last step correctly', () => {
    const step = getReplayStep(plan, 2);
    expect(step.isLast).toBe(true);
    expect(step.remaining).toBe(0);
  });

  it('returns null for out-of-bounds index', () => {
    expect(getReplayStep(plan, -1)).toBeNull();
    expect(getReplayStep(plan, 10)).toBeNull();
  });
});

describe('summarizeReplay', () => {
  it('returns summary with estimated duration', () => {
    const plan = createReplayPlan(mockSession, { delay: 500 });
    const summary = summarizeReplay(plan);
    expect(summary.totalUrls).toBe(3);
    expect(summary.delayMs).toBe(500);
    expect(summary.estimatedDurationMs).toBe(1500);
    expect(summary.session).toBe('work');
  });
});

describe('executeReplay', () => {
  it('calls launcher for each url and collects results', async () => {
    const plan = createReplayPlan(mockSession, { delay: 0 });
    const launched = [];
    const launcher = async (url) => launched.push(url);

    const results = await executeReplay(plan, launcher);
    expect(launched).toEqual(mockSession.urls);
    expect(results.every((r) => r.success)).toBe(true);
  });

  it('records failure on launcher error', async () => {
    const plan = createReplayPlan(mockSession, { delay: 0 });
    const launcher = async () => { throw new Error('launch failed'); };

    const results = await executeReplay(plan, launcher);
    expect(results.every((r) => !r.success)).toBe(true);
    expect(results[0].error).toBe('launch failed');
  });

  it('calls onStep callback for each step', async () => {
    const plan = createReplayPlan(mockSession, { delay: 0 });
    const steps = [];
    await executeReplay(plan, async () => {}, (step) => steps.push(step.index));
    expect(steps).toEqual([0, 1, 2]);
  });
});

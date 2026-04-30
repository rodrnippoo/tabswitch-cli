// replayer.js — replay a session's URL sequence with configurable delay

const DEFAULT_DELAY_MS = 800;

function createReplayPlan(session, options = {}) {
  if (!session || !Array.isArray(session.urls) || session.urls.length === 0) {
    throw new Error('Session must have a non-empty urls array');
  }

  const delay = typeof options.delay === 'number' && options.delay >= 0
    ? options.delay
    : DEFAULT_DELAY_MS;

  const startIndex = typeof options.startIndex === 'number'
    ? Math.max(0, Math.min(options.startIndex, session.urls.length - 1))
    : 0;

  const urls = session.urls.slice(startIndex);

  return {
    sessionName: session.name,
    urls,
    delay,
    totalSteps: urls.length,
    startIndex,
  };
}

function getReplayStep(plan, stepIndex) {
  if (stepIndex < 0 || stepIndex >= plan.urls.length) {
    return null;
  }
  return {
    index: stepIndex,
    url: plan.urls[stepIndex],
    isLast: stepIndex === plan.urls.length - 1,
    remaining: plan.urls.length - stepIndex - 1,
  };
}

function summarizeReplay(plan) {
  return {
    session: plan.sessionName,
    totalUrls: plan.totalSteps,
    delayMs: plan.delay,
    estimatedDurationMs: plan.totalSteps * plan.delay,
    startIndex: plan.startIndex,
  };
}

async function executeReplay(plan, launcher, onStep) {
  const results = [];

  for (let i = 0; i < plan.urls.length; i++) {
    const step = getReplayStep(plan, i);
    if (!step) break;

    try {
      await launcher(step.url);
      results.push({ url: step.url, success: true });
    } catch (err) {
      results.push({ url: step.url, success: false, error: err.message });
    }

    if (typeof onStep === 'function') {
      onStep(step, results[results.length - 1]);
    }

    if (!step.isLast && plan.delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, plan.delay));
    }
  }

  return results;
}

module.exports = { createReplayPlan, getReplayStep, summarizeReplay, executeReplay };

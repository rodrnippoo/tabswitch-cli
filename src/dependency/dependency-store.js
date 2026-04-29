// dependency-store.js — persist and load session dependencies

const fs = require('fs');
const path = require('path');

const DIR = path.join(process.env.HOME || '.', '.tabswitch', 'dependencies');
const FILE = path.join(DIR, 'dependencies.json');

function ensureDir() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
}

function loadDependencies() {
  ensureDir();
  if (!fs.existsSync(FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveDependencies(dependencies) {
  ensureDir();
  fs.writeFileSync(FILE, JSON.stringify(dependencies, null, 2));
}

function addDependencyToStore(dep) {
  const all = loadDependencies();
  all.push(dep);
  saveDependencies(all);
}

function removeDependencyFromStore(sourceId, targetId) {
  const all = loadDependencies().filter(
    d => !(d.sourceId === sourceId && d.targetId === targetId)
  );
  saveDependencies(all);
}

function clearDependenciesForSession(sessionId) {
  const all = loadDependencies().filter(
    d => d.sourceId !== sessionId && d.targetId !== sessionId
  );
  saveDependencies(all);
}

module.exports = { loadDependencies, saveDependencies, addDependencyToStore, removeDependencyFromStore, clearDependenciesForSession };

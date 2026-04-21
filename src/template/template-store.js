const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = path.join(os.homedir(), '.tabswitch');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadTemplates() {
  ensureDir();
  if (!fs.existsSync(TEMPLATES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveTemplates(templates) {
  ensureDir();
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
}

function saveTemplate(template) {
  const templates = loadTemplates();
  templates[template.name] = template;
  saveTemplates(templates);
}

function getTemplate(name) {
  const templates = loadTemplates();
  return templates[name] || null;
}

function deleteTemplate(name) {
  const templates = loadTemplates();
  delete templates[name];
  saveTemplates(templates);
}

function listTemplates() {
  return Object.values(loadTemplates());
}

module.exports = { loadTemplates, saveTemplates, saveTemplate, getTemplate, deleteTemplate, listTemplates };

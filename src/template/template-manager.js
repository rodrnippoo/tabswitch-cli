const { createTemplate, addUrlToTemplate, removeUrlFromTemplate, renameTemplate } = require('./template');
const store = require('./template-store');

function newTemplate(name, urls = [], description = '') {
  const existing = store.getTemplate(name);
  if (existing) throw new Error(`Template "${name}" already exists`);
  const template = createTemplate(name, urls, description);
  store.saveTemplate(template);
  return template;
}

function addUrl(name, url) {
  const template = store.getTemplate(name);
  if (!template) throw new Error(`Template "${name}" not found`);
  const updated = addUrlToTemplate(template, url);
  store.saveTemplate(updated);
  return updated;
}

function removeUrl(name, url) {
  const template = store.getTemplate(name);
  if (!template) throw new Error(`Template "${name}" not found`);
  const updated = removeUrlFromTemplate(template, url);
  store.saveTemplate(updated);
  return updated;
}

function rename(oldName, newName) {
  const template = store.getTemplate(oldName);
  if (!template) throw new Error(`Template "${oldName}" not found`);
  if (store.getTemplate(newName)) throw new Error(`Template "${newName}" already exists`);
  const updated = renameTemplate(template, newName);
  store.deleteTemplate(oldName);
  store.saveTemplate(updated);
  return updated;
}

function remove(name) {
  if (!store.getTemplate(name)) throw new Error(`Template "${name}" not found`);
  store.deleteTemplate(name);
}

function list() {
  return store.listTemplates();
}

function get(name) {
  return store.getTemplate(name);
}

module.exports = { newTemplate, addUrl, removeUrl, rename, remove, list, get };

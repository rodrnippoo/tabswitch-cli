// Template: a named, reusable set of URLs that can be used to create sessions quickly

function createTemplate(name, urls = [], description = '') {
  if (!name || typeof name !== 'string') throw new Error('Template name is required');
  if (!Array.isArray(urls)) throw new Error('urls must be an array');
  return {
    id: `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    description: description.trim(),
    urls: urls.map(u => u.trim()).filter(Boolean),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function addUrlToTemplate(template, url) {
  if (!url || typeof url !== 'string') throw new Error('url is required');
  const trimmed = url.trim();
  if (template.urls.includes(trimmed)) return template;
  return { ...template, urls: [...template.urls, trimmed], updatedAt: new Date().toISOString() };
}

function removeUrlFromTemplate(template, url) {
  return {
    ...template,
    urls: template.urls.filter(u => u !== url.trim()),
    updatedAt: new Date().toISOString(),
  };
}

function renameTemplate(template, newName) {
  if (!newName || typeof newName !== 'string') throw new Error('New name is required');
  return { ...template, name: newName.trim(), updatedAt: new Date().toISOString() };
}

module.exports = { createTemplate, addUrlToTemplate, removeUrlFromTemplate, renameTemplate };

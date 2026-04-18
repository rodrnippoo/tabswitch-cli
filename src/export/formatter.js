// Formats sessions for various export formats

function toJSON(sessions) {
  return JSON.stringify(sessions, null, 2);
}

function toCSV(sessions) {
  const rows = ['name,url,tags,createdAt'];
  for (const session of sessions) {
    const urls = (session.urls || []).join('|');
    const tags = (session.tags || []).join('|');
    rows.push(`${session.name},${urls},${tags},${session.createdAt || ''}`);
  }
  return rows.join('\n');
}

function toMarkdown(sessions) {
  const lines = ['# Tab Sessions', ''];
  for (const session of sessions) {
    lines.push(`## ${session.name}`);
    if (session.tags && session.tags.length) {
      lines.push(`**Tags:** ${session.tags.join(', ')}`);
    }
    lines.push('');
    for (const url of session.urls || []) {
      lines.push(`- ${url}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function formatSessions(sessions, format = 'json') {
  switch (format.toLowerCase()) {
    case 'csv': return toCSV(sessions);
    case 'md':
    case 'markdown': return toMarkdown(sessions);
    case 'json':
    default: return toJSON(sessions);
  }
}

module.exports = { toJSON, toCSV, toMarkdown, formatSessions };

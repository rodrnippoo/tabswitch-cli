/**
 * Lightweight in-memory search index for sessions
 */

class SearchIndex {
  constructor() {
    this.index = new Map();
  }

  build(sessions) {
    this.index.clear();
    for (const session of sessions) {
      const tokens = this._tokenize(session);
      for (const token of tokens) {
        if (!this.index.has(token)) this.index.set(token, new Set());
        this.index.get(token).add(session.name);
      }
    }
  }

  _tokenize(session) {
    const tokens = new Set();
    if (session.name) {
      session.name.toLowerCase().split(/\W+/).filter(Boolean).forEach(t => tokens.add(t));
    }
    if (session.urls) {
      session.urls.forEach(url => {
        url.toLowerCase().split(/[\/\W]+/).filter(Boolean).forEach(t => tokens.add(t));
      });
    }
    if (session.tags) {
      session.tags.forEach(tag => tokens.add(tag.toLowerCase()));
    }
    return tokens;
  }

  lookup(token) {
    return this.index.get(token.toLowerCase()) || new Set();
  }

  suggest(prefix) {
    const results = new Set();
    for (const [token] of this.index) {
      if (token.startsWith(prefix.toLowerCase())) results.add(token);
    }
    return Array.from(results).slice(0, 10);
  }
}

module.exports = { SearchIndex };

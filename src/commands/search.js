const { Command } = require('commander');
const { loadSessions } = require('../session/store');
const { searchByQuery, rankResults } = require('../search/searcher');
const { SearchIndex } = require('../search/search-index');

function registerSearchCommands(program) {
  const search = program.command('search').description('Search through saved sessions');

  search
    .command('query <term>')
    .description('Search sessions by name, URL, or tag')
    .option('--rank', 'rank results by relevance')
    .option('--json', 'output as JSON')
    .action(async (term, opts) => {
      const sessions = await loadSessions();
      let results = searchByQuery(sessions, term);
      if (opts.rank) results = rankResults(results, term);
      if (results.length === 0) {
        console.log('No sessions matched your query.');
        return;
      }
      if (opts.json) {
        console.log(JSON.stringify(results, null, 2));
      } else {
        results.forEach(s => {
          console.log(`[${s.name}] ${(s.urls || []).length} URL(s) | tags: ${(s.tags || []).join(', ') || 'none'}`);
        });
      }
    });

  search
    .command('suggest <prefix>')
    .description('Suggest session names or tokens matching a prefix')
    .action(async (prefix) => {
      const sessions = await loadSessions();
      const idx = new SearchIndex();
      idx.build(sessions);
      const suggestions = idx.suggest(prefix);
      if (suggestions.length === 0) {
        console.log('No suggestions found.');
      } else {
        suggestions.forEach(s => console.log(s));
      }
    });
}

module.exports = { registerSearchCommands };

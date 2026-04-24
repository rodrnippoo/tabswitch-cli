const manager = require('../share/share-manager');
const { getSession } = require('../session/manager');

function registerShareCommands(program) {
  const share = program.command('share').description('Share sessions with others');

  share
    .command('create <sessionName>')
    .description('Create a shareable token for a session')
    .option('-e, --expires <hours>', 'Expire after N hours', parseInt)
    .action((sessionName, opts) => {
      const session = getSession(sessionName);
      if (!session) return console.error(`Session not found: ${sessionName}`);
      const token = manager.shareSession(session, {
        expiresInHours: opts.expires,
      });
      console.log(`Share token: ${token.token}`);
      if (token.expiresAt) console.log(`Expires at: ${token.expiresAt}`);
    });

  share
    .command('link <token>')
    .description('Get a shareable link for a token')
    .action((token) => {
      try {
        const link = manager.getShareLink(token);
        console.log(`Share link: ${link}`);
      } catch (err) {
        console.error(err.message);
      }
    });

  share
    .command('revoke <token>')
    .description('Revoke a share token')
    .action((token) => {
      try {
        manager.revokeShare(token);
        console.log(`Revoked share token: ${token}`);
      } catch (err) {
        console.error(err.message);
      }
    });

  share
    .command('list')
    .description('List all active share tokens')
    .action(() => {
      const shares = manager.listShares();
      if (!shares.length) return console.log('No shares found.');
      shares.forEach((s) => {
        const status = s.expired ? '[expired]' : '[active]';
        console.log(`${status} ${s.token} — ${s.sessionName} (${s.tabCount} tabs)`);
      });
    });

  share
    .command('decode <link>')
    .description('Decode a share link and display its contents')
    .action((link) => {
      try {
        const token = manager.resolveLink(link);
        console.log(`Session: ${token.sessionName}`);
        token.urls.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
      } catch (err) {
        console.error(err.message);
      }
    });
}

module.exports = { registerShareCommands };

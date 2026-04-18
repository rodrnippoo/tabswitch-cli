#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const { registerSessionCommands } = require('../src/commands/session');
const pkg = require('../package.json');

const program = new Command();

program
  .name('tabswitch')
  .description('Manage and restore browser tab sessions from the terminal')
  .version(pkg.version || '0.1.0');

registerSessionCommands(program);

program.parse(process.argv);

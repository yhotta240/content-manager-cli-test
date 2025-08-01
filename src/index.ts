#!/usr/bin/env node

import { Command } from 'commander';
import initCommand from './commands/core/init.js';
import createCommand from './commands/content/create.js';
import buildCommand from './commands/content/build.js';

const program = new Command();

program
  .name('content')
  .description('カテゴリごとに Markdown コンテンツとメタ情報を管理できる汎用 CLI ツール')
  .version('1.0.0');

program.addCommand(initCommand);
program.addCommand(createCommand);
program.addCommand(buildCommand);

program.parse();
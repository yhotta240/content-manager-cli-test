#!/usr/bin/env node

import { Command } from 'commander';
import createCommand from './commands/create.js';
import buildCommand from './commands/build.js';

const program = new Command();

program
  .name('content')
  .description('カテゴリごとに Markdown コンテンツとメタ情報を管理できる汎用 CLI ツール')
  .version('1.0.0');

program.addCommand(createCommand);
program.addCommand(buildCommand);

program.parse();
#!/usr/bin/env node

import { Command } from 'commander';
import initCommand from './commands/setup/init.js';
import createCommand from './commands/manage/create.js';
import buildCommand from './commands/manage/build.js';
import ghPagesCommand from './commands/setup/gh-pages.js';

const program = new Command().configureHelp({
  subcommandTerm: (cmd) => cmd.name() + ' ' + cmd.usage(),
});

program
  .name('content')
  .usage('<command> [arguments] [options]')
  .description('Description: カテゴリごとに Markdown コンテンツとメタ情報を管理できる汎用 CLI ツール')
  .version('0.1.0')
  .showHelpAfterError()
  .addHelpText('after',
  `\nExamples:
  $ content init my-blog     # 新しいブログ用フォルダを初期化
  $ content build ./docs     # ./docs をビルド`)
  .addHelpText('afterAll', '\nContent Manager CLI v0.1.0')
  .addHelpText('afterAll', 'GitHub: https://github.com/yhotamos/content-manager-cli')
  .addHelpText('afterAll', '\nCopyright (c) 2025 yhotamos');

program.addCommand(initCommand);
program.addCommand(createCommand);
program.addCommand(buildCommand);
program.addCommand(ghPagesCommand);


program.parse();

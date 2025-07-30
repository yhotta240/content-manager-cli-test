#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();

program
  .name('content')
  .description('カディゴとに Markdown コンテンツとメタ情報を管理できる汎用 CLI ツール')
  .version('1.0.0');

program
  .command('create')
  .description('コンテンツを作成する')
  .argument("[filePath]", "コンテンツのファイルパス")
  .option("-t, --title <title>", "タイトル")
  .option("-c, --category <category>", "カテゴリ")
  .action((filePath) => {
    console.log(filePath);
  });

program
  .command("build")
  .description("コンテンツをビルド")
  .argument("[target]", "フォルダまたはファイルパス")
  .option("-c, --category <category>", "カテゴリ単位でビルド")
  .action(() => { console.log("build") });

program.parse();
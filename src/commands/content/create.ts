import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { ContentMeta, ContentMetaOptions } from "../../types/meta";
import { ContentConfig } from "../../types/config";
import { confirm } from "../../utils/confirm.js";
import { createFile } from "../../utils/file.js";
import matter from "gray-matter";

const CONFIG_FILE = "content.config.json";

// 'create' コマンドのアクション
async function createAction(projectDir: string, options: ContentMetaOptions) {
  // projectDir から content.config.json 設定ファイルを読み込む
  const configPath = path.join(projectDir, CONFIG_FILE);

  if (!fs.existsSync(configPath)) {
    console.error(`${configPath} は存在しません`);
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const { defaultMeta }: ContentConfig = config;
  // options から title, category を取得
  const { title, category }: ContentMetaOptions = options;

  const titleStr: string = title || "untitled";
  const categoryDir = category ? `${category}` : "/";
  const dateDir = new Date().toISOString().slice(0, 10);

  // const contentDirPath = `${projectDir}${categoryDir}${dateDir}`;
  const contentDirPath = path.posix.join(projectDir, categoryDir, dateDir);
  const contentFilePath = `${contentDirPath}/${titleStr}.md`;
  if (fs.existsSync(contentFilePath)) {
    const message = `⚠ ${contentFilePath} はすでに存在します。上書きしますか?`;
    const ok = await confirm(message);
    if (!ok) {
      console.log('処理を中止しました．');
      return;
    }
  }

  const meta: ContentMeta = {
    id: Math.random().toString(36).slice(2),
    title: titleStr,
    date: dateDir,
    updated: dateDir,
    category: category || "",
    thumbnail: "",
    tags: [],
    slug: contentDirPath,
    ...(defaultMeta?.lang?.trim() ? { lang: defaultMeta.lang } : {}),
    ...(defaultMeta?.author?.trim() ? { author: defaultMeta.author } : {}),
  };
  const content = `# ${title}\n`;

  const contentWithMeta = matter.stringify(content, meta);

  createFile(contentFilePath, contentWithMeta);
}

const createCommand = new Command("create")
  .usage("<projectDir> [options]")
  .argument("projectDir", "コンテンツファイルを作成するディレクトリ")
  .option("-t, --title <title>", "新しいコンテンツのタイトル")
  .option("-c, --category <category>", "新しいコンテンツのカテゴリ，カテゴリディレクトリを作成します．")
  .description("新しいコンテンツファイルを作成します．日付ディレクトリを自動的に作成し，コンテンツファイルを作成します．")
  .showHelpAfterError()
  .action(createAction);

export default createCommand;
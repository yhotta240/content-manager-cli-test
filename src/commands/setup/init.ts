import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { ContentConfig, ContentConfigOptions } from "../../types/config";
import { confirm } from "../../utils/confirm.js";
import { writeConfigFile } from "../../utils/config.js";

const CONFIG_FILE = "content.config.json";

// 'init' コマンドのアクション
async function initAction(contentDir: string, options: ContentConfigOptions) {
  const configPath = path.join(contentDir, CONFIG_FILE);

  // 既存の設定ファイルの上書きを確認
  if (fs.existsSync(configPath)) {
    const message = `${configPath} は既に存在します．上書きしますか?`;
    const ok = await confirm(message);
    if (!ok) {
      console.log('処理を中止しました．');
      return;
    }
  }

  const { contentName, metaIndexFile, lang, author, filePatterns }: ContentConfigOptions = options;
  const targetFilePatterns = filePatterns
    ? filePatterns.split(",").map((s: string) => s.trim())
    : ["**/*.md", "**/*.txt", "**/*.html"];

  const config: ContentConfig = {
    contentDir: contentDir,
    contentName: contentName || path.basename(contentDir),
    metaIndexFile: metaIndexFile || "content.meta.json",
    defaultMeta: {
      lang: lang || "ja",
      author: author || "",
    },
    filePatterns: targetFilePatterns,
    structures: [],
  };

  writeConfigFile(contentDir, config);
}

const initCommand = new Command("init")
  .usage("[contentDir] [options]")
  .argument("[contentDir]", "content.config.json を配置するディレクトリ（プロジェクトルートからの相対パス，デフォルト：content）", "content")
  .option("-c, --content-name <name>", "コンテンツプロジェクトの名前（省略時は contentDir の末尾のディレクトリ名を使用）")
  .option("-m, --meta-index-file <filename>", "生成するメタ情報インデックスファイルのファイル名")
  .option("-a, --author <name>", "デフォルトの作成者名")
  .option("-l, --lang <lang>", "デフォルトの言語コード（例：ja, en）")
  .option("-f, --file-patterns <patterns>", "対象とするコンテンツファイルのパターン（カンマ区切りで複数指定可）")
  .summary("新しいコンテンツプロジェクトを初期化します．")
  .description("指定されたディレクトリに `content.config.json` を作成し，コンテンツ管理プロジェクトの初期設定を行います．")
  .action(initAction);

export default initCommand;
import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { ContentConfig, ContentConfigOptions } from "../../types/config";
import { confirm } from "../../utils/confirm.js";

const CONFIG_FILE = "content.config.json";

// 設定ファイルを作成する
function writeConfigFile(folderPath: string, config: ContentConfig) {
  const configPath = path.join(folderPath, CONFIG_FILE);
  // ディレクトリがなければ作成
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`${configPath} を作成しました`);
}

// 'init' コマンドのアクション
async function initAction(folderPath: string, options: ContentConfigOptions) {
  const configPath = path.join(folderPath, CONFIG_FILE);

  // 既存の設定ファイルの上書きを確認
  if (fs.existsSync(configPath)) {
    const message = `${configPath} は既に存在します．上書きしますか?`;
    const ok = await confirm(message);
    if (!ok) {
      console.log('処理を中止しました．');
      return;
    }
  }

  const { contentDir, metaIndexFile, lang, author, filePatterns }: ContentConfigOptions = options;
  const projectName = path.basename(folderPath);
  const targetFilePatterns = filePatterns
    ? filePatterns.split(",").map((s: string) => s.trim())
    : ["**/*.md", "**/*.txt", "**/*.html"];

  const config: ContentConfig = {
    projectName: projectName,
    contentDir: contentDir || ".",
    metaIndexFile: metaIndexFile || "content.meta.json",
    defaultMeta: {
      lang: lang || "ja",
      author: author || "",
    },
    filePatterns: targetFilePatterns
  };

  writeConfigFile(folderPath, config);
}

const initCommand = new Command("init")
  .usage("[folderPath] [options]")
  .argument("[folderPath]", "初期化するコンテンツディレクトリ(デフォルト：content)", "content")
  .option("-c, --content-dir <dir>", "コンテンツを保存するディレクトリ (プロジェクトルートからの相対パス)")
  .option("-m, --meta-index-file <filename>", "生成されるメタデータファイルの名前")
  .option("-a, --author <name>", "作成者")
  .option("-l, --lang <lang>", "デフォルト言語")
  .option("-f, --file-patterns <patterns>", "対象とするコンテンツのファイルパターン (カンマ区切り)")
  .summary("新しいコンテンツプロジェクトを初期化します．")
  .description("指定されたディレクトリに `content.config.json` を作成し，コンテンツ管理プロジェクトをセットアップします．")
  .action(initAction);

export default initCommand;
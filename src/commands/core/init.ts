import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { ContentConfig, ContentConfigOptions } from "../../types/config";
import { confirm } from "../../utils/confirm.js";

const initCommand = new Command("init")
  .arguments("[folderPath]")
  .option("-c, --content-dir <dir>", "コンテンツディレクトリ")
  .option("-m, --meta-index-file <filename>", "メタインデックスファイル名")
  .option("-a, --author <name>", "作成者")
  .option("-l, --lang <lang>", "デフォルト言語")
  .option("-f, --file-patterns <patterns>", "コンテンツファイルパターン（カンマ区切り）")
  .description("新しいコンテンツフォルダを作成")
  .action((folderPath, options) => {
    const { contentDir, metaIndexFile, lang, author, filePatterns }: ContentConfigOptions = options;

    const contentPath = folderPath || "./content"; // デフォルトは ./content
    const projectName = folderPath && path.basename(folderPath);
    const targetFilePatterns: string[] = (filePatterns ? filePatterns.split(",").map((s: string) => s.trim()) : ["**/*.md", "**/*.txt", "**/*.html"]);

    const config: ContentConfig = {
      projectName: projectName || "content",
      contentDir: contentDir || ".",
      metaIndexFile: metaIndexFile || "content.meta.json",
      defaultMeta: {
        lang: lang || "ja",
        author: author || "yhotamos",
      },
      filePatterns: targetFilePatterns
    };

    configJsonFile(contentPath, config);
  });

// content.config.json を作成
export async function configJsonFile(folderPath: string, config: ContentConfig) {
  const configPath = path.join(folderPath, "content.config.json");

  // ディレクトリがなければ作成
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (fs.existsSync(configPath)) {
    const message = `${configPath} は既に存在します。上書きしますか?`;
    const ok = await confirm(message);
    if (!ok) {
      console.log('処理を中止しました。');
      process.exit(0);
    }
  }

  // content.config.json を作成（上書きOKならここに到達）
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`${configPath} を作成しました`);
}

export default initCommand;
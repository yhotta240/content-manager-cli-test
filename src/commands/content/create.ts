import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { ContentMeta, ContentMetaOptions } from "../../types/meta";
import { ContentConfig } from "../../types/config";
import { confirm } from "../../utils/confirm.js";
import { createFile } from "../../utils/file.js";
import matter from "gray-matter";

const CONFIG_FILE = "content.config.json";

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}
// 'create' コマンドのアクション
async function createAction(contentDir: string, options: ContentMetaOptions) {
  // 設定ファイル content.config.json を読み込む
  const configPath = path.posix.join(contentDir, CONFIG_FILE);

  if (!fs.existsSync(configPath)) {
    console.error(`${configPath} は存在しません`);
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const { defaultMeta }: ContentConfig = config;

  const { structure, category, date, title, filename, force }: ContentMetaOptions = options;

  // structure をパースしてパスを構築
  const parts = structure?.split("/");
  const pathParts: string[] = [];

  if (parts) {
    for (const part of parts) {
      const subParts = part.split("-"); // ワードの結合（階層ではない）

      const resolvedSubParts = subParts.map((p) => {
        switch (p) {
          case "category":
            if (!category) {
              console.error("structureに 'category' が含まれていますが，--category オプションが指定されていません．");
              process.exit(1);
            }
            return category;

          case "date":
            return date === "today" ? getToday() : date || getToday();

          case "title":
            return title || "untitled";

          default:
            console.error("--structure <structure> の形式が正しくありません \n'category' | 'date' | 'title' からなります");
            process.exit(1);
        }
      });

      pathParts.push(resolvedSubParts.join("-"));
    }
  }

  const structurePath = pathParts.join("/");
  const titleStr = title || "untitled";
  const dateDir = date === "today" ? getToday() : date || getToday();
  const contentPath = path.posix.join(contentDir, structurePath);
  const contentFilePath = `${contentPath}/${filename}.md`;

  // ファイルの存在確認と上書き確認
  if (fs.existsSync(contentFilePath) && !force) {
    const message = `⚠ ${contentFilePath} はすでに存在します。上書きしますか?`;
    const ok = await confirm(message);
    if (!ok) {
      console.log("処理を中止しました．");
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
    slug: contentPath,
    ...(defaultMeta?.lang?.trim() ? { lang: defaultMeta.lang } : {}),
    ...(defaultMeta?.author?.trim() ? { author: defaultMeta.author } : {}),
  };

  const content = `# ${title}\n`;
  const contentWithMeta = matter.stringify(content, meta);

  createFile(contentFilePath, contentWithMeta);
}

const createCommand = new Command("create")
  .usage("<contentDir> [options]")
  .argument("contentDir", "コンテンツディレクトリ（content.config.json が配置されているディレクトリ）")
  .option(
    "-s, --structure <structure>", `出力先のディレクトリ構造を指定します．
                              'category'，'date'，'title' を組み合わせて，contentDir 配下に階層を作成します．
                              構造に 'category' を含む場合，'-c, --category' の指定が必須です．
                              'date' と 'title' は省略可能で，省略時は現在日付やデフォルトタイトルが自動生成されます．
                              例：
                                --structure 'category/date/title'     → <contentDir>/<category>/YYYY-MM-DD/untitled
                                --structure 'date-title/category'     → <contentDir>/YYYY-MM-DD-untitled/<category>
                                --structure 'category-title/date'     → <contentDir>/<category>-untitled/YYYY-MM-DD
                              '/' は階層の区切り，'-' はワードの結合を意味します．`
  )
  .option("-c, --category <category>", "コンテンツのカテゴリ（--structure に 'category' を含む場合は必須）")
  .option("-d, --date [date]", "作成日付を指定します．'YYYY-MM-DD' 形式または 'today'（デフォルト：today）", "today")
  .option("-t, --title [title]", "新しいコンテンツのタイトル（デフォルト：'untitled'）", "untitled")
  .option("-f, --filename [filename]", "コンテンツファイルのファイル名（デフォルト：'index'）", "index")
  .option("--force", "既存のファイル・ディレクトリがあっても上書きします")
  .description("新しいコンテンツファイルを作成します．" + "ディレクトリ構造やカテゴリ，日付などを柔軟に指定可能です．")
  .showHelpAfterError()
  .action(createAction);

export default createCommand;
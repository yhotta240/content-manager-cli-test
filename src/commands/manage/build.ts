import { Command } from "commander";
import fs from "fs";
import path from "path";
import fg from "fast-glob";
import matter from "gray-matter";
import { ContentMeta, ContentMetaIndex, ContentMetaOptions, ExtendedMeta, FullContentMeta } from "../../types/meta";
import { ContentConfig } from "../../types/config";
import { loadConfig } from "../../utils/config.js";
import { createFile } from "../../utils/file.js";
import { getStructureFromAlias, structureToPart } from "../../options/structure.js";
import { Structure } from "../../types/option";

const META_INDEX_FILE = "content.meta.json";

function createMeta(entry: string, contentPath: string, contentDir: string, config: ContentConfig): FullContentMeta {
  const contentPathRelative = path.posix.relative(path.posix.resolve("./"), contentPath);
  const source = fs.readFileSync(path.posix.join(contentPath, entry), "utf-8");
  const { data, content } = matter(source);

  // 基本的なメタデータをフロントマターから取得
  const baseMeta: ContentMeta = {
    id: data.id || entry, // idがなければファイルパスを仮IDに
    title: data.title || path.basename(entry, path.extname(entry)),
    date: data.date || new Date().toISOString(),
    ...data,
  };

  // 拡張メタデータを生成
  const contentName = data.category?.trim() || "uncategorized";
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200); // 1分あたり200語と仮定

  const extend: ExtendedMeta = {
    filename: path.basename(entry, path.extname(entry)),
    contentDir: config.contentDir || contentDir,
    contentName: contentName,
    metaIndexFile: META_INDEX_FILE,
    filePatterns: config.filePatterns,
    rawContentPath: path.posix.join(contentPathRelative, path.posix.dirname(entry)),
    url: path.posix.join(contentPathRelative, entry),
    visibility: "public",
    priority: 0,
    createdBy: "",
    modifiedBy: "",
    relatedIds: [],
    headings: [], // TODO: contentから見出しを抽出する処理
    contentStats: {
      charCount: content.length,
      wordCount,
      lineCount: content.split("\n").length,
      readingTime: readTime,
      headingCount: 0,
      imageCount: 0,
      codeBlockCount: 0,
    },
  };

  // 基本メタ(フロントマター)デフォルトメタ、拡張メタをマージ
  return {
    meta: { ...baseMeta, ...config.defaultMeta },
    ...extend,
  };
}

// コンテンツを解析し，メタデータファイル (`content.meta.json`) を生成・更新する
async function buildAction(contentDir: string, options: ContentMetaOptions) {
  // contentDir から content.config.json 設定ファイルを読み込む
  const config = loadConfig(contentDir);
  if (!config) return;

  const { filePatterns, structures }: ContentConfig = config;
  const contentRoot = path.posix.resolve(contentDir);
  console.log("Content Root:", contentRoot);

  const structureAlias = getStructureFromAlias(options.target); // 省略形を正式名称に変換
  const structurePart: string | undefined = structureToPart(structureAlias, options, true);

  const structureSet = new Set<string>();
  structures?.forEach((structure: Structure) => {
    const value = structure[structureAlias as keyof Structure] as string;
    if (typeof value === "string") {
      structureSet.add(value);
    }
  });

  let structureParts: string[] = Array.from(structureSet);
  // structurePart が指定されている場合，構造情報を絞り込む
  if (structurePart !== undefined) {
    structureParts = structureParts.filter((structure: string) => structure === structurePart);
  }
  if (structureParts.length === 0) {
    console.log(`[target=${structureAlias}] ${structureAlias}: '${structurePart}' に一致するディレクトリが見つかりません`);
    return;
  }

  // 構造情報をコンテンツルートから検索
  for (const structure of structureParts) {
    // content.meta.json を生成するコンテンツパス
    const contentPath = path.posix.join(contentRoot, structure);
    console.log("Content Path:", contentPath);

    if (!fs.existsSync(contentPath)) {
      console.error(`${contentPath} は存在しません`);
      continue; // 次のループへ
    }

    // filePatterns を使用して、contentPath からファイルを検索
    const contentFiles: string[] = await fg(filePatterns!, {
      cwd: contentPath,
      onlyFiles: true,
    });
    // console.log("対象ファイル:", entries.join(", "));

    if (contentFiles.length === 0) {
      console.log("コンテンツファイルが見つかりません");
      continue; // 次のループへ
    }

    const metas: FullContentMeta[] = [];
    contentFiles.forEach((entry: string) => {
      const metaData = createMeta(entry, contentPath, contentDir, config);
      metas.push(metaData);
    });

    const payload: ContentMetaIndex = {
      version: 1,
      generatedAt: new Date().toISOString(),
      count: metas.length,
      metas: metas,
    };

    const outputFilePath = path.posix.resolve(contentPath, META_INDEX_FILE);
    const successMessage = `✅ ${META_INDEX_FILE} (${metas.length} 件) を生成しました\nPath: ${outputFilePath}\n`;
    createFile(outputFilePath, JSON.stringify(payload, null, 2), successMessage);
  }
}

const buildCommand = new Command("build")
  .usage("<contentDir> [options]")
  .argument("contentDir", "コンテンツのルートディレクトリ（content.config.json を含む）")
  .option(
    "--target <structure>",
    `出力先の単一ディレクトリを指定します（'category'，'date'，'title' を組み合わせて指定）．
                            例：
                              --target 'category' → <category>
                              --target 'date-title' → YYYY-MM-DD-untitled
                              --target 'c-t'（ショートカット）→ <category>-untitled

                            ショートカット表記：
                              'category' = 'c'，'date' = 'd'，'title' = 't'
  `)
  .option("-c, --category <category>", "指定カテゴリのコンテンツのみ対象とします")
  .option("-o, --outFile <path>", "出力するメタデータファイルのパス（デフォルト：<contentDir>/content.meta.json）")
  .option("--pretty", "メタデータJSONを整形出力します（デフォルト：圧縮形式）", false)
  .description("指定ディレクトリ内のコンテンツを解析し，メタデータファイル（content.meta.json）を生成・更新します．")
  .action(buildAction);

export default buildCommand;

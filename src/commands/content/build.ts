import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from "gray-matter";
import { ContentMeta, ContentMetaIndex, ContentMetaOptions, ExtendedMeta, FullContentMeta } from "../../types/meta";
import { ContentConfig } from "../../types/config";
import { loadConfig } from "../../utils/config.js";
import { createFile } from "../../utils/file.js";

const META_INDEX_FILE = "content.meta.json";

// メタデータオブジェクトの作成
function createMeta(
  entry: string,
  projectDir: string,
  config: ContentConfig
): FullContentMeta {
  const source = fs.readFileSync(path.posix.join(projectDir, entry), "utf-8");
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
    contentDir: config.contentDir,
    contentName: contentName,
    metaIndexFile: META_INDEX_FILE,
    filePatterns: config.filePatterns,
    rawContentPath: path.posix.join(projectDir, entry), // 実際のファイルパス
    url: data.slug ? `/${data.slug}` : `/${path.basename(entry, path.extname(entry))}`, // slugがあれば使い、なければファイル名から生成
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
      codeBlockCount: 0
    },
  };

  // 基本メタ(フロントマター)デフォルトメタ、拡張メタをマージ
  return {
    meta: { ...baseMeta, ...config.defaultMeta },
    ...extend,
  };
}

// コンテンツを解析し，メタデータファイル (`content.meta.json`) を生成・更新する
async function buildAction(projectDir: string, options: ContentMetaOptions) {
  // projectDir から content.config.json 設定ファイルを読み込む
  const config = loadConfig(projectDir);
  if (!config) return;

  const { contentDir, filePatterns }: ContentConfig = config;
  const contentRoot = path.posix.resolve(projectDir, contentDir || '.');
  console.log("コンテンツルート:", contentRoot);

  // filePatterns を使用して、コンテンツルートからファイルを検索
  const entries = await fg(filePatterns!, {
    cwd: contentRoot,
    onlyFiles: true
  });
  // console.log("対象ファイル:", entries.join(", "));

  if (entries.length === 0) {
    console.log("コンテンツファイルが見つかりません");
    return;
  }

  const metas: FullContentMeta[] = [];
  entries.forEach((entry: string) => {
    const metaData = createMeta(entry, projectDir, config);
    metas.push(metaData);
  });

  const payload: ContentMetaIndex = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count: metas.length,
    metas: metas,
  };

  const outputFilePath = path.posix.resolve(contentRoot, META_INDEX_FILE);
  const successMessage = `\n✅ ${META_INDEX_FILE} (${metas.length} 件) を生成しました\nPath: ${outputFilePath}`;
  createFile(outputFilePath, JSON.stringify(payload, null, 2), successMessage);
}

const buildCommand = new Command("build")
  .usage("<projectDir> [options]")
  .argument("projectDir", "ビルド対象のプロジェクトディレクトリ")
  .option("-c, --category <category>", "指定したカテゴリに属するコンテンツのみビルド")
  .description("コンテンツを解析し，メタデータファイル (`content.meta.json`) を生成・更新します．")
  .action(buildAction);

export default buildCommand;
import fs from 'fs';
import path from 'path';
import { ContentConfig } from "../types/config";
import { ContentMetaOptions } from '../types/meta';
import { getToday } from './date.js';
import { getStructureFromAlias, structureToPath } from '../options/structure.js';

const CONFIG_FILE = "content.config.json";

function loadConfig(contentDir: string): ContentConfig | undefined {
  const configPath = path.posix.join(contentDir, CONFIG_FILE);

  if (!fs.existsSync(configPath)) {
    console.error(`${configPath} は存在しません`);
    return;
  }

  return readConfig(configPath);
}

function readConfig(configPath: string): ContentConfig | undefined {
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent) as ContentConfig;
  } catch (err) {
    console.error(`設定ファイルの読み込みに失敗しました: ${err}`);
    return;
  }
}

// 設定ファイルを作成する
function writeConfigFile(contentDir: string, config: ContentConfig) {
  const configPath = path.join(contentDir, CONFIG_FILE);
  // ディレクトリがなければ作成
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`${configPath} を作成しました`);
}

function writeConfig(config: ContentConfig, options: ContentMetaOptions, contentFilePath: string): void {
  const configPath = path.posix.join(config.contentDir, CONFIG_FILE);
  const structure = getStructureFromAlias(options.structure);
  const structurePath = structureToPath(structure, options);
  console.log("コンテンツ構造:", structurePath, structure);

  const newStructure = {
    slug: contentFilePath,
    structure: structure,
    [structure?.split("/")[0] as string]: structurePath,
    category: options.category,
    title: options.title,
    date: options.date === "today" ? getToday() : options.date,
    file: options.filename
  };

  // structures 配列が未定義なら初期化a
  if (!Array.isArray(config.structures)) {
    config.structures = [];
  }

  // slug の一致を探す
  const existingIndex = config.structures.findIndex(
    (entry) => entry.slug === contentFilePath
  );

  if (existingIndex !== -1) {
    // 上書き
    config.structures[existingIndex] = newStructure;
  } else {
    // 追加
    config.structures.push(newStructure);
  }

  // 書き込み
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

export { loadConfig, readConfig, writeConfigFile, writeConfig };
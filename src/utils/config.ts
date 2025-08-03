import fs from 'fs';
import path from 'path';
import { ContentConfig } from "../types/config";

const CONFIG_FILE = "content.config.json";

function loadConfig(projectDir: string): ContentConfig | undefined {
  const configPath = path.posix.join(projectDir, CONFIG_FILE);

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

export { loadConfig, readConfig };
import fs from 'fs';
import path from 'path';

// ファイルを作成
export function createFile(filePath: string, content: string) {
  // ディレクトリがなければ作成
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  console.log(`${filePath} を作成しました`);
}
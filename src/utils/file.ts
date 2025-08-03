import fs from 'fs';
import path from 'path';

const encoding: BufferEncoding = 'utf-8';

// ファイルを作成
export function createFile(filePath: string, content: string, message?: string) {
  // ディレクトリがなければ作成
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.writeFileSync(filePath, content || '', encoding);
  console.log(message || `${filePath} を作成しました`);
}
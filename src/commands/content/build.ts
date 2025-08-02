import { Command } from "commander";

const buildCommand = new Command("build")
  .usage("[folderPath] [options]")
  .argument("[folderPath]", "ビルド対象のコンテンツディレクトリ (デフォルト: カレントディレクトリ)")
  .option("-c, --category <category>", "指定したカテゴリに属するコンテンツのみビルド")
  .description("コンテンツを解析し，メタデータファイル (`content.meta.json`) を生成・更新します．")
  .action((folderPath, options) => {
    if (options.category) {
      console.log(`カテゴリ「${options.category}」内をビルド`);
    } else if (folderPath) {
      console.log(`フォルダ「${folderPath}」をビルド`);
    } else {
      console.log("すべてのコンテンツをビルド");
    }

  });

export default buildCommand;
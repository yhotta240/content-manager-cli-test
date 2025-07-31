import { Command } from "commander";

const buildCommand = new Command("build")
  .arguments("[folderPath]")
  .option("-c, --category <category>", "カテゴリを指定してビルド")
  .description("コンテンツをビルドして content.meta.json を生成")
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
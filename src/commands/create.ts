import { Command } from "commander";

const createCommand = new Command("create")
  .arguments("[filePath]")
  .option("-t, --title <title>", "タイトル")
  .option("-c, --category <category>", "カテゴリ")
  .description("新しいコンテンツを作成または既存ファイルから作成")
  .action((filePath, options) => {
    const { title, category } = options;

    if (filePath) {
      console.log(`既存ファイル ${filePath} から作成`);
    } else {
      console.log(`新規作成: タイトル=${title}，カテゴリ=${category}`);
    }

  });

export default createCommand;
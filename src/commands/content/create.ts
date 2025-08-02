import { Command } from "commander";

const createCommand = new Command("create")
  .usage("[filePath] [options]")
  .argument("[filePath]", "テンプレートとして使用する既存のコンテンツファイル")
  .option("-t, --title <title>", "新しいコンテンツのタイトル")
  .option("-c, --category <category>", "新しいコンテンツのカテゴリ")
  .description("新しいコンテンツファイルを作成します．既存のファイルをテンプレートとして使用することも可能です．")
  .action((filePath, options) => {
    const { title, category } = options;

    if (filePath) {
      console.log(`既存ファイル ${filePath} から作成`);
    } else {
      console.log(`新規作成: タイトル=${title}，カテゴリ=${category}`);
    }

  });

export default createCommand;
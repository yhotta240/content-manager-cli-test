import { Command } from "commander";

const configCommand = new Command("config")
  .description("設定ファイル (`content.config.json`) の内容を表示・変更します．")
  .action(() => {
    console.log("設定を表示または変更します");
  });

export default configCommand;

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { GhPagesOptions, PublishType } from "../../types/gh-pages";
import { confirm } from "../../utils/confirm.js";
import { createFile } from "../../utils/file.js";
import { getGhPagesWorkflow } from "../../workflows/index.js";

const WORKFLOW_DIR = ".github/workflows";
const WORKFLOW_FILE = "content-gh-pages.yml";

async function ghPagesAction(contentDir: string, options: GhPagesOptions) {
  const workflowPath = path.join(WORKFLOW_DIR, WORKFLOW_FILE);
  const { force = false }: GhPagesOptions = options;

  if (fs.existsSync(workflowPath) && !force) {
    const message = `⚠ ${workflowPath} はすでに存在します．上書きしますか?`;
    const ok = await confirm(message);
    if (!ok) {
      console.log("処理を中止しました．");
      return;
    }
  }
  contentDir = path.posix.normalize(contentDir).replace(/\/$/, "");
  const workflow = getGhPagesWorkflow(contentDir, options as GhPagesOptions);

  if (!workflow) {
    console.error("ワークフローの生成に失敗しました。");
    return;
  }

  createFile(workflowPath, workflow, `✅ ${workflowPath} を作成しました`);
  console.log("GitHubリポジトリの Actions secrets で 'ACTIONS_DEPLOY_KEY' の設定が必要な場合があります．");
}

const ghPagesCommand = new Command("gh-pages")
  .usage("<contentDir> [options]")
  .argument("contentDir", "content.config.json を配置するディレクトリ（プロジェクトルートからの相対パス")
  .option("-b, --branch <branch>", "デプロイ先のブランチ名", "main")
  .option("-d, --build-dir <dir>", "ビルド成果物が格納されるディレクトリ")
  .option("-p, --publish-type <type>", "GitHub Pages への公開方法", "sameRepoMain" as PublishType)
  .option("-r, --ext-repo <repo>", "外部リポジトリの URL")
  .option("-t, --token-name <name>", "GITHUB_TOKEN の名前", "ACTIONS_DEPLOY_KEY")
  .option("-j, --jekyll", "Jekyll（Markdown を HTML に変換）を使用して GitHub Pages に公開します．")
  .option("-f, --force", "既存のワークフローファイルがあっても上書きします．")
  .summary("GitHub Pages への公開用ワークフローを生成します")
  .description("GitHub Pages への公開用ワークフローを生成します．`.github/workflows/gh-pages.yml` を作成し，GitHub Pages への自動デプロイを設定します．")
  .action(ghPagesAction);

export default ghPagesCommand;

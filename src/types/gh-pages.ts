export interface GhPagesOptions {
  branch: string;
  buildDir: string;
  nodeVersion: string;
  publishType: PublishType;
  extRepo: string;
  tokenName: string; // secretsの名前（デフォルト: ACTIONS_DEPLOY_KEY）
  jekyll: boolean; // JekyllでMarkdownをHTML変換するか
  force?: boolean;
}

export type PublishType =
  | "sameRepoMain"     // 同リポジトリ GitHub Pages (actions/deploy-pages)
  | "sameRepoGhPages"   // 同リポジトリ gh-pages ブランチ
  | "otherRepoMain"     // 別リポジトリ main ブランチ
  | "otherRepoGhPages"  // 別リポジトリ gh-pages ブランチ
  | "privateRepo"  // プライベートリポジトリ Pages
  | "externalService";  // 他サービス (Vercel, Netlify等)

# Content Manager CLI

[![npm version](https://badge.fury.io/js/content-manager-cli.svg)](https://badge.fury.io/js/content-manager-cli)

カテゴリごとに Markdown コンテンツとメタ情報を管理できる汎用 CLI ツールです．

## 主な特徴

- **柔軟なディレクトリ管理**: カテゴリ・日付・タイトルを自由に組み合わせ，分かりやすい構造でコンテンツを整理．
- **メタ情報付き Markdown**: メタデータ入りの Markdown ファイルをそのまま作成・管理できる．
- **メタデータ自動集約**: 複数のコンテンツからメタ情報をまとめ上げ，一覧やサイトマップを自動生成．
- **GitHub Pages 公開対応**: GitHub Pages へのデプロイ用ワークフローも自動で用意．

## 要件

- Node.js (LTS版を推奨)

## インストール

```bash
npm install -g content-manager-cli
```

## 基本的な構文

```
content <command> [targetDir] [options]
```

- `<command>`: 実行するコマンド (`init`, `create`, `build` など)
- `[targetDir]`: `content.config.json` が配置されている，または作成されるディレクトリ．多くのコマンドで必須です．
- `[options]`: `-c, --category` のようなコマンド固有のオプション．

## 基本的な使い方

1.  **プロジェクトディレクトリの作成**

    ```bash
    mkdir my-project
    cd my-project
    ```

2.  **コンテンツ管理の初期化**

    プロジェクト内に，コンテンツを管理するためのディレクトリを作成します．(デフォルトでは `content` という名前になります)

    ```bash
    content init
    ```

3.  **コンテンツの作成**

    カテゴリ `news`，タイトル `my-first-post` でコンテンツを作成します．
    `-s c/t` は `category/title` のショートカットで，`<カテゴリ>/<タイトル>` というディレクトリ構造を意味します．

    ```bash
    # ./content/news/my-first-post/index.md が作成される
    content create content -s c/t -c news -t "my-first-post"
    ```

4.  **メタデータのビルド**

    カテゴリ(`-c news`)を指定し，そのカテゴリのディレクトリ(`--target c`)をビルドします．これにより，`content/news/content.meta.json` が生成されます．

    ```bash
    content build content --target c -c news
    ```

上記のコマンドを実行すると，最終的なディレクトリ構成は以下のようになります．

```bash
my-project/
└── content/
    ├── news/
    │   ├── my-first-post/
    │   │   └── index.md           # createコマンドで生成
    │   └── content.meta.json      # buildコマンドで生成
    └── content.config.json　      # initコマンドで生成
```

## コマンド一覧

### `content init [contentDir] [options]`

新しいコンテンツプロジェクトを初期化し，設定ファイル `content.config.json` を作成します．

- `[contentDir]`: 初期化するディレクトリ (デフォルト: `content`)
- `-c, --content-name <name>`: コンテンツプロジェクト名
- `-a, --author <name>`: デフォルトの作成者名
- `-l, --lang <lang>`: デフォルトの言語コード (例: `ja`, `en`)
- `-f, --file-patterns <patterns>`: 対象コンテンツのファイルパターン (カンマ区切り)

### `content create <contentDir> [options]`

新しいコンテンツファイルを作成します．

- `<contentDir>`: `content.config.json` があるディレクトリ
- `-s, --structure <structure>`: ディレクトリ構造 (`category`, `date`, `title` の組み合わせ)
- `-c, --category <category>`: カテゴリ名 (`structure` に `category` を含む場合は必須)
- `-d, --date [date]`: 作成日 (`YYYY-MM-DD` または `today`) (デフォルト: `today`)
- `-t, --title [title]`: タイトル (デフォルト: `untitled`)
- `-f, --filename [filename]`: ファイル名 (デフォルト: `index`)
- `--force`: 既存ファイルを上書き

### `content build <contentDir> [options]`

コンテンツを解析し，メタデータファイル (`content.meta.json`) を生成・更新します．

- `<contentDir>`: `content.config.json` があるディレクトリ
- `--target <structure>`: 出力対象を単一ディレクトリに指定
- `-c, --category <category>`: 指定カテゴリのみを対象
- `--pretty`: JSON を整形して出力

### `content gh-pages <contentDir> [options]`

GitHub Pages への公開用ワークフロー (`.github/workflows/content-gh-pages.yml`) を生成します．

- `<contentDir>`: `content.config.json` があるディレクトリ
- `-b, --branch <branch>`: デプロイ先のブランチ (デフォルト: `main`)
- `-d, --build-dir <dir>`: ビルド成果物が格納されるディレクトリ
- `-r, --ext-repo <repo>`: 外部リポジトリの URL
- `-f, --force`: 既存のワークフローファイルを上書き

## 設定ファイル (`content.config.json`)

`content init` で生成される設定ファイルです．プロジェクトの挙動をカスタマイズできます．

```json
{
  "contentDir": "content",
  "contentName": "content",
  "metaIndexFile": "content.meta.json",
  "defaultMeta": {
    "lang": "ja",
    "author": ""
  },
  "filePatterns": ["**/*.md", "**/*.txt", "**/*.html"],
  "structures": []
}
```

## コントリビュート

バグ報告，機能提案，プルリクエストはいつでも歓迎します．Issue やプルリクエストを作成する前に，既存の Issue がないか確認してください．

1.  このリポジトリをフォークします．
2.  フィーチャーブランチを作成します (`git checkout -b feature/your-feature`)．
3.  変更をコミットします (`git commit -m 'Add some feature'`)．
4.  ブランチにプッシュします (`git push origin feature/your-feature`)．
5.  プルリクエストを作成します．

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています．

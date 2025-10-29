# Content Manager CLI

[![npm version](https://badge.fury.io/js/content-manager-cli.svg)](https://badge.fury.io/js/content-manager-cli)

カテゴリごとに Markdown コンテンツとメタ情報を管理できる，軽量な CLI ツールです．

目次

- [概要](#概要)
- [主な機能](#主な機能)
- [インストール](#インストール)
- [クイックスタート](#クイックスタート)
- [コマンド一覧](#コマンド一覧)
- [設定ファイル（content.config.json）](#設定ファイルcontentconfigjson)
- [開発・ビルド](#開発ビルド)
- [貢献方法](#貢献方法)
- [ライセンス](#ライセンス)

## 概要

Content Manager CLI は，カテゴリごとに整理された Markdown コンテンツとそのメタデータを作成・管理・出力するためのコマンドラインツールです．静的サイトのコンテンツ管理や，ドキュメント群の整理に向いています．

## 主な機能

- 柔軟なディレクトリ構成の生成と管理（カテゴリ，日付，タイトルなどの組み合わせが可能）．
- Markdown ファイルにメタデータ（front-matter）を付与して管理できる．
- コンテンツ群からメタ情報を収集し，content.meta.json のようなインデックスを生成できる．
- GitHub Pages へ公開するためのワークフロー (.github/workflows/content-gh-pages.yml) を生成する補助機能を持つ．

## インストール

Node.js（LTS 推奨）が必要です．

グローバルにインストールする場合：

```bash
npm install -g content-manager-cli
```

パッケージは dist にビルドされた実行ファイルを公開する想定です．ソースから実行する場合はビルド手順（下記）を参照してください．

## クイックスタート

1. プロジェクトフォルダを作成して移動します．

```bash
mkdir my-project
cd my-project
```

2. コンテンツの初期化を行います（デフォルトでは content ディレクトリを作成します）．

```bash
content init
```

3. 新しいコンテンツを作成します（例：カテゴリ news，タイトル my-first-post）．

```bash
# ./content/news/my-first-post/index.md が作成されます．
content create content -s c/t -c news -t "my-first-post"
```

4. メタデータのビルドを行い，content.meta.json を生成します．

```bash
content build content --target c -c news
```

## コマンド一覧

主要コマンドと代表的なオプションの概要です．詳細は `content <command> --help` を参照してください．

- content init [contentDir]
  - contentDir：初期化するディレクトリ（デフォルト: content）．
  - -c, --content-name <name>：コンテンツプロジェクト名を指定します．
  - -a, --author <name>：作成者名を設定します．
  - -l, --lang <lang>：デフォルト言語コード（例：ja, en）を指定します．
  - -f, --file-patterns <patterns>：対象ファイルパターン（カンマ区切り）を指定します．

- content create <contentDir>
  - <contentDir>：content.config.json があるディレクトリを指定します．
  - -s, --structure <structure>：ディレクトリ構造のテンプレート（例：c/t は category/title）．
  - -c, --category <category>：カテゴリ名（structure に category が含まれる場合は必須）．
  - -d, --date [date]：作成日（YYYY-MM-DD または today）．
  - -t, --title [title]：タイトル（デフォルト: untitled）．
  - -f, --filename [filename]：ファイル名（デフォルト: index）．
  - --force：既存ファイルを上書きします．

- content build <contentDir>
  - <contentDir>：content.config.json があるディレクトリを指定します．
  - --target <structure>：出力対象を単一ディレクトリに指定します．
  - -c, --category <category>：指定カテゴリのみを対象にします．
  - --pretty：出力 JSON を整形して書き出します．

- content gh-pages <contentDir>
  - GitHub Pages 用の公開ワークフローを生成します．
  - -b, --branch <branch>：デプロイ先ブランチ（デフォルト: main）．
  - -d, --build-dir <dir>：ビルド成果物が格納されるディレクトリを指定します．
  - -r, --ext-repo <repo>：外部リポジトリを指定する場合に使用します．
  - --force：既存ワークフローを上書きします．

## 設定ファイル（content.config.json）

`content init` で生成される設定ファイルのサンプルです．必要に応じてフィールドを編集して運用してください．

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

## 開発・ビルド

このリポジトリは TypeScript で実装されています．開発用にソースから実行する場合は，ビルドを行ってから実行してください．

```bash
# 依存関係をインストールします．
npm install

# ビルドします．
npm run build

# ローカルのビルド済みファイルを使ってコマンドを実行できます．
node ./dist/index.js --help
```

開発時に直接 TypeScript を実行したい場合は tsx 等を利用してください．

## 貢献方法

バグ報告，機能提案，PR は歓迎します．

1. リポジトリをフォークします．
2. ブランチを作成します（例：feature/your-feature）．
3. 変更をコミットします．
4. プッシュしてプルリクエストを作成します．

コミットメッセージの形式は次のようにお願いします．

<type>: <要約> [#Issue番号 / refs #Issue番号]

例：
```
fix: プログラムの言語検出ロジッ��を追加 [refs #1]
```

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています．

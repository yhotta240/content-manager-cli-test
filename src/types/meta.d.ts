export interface ContentMeta {
  id: string;
  title: string;
  date: string;
  updated?: string;
  category?: string;
  thumbnail?: string;
  tags?: string[];
  slug?: string;
  status?: "draft" | "published" | "archived";
  version?: string;
  description?: string;
  summary?: string;
  type?: string;
  author?: string;
  lang?: string;
}

export interface ExtendedMeta {
  filename?: string;          // 実ファイル名（例: index.md）
  contentDir?: string;        // カテゴリなどを含むディレクトリ名
  contentName?: string;       // ディレクトリ名またはファイルベース名
  metaIndexFile?: string;     // 使用されたインデックスファイル名
  filePatterns?: string[];    // 使用されたマッチングパターン
  assets?: string[];          // 関連ファイルパス（画像など）
  rawContentPath?: string;    // 実際のファイルのパス
  url?: string;               // 公開URL（slugから生成）
  visibility?: "public" | "private"; // 公開範囲
  priority?: number;          // 表示優先度
  createdBy?: string;         // 作成者（内部用）
  modifiedBy?: string;        // 更新者（内部用）
  relatedIds?: string[];      // 関連コンテンツのID
  headings?: string[];        // 見出し一覧（目次用）
  contentStats: {
    charCount?: number;       // 文字数
    wordCount?: number;       // 単語数
    lineCount?: number;       // 行数
    readingTime?: number;     // 読了時間（分）
    headingCount?: number;    // 見出し数
    imageCount?: number;      // 画像数
    codeBlockCount?: number;  // コードブロック数
  };
}

export type FullContentMeta = { meta: ContentMeta } & ExtendedMeta;

export interface ContentMetaIndex {
  version: number;
  generatedAt: string;
  count: number;
  metas: FullContentMeta[];
}

export interface ContentMetaOptions {
  title?: string;
  category?: string;
}
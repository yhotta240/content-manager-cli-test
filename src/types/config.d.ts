export interface ContentConfig {
  contentName?: string;  // content.config.json で定義されているコンテンツ名
  contentDir?: string;   // content.config.json が置かれているディレクトリ(プロジェクトルートからの相対パス)
  metaIndexFile?: string;
  defaultMeta?: {
    author?: string;
    lang?: string;
    [key: string]: any;
  };
  filePatterns?: string[];
}

export interface ContentConfigOptions {
  contentName?: string;
  contentDir?: string;
  metaIndexFile?: string;
  lang?: string;
  author?: string;
  filePatterns?: string;
}
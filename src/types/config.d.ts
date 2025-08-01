export interface ContentConfig {
  projectName?: string;
  contentDir?: string;
  metaIndexFile?: string;
  defaultMeta?: {
    author?: string;
    lang?: string;
    [key: string]: any;
  };
  filePatterns?: string[];
}

export interface ContentConfigOptions {
  projectName?: string;
  contentDir?: string;
  metaIndexFile?: string;
  lang?: string;
  author?: string;
  filePatterns?: string;
}
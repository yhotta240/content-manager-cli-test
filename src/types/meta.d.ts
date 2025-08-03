export interface ContentMeta {
  id: string;
  title: string;
  date: string;
  updated?: string;
  category?: string;
  thumbnail?: string;
  tags?: string[];
  slug?: string;
  version?: string;
  description?: string;
  summary?: string;
  type?: string;
  author?: string;
  lang?: string;
}

export interface ContentMetaOptions {
  title?: string;
  category?: string;
}
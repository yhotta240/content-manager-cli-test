import { ContentMetaOptions } from "../types/meta";
import { getToday } from "../utils/date.js";

const STRUCTURE_ALIAS_MAP: Record<string, string> = {
  c: "category",
  d: "date",
  t: "title",
};

function getStructureFromAlias(structure: string | undefined): string | undefined {
  if (!structure) return "";

  return structure
    .split("/")
    .map((part) =>
      part
        .split("-")
        .map((token) => STRUCTURE_ALIAS_MAP[token] ?? token) // 省略形を正式名称に変換
        .join("-")
    )
    .join("/");
}

function aliasToStructure(structure: string | undefined, { category, date, title }: ContentMetaOptions, force?: boolean): string[] | undefined {
  if (!structure) return [];
  const parts = structure.split("/");
  const pathParts: string[] = [];

  if (parts) {
    for (const part of parts) {
      const subParts = part.split("-"); // ワードの結合（階層ではない）
      try {
        const resolvedSubParts = subParts.map((p) => {
          switch (p) {
            case "category":
              if (!category && !force) {
                throw "missing_category";
              }
              return category;

            case "date":
              return date === "today" ? getToday() : date || getToday();

            case "title":
              return title || "untitled";

            default:
              throw "invalid_structure";
          }
        });

        pathParts.push(resolvedSubParts.join("-"));
      } catch (err) {
        if (err === "missing_category") {
          console.error("structureに 'category' が含まれていますが，--category オプションが指定されていません．");
        } else if (err === "invalid_structure") {
          console.error("--structure の形式が正しくありません．'category' | 'date' | 'title' のみ使用可能です．");
        } else {
          console.error("未知のエラーが発生しました");
        }
        return;
      }
    }
  }

  return pathParts;
}

function structureToPath(structure: string | undefined, { category, date, title }: ContentMetaOptions, force?: boolean): string | undefined {
  return aliasToStructure(structure, { category, date, title }, force)?.join("/");
}

function structureToPart(structure: string | undefined, { category, date, title }: ContentMetaOptions, force?: boolean): string | undefined {
  if (category === undefined) return;

  return aliasToStructure(structure, { category, date, title }, force)?.join("/");
}

export { getStructureFromAlias, aliasToStructure, structureToPath, structureToPart };

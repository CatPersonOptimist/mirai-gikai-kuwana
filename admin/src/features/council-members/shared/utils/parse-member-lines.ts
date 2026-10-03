import type { NewCouncilMemberInput } from "../types";

/**
 * 議員の一括登録用テキストを解析する。
 *
 * 1行に1人。「氏名」または「氏名,会派」（区切りはカンマ・全角カンマ・タブ）。
 * 氏名の姓と名の間の空白は氏名の一部として残す（「冨田　薫」など）。
 * 空行は無視する。
 */
export function parseMemberLines(text: string): NewCouncilMemberInput[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [rawName, ...rest] = line.split(/[,，\t]/);
      const name = rawName.trim();
      const faction = rest.join(",").trim();
      return { name, faction: faction.length > 0 ? faction : null };
    })
    .filter((member) => member.name.length > 0);
}

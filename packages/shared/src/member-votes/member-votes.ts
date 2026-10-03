/**
 * 議員別表決結果（議案ごとの議員の賛否）の共通定義。
 * DB の enum member_vote_type と値をそろえること。
 */

export type MemberVoteType = "for" | "against" | "absent" | "not_voting";

/** 表示・集計の順序 */
export const MEMBER_VOTE_TYPES: readonly MemberVoteType[] = [
  "for",
  "against",
  "absent",
  "not_voting",
];

export const MEMBER_VOTE_LABELS: Record<MemberVoteType, string> = {
  for: "賛成",
  against: "反対",
  absent: "欠席",
  not_voting: "採決に加わらず",
};

/** 桑名市議会の議員別表決結果で使われる記号 */
export const MEMBER_VOTE_SYMBOLS: Record<MemberVoteType, string> = {
  for: "○",
  against: "×",
  absent: "欠",
  not_voting: "－",
};

const SYMBOL_TO_VOTE: Record<string, MemberVoteType> = {
  "○": "for",
  "〇": "for",
  "◯": "for",
  o: "for",
  O: "for",
  "×": "against",
  "✕": "against",
  "✗": "against",
  x: "against",
  X: "against",
  欠: "absent",
  "－": "not_voting",
  "-": "not_voting",
  ー: "not_voting",
  "―": "not_voting",
  "—": "not_voting",
  "‐": "not_voting",
};

export interface ParsedVoteSymbols {
  /** 記号の並び順どおりの賛否 */
  votes: MemberVoteType[];
  /** 解釈できなかった文字（重複なし、出現順） */
  invalidSymbols: string[];
}

/**
 * 「○ ○ × 欠 －」のような記号の並びを賛否の配列に変換する。
 * 空白・改行・カンマなどの区切りは無視し、1文字を1人分として読む。
 */
export function parseVoteSymbols(text: string): ParsedVoteSymbols {
  const votes: MemberVoteType[] = [];
  const invalid = new Set<string>();

  for (const char of text.replace(/[\s,、，]/g, "")) {
    const vote = SYMBOL_TO_VOTE[char];
    if (vote) {
      votes.push(vote);
    } else {
      invalid.add(char);
    }
  }

  return { votes, invalidSymbols: [...invalid] };
}

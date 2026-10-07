/**
 * 議員別表決結果（議案ごとの議員の賛否）の共通定義。
 * DB の enum member_vote_type と値をそろえること。
 * 区分と表示は、桑名市議会「議員別表決結果」の凡例に合わせている。
 */

export type MemberVoteType =
  | "for"
  | "against"
  | "absent"
  | "left"
  | "recused"
  | "chair";

/** 表示・集計の順序 */
export const MEMBER_VOTE_TYPES: readonly MemberVoteType[] = [
  "for",
  "against",
  "absent",
  "left",
  "recused",
  "chair",
];

export const MEMBER_VOTE_LABELS: Record<MemberVoteType, string> = {
  for: "賛成",
  // 凡例では空欄。起立しなかったことを表し、市の資料の表現に合わせる
  against: "賛成でない",
  absent: "欠席",
  left: "退席",
  recused: "除斥",
  chair: "議長",
};

/** 管理画面の「記号でまとめて入力」で使う記号（市の PDF の空欄は「×」で入力する） */
export const MEMBER_VOTE_SYMBOLS: Record<MemberVoteType, string> = {
  for: "○",
  against: "×",
  absent: "欠",
  left: "退",
  recused: "除",
  chair: "－",
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
  退: "left",
  除: "recused",
  "－": "chair",
  "-": "chair",
  ー: "chair",
  "―": "chair",
  "—": "chair",
  "‐": "chair",
};

export interface ParsedVoteSymbols {
  /** 記号の並び順どおりの賛否 */
  votes: MemberVoteType[];
  /** 解釈できなかった文字（重複なし、出現順） */
  invalidSymbols: string[];
}

/**
 * 「○ × 欠 退 除 －」のような記号の並びを賛否の配列に変換する。
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

/**
 * トップページの「最近更新された議案」に出す議案を選ぶ。
 *
 * 議案本体（ステータス等）と解説コンテンツは別テーブルで、それぞれに
 * updated_at を持つ。解説だけを書き直した場合も「更新」として扱いたいので、
 * 両者の新しい方を最終更新日時とする。
 */

interface RecentlyUpdatableBill {
  updated_at: string;
  bill_content?: { updated_at: string } | null;
}

/** 議案の最終更新日時（ミリ秒）。議案本体と解説コンテンツの新しい方。 */
export function getBillLastUpdatedAt(bill: RecentlyUpdatableBill): number {
  const billUpdatedAt = Date.parse(bill.updated_at);
  const contentUpdatedAt = bill.bill_content
    ? Date.parse(bill.bill_content.updated_at)
    : Number.NaN;

  // 日時が壊れている側は無視する。両方壊れていれば最も古い扱い。
  const candidates = [billUpdatedAt, contentUpdatedAt].filter(
    (time) => !Number.isNaN(time)
  );
  return candidates.length > 0 ? Math.max(...candidates) : 0;
}

/** 最終更新日時が新しい順に、先頭から limit 件を返す。元の配列は変更しない。 */
export function pickRecentlyUpdatedBills<T extends RecentlyUpdatableBill>(
  bills: readonly T[],
  limit: number
): T[] {
  if (limit <= 0) return [];
  return [...bills]
    .sort((a, b) => getBillLastUpdatedAt(b) - getBillLastUpdatedAt(a))
    .slice(0, limit);
}

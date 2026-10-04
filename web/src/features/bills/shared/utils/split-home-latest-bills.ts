import {
  getBillLastUpdatedAt,
  pickRecentlyUpdatedBills,
} from "./pick-recently-updated-bills";

interface HomeLatestBill {
  id: string;
  diet_session_id: string | null;
  updated_at: string;
  bill_content?: { updated_at: string } | null;
}

/**
 * トップページの「最近更新された議案」を、大きく出す議案と、
 * 今の会期のその他の議案（小さく出す）に分ける。
 *
 * 今の会期があるとき（過去の会期の議案はアーカイブ側に出すので含めない）:
 * - featured: 今の会期の議案のうち、最終更新が新しい順に featuredCount 件
 * - sessionBills: 今の会期の議案のうち featured に入らなかったもの全件（最終更新が新しい順）
 * 今の会期が無いとき: featured は全議案から選び、sessionBills は空。
 */
export function splitHomeLatestBills<T extends HomeLatestBill>(
  bills: readonly T[],
  activeSessionId: string | null,
  featuredCount: number
): { featured: T[]; sessionBills: T[] } {
  if (activeSessionId === null) {
    return {
      featured: pickRecentlyUpdatedBills(bills, featuredCount),
      sessionBills: [],
    };
  }

  const sorted = bills
    .filter((bill) => bill.diet_session_id === activeSessionId)
    .sort((a, b) => getBillLastUpdatedAt(b) - getBillLastUpdatedAt(a));
  const count = Math.max(featuredCount, 0);

  return {
    featured: sorted.slice(0, count),
    sessionBills: sorted.slice(count),
  };
}

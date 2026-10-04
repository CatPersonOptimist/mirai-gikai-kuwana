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
 * - featured: 会期を問わず、最終更新が新しい順に featuredCount 件
 * - sessionBills: 今の会期の議案のうち featured に入らなかったもの全件（最終更新が新しい順）
 * 今の会期が無いときは sessionBills は空。
 */
export function splitHomeLatestBills<T extends HomeLatestBill>(
  bills: readonly T[],
  activeSessionId: string | null,
  featuredCount: number
): { featured: T[]; sessionBills: T[] } {
  const featured = pickRecentlyUpdatedBills(bills, featuredCount);
  if (activeSessionId === null) {
    return { featured, sessionBills: [] };
  }

  const featuredIds = new Set(featured.map((bill) => bill.id));
  const sessionBills = bills
    .filter(
      (bill) =>
        bill.diet_session_id === activeSessionId && !featuredIds.has(bill.id)
    )
    .sort((a, b) => getBillLastUpdatedAt(b) - getBillLastUpdatedAt(a));

  return { featured, sessionBills };
}

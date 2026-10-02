import type { BillWithContent } from "../../shared/types";
import { pickRecentlyUpdatedBills } from "../../shared/utils/pick-recently-updated-bills";
import { getBills } from "./get-bills";

/** トップページの「最近更新された議案」に出す件数。 */
export const RECENTLY_UPDATED_BILLS_LIMIT = 5;

/**
 * 最近更新された公開済み議案を取得する。
 * 会期では絞らない（閉会中でも直近の更新を案内する）。
 * 公開済み議案一覧（getBills）のキャッシュを使うので、クエリは増えない。
 */
export async function getRecentlyUpdatedBills(): Promise<BillWithContent[]> {
  const bills = await getBills();
  return pickRecentlyUpdatedBills(bills, RECENTLY_UPDATED_BILLS_LIMIT);
}

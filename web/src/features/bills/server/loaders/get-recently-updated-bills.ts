import { getActiveDietSession } from "@/features/diet-sessions/server/loaders/get-active-diet-session";
import type { BillWithContent } from "../../shared/types";
import { splitHomeLatestBills } from "../../shared/utils/split-home-latest-bills";
import { getBills } from "./get-bills";

/** トップページの「最近更新された議案」で大きく出す件数。 */
export const RECENTLY_UPDATED_BILLS_LIMIT = 3;

export interface HomeLatestBills {
  /** 最終更新が新しい議案（大きく表示） */
  featured: BillWithContent[];
  /** 今の会期のその他の議案（小さく表示） */
  sessionBills: BillWithContent[];
  /** 今の会期の名前（会期が無ければ null） */
  sessionName: string | null;
}

/**
 * トップページの「最近更新された議案」に出す議案を取得する（今の会期の議案のみ）。
 * 公開済み議案一覧（getBills）と会期のキャッシュを使うので、クエリは増えない。
 */
export async function getRecentlyUpdatedBills(): Promise<HomeLatestBills> {
  const [bills, activeSession] = await Promise.all([
    getBills(),
    getActiveDietSession(),
  ]);
  const { featured, sessionBills } = splitHomeLatestBills(
    bills,
    activeSession?.id ?? null,
    RECENTLY_UPDATED_BILLS_LIMIT
  );
  return { featured, sessionBills, sessionName: activeSession?.name ?? null };
}

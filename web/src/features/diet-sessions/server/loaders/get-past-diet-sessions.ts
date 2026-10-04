import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { DietSession } from "../../shared/types";
import { findPastDietSessions } from "../repositories/diet-session-repository";
import { getActiveDietSession } from "./get-active-diet-session";

/**
 * 過去の会期の一覧を取得する（開始日が新しい順）。
 * アクティブな会期があればそれより前に始まった会期、無ければすべての会期を返す。
 */
export async function getPastDietSessions(): Promise<DietSession[]> {
  const activeSession = await getActiveDietSession();
  return _getCachedPastDietSessions(activeSession?.start_date ?? null);
}

const _getCachedPastDietSessions = unstable_cache(
  async (activeStartDate: string | null): Promise<DietSession[]> =>
    findPastDietSessions(activeStartDate),
  ["past-diet-sessions"],
  {
    revalidate: 3600, // 1時間
    tags: [CACHE_TAGS.DIET_SESSIONS],
  }
);

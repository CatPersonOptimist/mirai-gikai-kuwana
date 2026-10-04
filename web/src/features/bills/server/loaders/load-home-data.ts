import { getBillsByFeaturedTags } from "@/features/bills/server/loaders/get-bills-by-featured-tags";
import { getPastDietSessions } from "@/features/diet-sessions/server/loaders/get-past-diet-sessions";
import { getFeaturedBills } from "./get-featured-bills";
import { getInterviewOpenBills } from "./get-interview-open-bills";
import { getPreviousSessionBills } from "./get-previous-session-bills";
import { getRecentlyUpdatedBills } from "./get-recently-updated-bills";

/**
 * トップページ用のデータを並列取得する
 * BFF (Backend For Frontend) パターン
 */
export async function loadHomeData() {
  const [
    featuredBills,
    billsByTag,
    interviewOpenBills,
    recentlyUpdatedBills,
    previousSessionData,
    pastDietSessions,
  ] = await Promise.all([
    getFeaturedBills(),
    getBillsByFeaturedTags(),
    getInterviewOpenBills(),
    getRecentlyUpdatedBills(),
    getPreviousSessionBills(),
    getPastDietSessions(),
  ]);

  return {
    billsByTag,
    featuredBills,
    interviewOpenBills,
    recentlyUpdatedBills,
    previousSessionData,
    pastDietSessions,
  };
}

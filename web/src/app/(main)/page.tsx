import { Container } from "@/components/layouts/container";
import { About } from "@/components/top/about";
import { OperatorInfo } from "@/components/top/operator-info";
import { getDifficultyLevel } from "@/features/bill-difficulty/server/loaders/get-difficulty-level";
import { BillDisclaimer } from "@/features/bills/client/components/bill-detail/bill-disclaimer";
import { BillSearchOverlay } from "@/features/bills/client/components/bill-search-overlay";
import { BillsByTagSection } from "@/features/bills/server/components/bills-by-tag-section";
import { CategoryTabs } from "@/features/bills/server/components/category-tabs";
import { FeaturedBillSection } from "@/features/bills/server/components/featured-bill-section";
import { InterviewOpenBillSection } from "@/features/bills/server/components/interview-open-bill-section";
import { PreviousSessionSection } from "@/features/bills/server/components/previous-session-section";
import { RecentlyUpdatedBillSection } from "@/features/bills/server/components/recently-updated-bill-section";
import { getFeaturedTags } from "@/features/bills/server/loaders/get-featured-tags";
import { getSuggestableBills } from "@/features/bills/server/loaders/get-suggestable-bills";
import { loadHomeData } from "@/features/bills/server/loaders/load-home-data";
import type { BillWithContent } from "@/features/bills/shared/types";
import { chatBillName } from "@/features/bills/shared/utils/chat-bill-name";
import { pickHomeSections } from "@/features/bills/shared/utils/pick-home-sections";
import { countTagChipItems } from "@/features/bills/shared/utils/tag-chip-items";
import { HomeChatClient } from "@/features/chat/client/components/home-chat-client";
import { CurrentDietSession } from "@/features/diet-sessions/client/components/current-diet-session";
import { PastSessionLinks } from "@/features/diet-sessions/server/components/past-session-links";
import { getCurrentDietSession } from "@/features/diet-sessions/server/loaders/get-current-diet-session";
import { getLatestClosedDietSession } from "@/features/diet-sessions/server/loaders/get-latest-closed-diet-session";
import { groupSessionsByYear } from "@/features/diet-sessions/shared/utils/group-sessions-by-year";
import { getJapanTime } from "@/lib/utils/date";

/** カテゴリタブの「注目」から飛ばす先。 */
const FEATURED_ANCHOR = "featured";

export default async function Home() {
  const japanTime = getJapanTime();
  // ゆくゆくタグ機能がマージされたらBFFに統合する
  const [
    {
      billsByTag,
      featuredBills,
      interviewOpenBills,
      recentlyUpdatedBills,
      previousSessionData,
      pastDietSessions,
    },
    currentSession,
    latestClosedSession,
    currentDifficulty,
    suggestableBills,
    featuredTags,
  ] = await Promise.all([
    loadHomeData(),
    getCurrentDietSession(japanTime),
    getLatestClosedDietSession(japanTime),
    getDifficultyLevel(),
    getSuggestableBills(),
    getFeaturedTags(),
  ]);

  const inSession = currentSession !== null;

  const { tagGroups, shownBills, featuredBillIds } = pickHomeSections({
    billsByTag,
    featuredBills,
    interviewOpenBills,
    // 大きいカードと、今の会期の小さいカードの両方を「画面に出ている議案」として扱う
    recentlyUpdatedBills: [
      ...recentlyUpdatedBills.featured,
      ...recentlyUpdatedBills.sessionBills,
    ],
    inSession,
  });

  // モーダルの件数は全会期の公開議案から数える。チップの飛び先が /bills で、
  // あちらも全会期を数えるため、押す前と後で数字が変わらない。
  // 候補用に取得済みの配列をそのまま使うので、集計のためのクエリは増えない。
  const searchTagChips = countTagChipItems(featuredTags, suggestableBills);

  // 直前の会期は上でカード表示するので、リンク一覧からは外す
  const pastSessionLinkExcludeIds = previousSessionData
    ? [previousSessionData.session.id]
    : [];
  const hasPastSessionLinks =
    groupSessionsByYear(pastDietSessions, pastSessionLinkExcludeIds).length > 0;

  const toBillChatContext = (bill: BillWithContent) => {
    return {
      name: chatBillName(bill),
      summary: bill.bill_content?.summary,
      tags: bill.tags?.map((tag) => tag.label) || [],
      isFeatured: featuredBillIds.has(bill.id),
    };
  };

  return (
    <>
      {/* 本日の議会セクション */}
      <CurrentDietSession
        session={currentSession}
        closedSession={latestClosedSession}
        now={japanTime}
      />

      <Container>
        <div className="pt-4">
          <CategoryTabs
            billsByTag={billsByTag}
            featuredAnchor={inSession ? FEATURED_ANCHOR : undefined}
          />
        </div>
        {/* 検索の入口。キーワードとテーマの両方をモーダルに並べる */}
        <div className="flex justify-end pt-2">
          <BillSearchOverlay tags={searchTagChips} bills={suggestableBills} />
        </div>
      </Container>

      {/* 議案一覧セクション */}
      <Container className="">
        <div className="py-10">
          <main className="flex flex-col gap-16">
            {/*
              AIインタビュー受付中セクション。意見を出せる議案を最初に見せる。
              会期では絞らない（閉会中でも受付中なら案内する）ため、注目と違って
              inSession で出し分けない。
            */}
            <InterviewOpenBillSection bills={interviewOpenBills} />

            {/* 最近更新された議案（最新3件は大きく、今の会期のその他の議案は小さく全件） */}
            <RecentlyUpdatedBillSection latestBills={recentlyUpdatedBills} />

            {/*
              注目の議案は会期中だけ出す。閉会中に「注目」を掲げても、審議が
              動いていない期間の情報を強調することになる。
              なお getFeaturedBills はアクティブ会期が無いと全件スコープに
              落ちるので、データ側だけでは空にならない。
            */}
            {inSession && (
              <section id={FEATURED_ANCHOR}>
                <FeaturedBillSection bills={featuredBills} />
              </section>
            )}

            {/* タグ別議案一覧セクション（タグに紐づく議案を全件出す） */}
            <BillsByTagSection billsByTag={tagGroups} />
          </main>
        </div>
      </Container>

      {/* 過去の会期（Archive）：直前の会期の議案カードと、ほかの会期へのリンク */}
      {(previousSessionData || hasPastSessionLinks) && (
        <div className="bg-mirai-surface-muted py-10">
          <Container className="flex flex-col gap-10">
            {previousSessionData && (
              <PreviousSessionSection
                session={previousSessionData.session}
                bills={previousSessionData.bills}
                totalBillCount={previousSessionData.totalBillCount}
              />
            )}
            <PastSessionLinks
              sessions={pastDietSessions}
              excludeSessionIds={pastSessionLinkExcludeIds}
              heading={previousSessionData ? "ほかの会期" : "過去の会期"}
            />
          </Container>
        </div>
      )}

      <Container>
        {/* みらい議会とは セクション */}
        <About />

        {/* 運営について セクション */}
        <OperatorInfo />

        {/* 免責事項 */}
        <BillDisclaimer />
      </Container>

      {/* チャット機能 */}
      <HomeChatClient
        currentDifficulty={currentDifficulty}
        bills={shownBills.map(toBillChatContext)}
      />
    </>
  );
}

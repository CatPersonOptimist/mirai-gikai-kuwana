import {
  MEMBER_VOTE_TYPES,
  type MemberVoteType,
} from "@mirai-gikai/shared/member-votes";

/** 賛否の区分ごとの件数（全区分を0で埋める） */
export function countByVoteType(
  items: readonly { vote: MemberVoteType }[]
): Record<MemberVoteType, number> {
  const counts = Object.fromEntries(
    MEMBER_VOTE_TYPES.map((type) => [type, 0])
  ) as Record<MemberVoteType, number>;
  for (const item of items) {
    counts[item.vote] += 1;
  }
  return counts;
}

/**
 * 議案の賛否を区分ごとにまとめる。
 * 区分は賛成・賛成でない・欠席・退席・除斥・議長の順、各区分の中は議員の表示順。
 * 該当者のいない区分は含めない。
 */
export function groupVotesByType<
  T extends {
    vote: MemberVoteType;
    member: { display_order: number; name: string };
  },
>(votes: readonly T[]): { type: MemberVoteType; items: T[] }[] {
  return MEMBER_VOTE_TYPES.map((type) => ({
    type,
    items: votes
      .filter((v) => v.vote === type)
      .sort(
        (a, b) =>
          a.member.display_order - b.member.display_order ||
          a.member.name.localeCompare(b.member.name, "ja")
      ),
  })).filter((group) => group.items.length > 0);
}

/** 賛否の履歴を、議案の提出日が新しい順に並べる（提出日なしは最後）。 */
export function sortHistoryBySubmittedDate<
  T extends { bill: { submitted_date: string | null; name: string } },
>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const da = a.bill.submitted_date ?? "";
    const db = b.bill.submitted_date ?? "";
    if (da !== db) return da < db ? 1 : -1;
    return a.bill.name.localeCompare(b.bill.name, "ja");
  });
}

import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { BillMemberVote } from "../../shared/types";
import { findVotesWithMembersByBillId } from "../repositories/council-member-repository";

/** 議案の議員別の賛否を取得する（未登録なら空配列） */
export async function getBillMemberVotes(
  billId: string
): Promise<BillMemberVote[]> {
  return _getCachedBillMemberVotes(billId);
}

const _getCachedBillMemberVotes = unstable_cache(
  async (billId: string): Promise<BillMemberVote[]> => {
    const rows = await findVotesWithMembersByBillId(billId);
    return (rows ?? []).map((row) => ({ vote: row.vote, member: row.member }));
  },
  ["bill-member-votes"],
  {
    revalidate: 600, // 10分（600秒）
    tags: [CACHE_TAGS.BILLS],
  }
);

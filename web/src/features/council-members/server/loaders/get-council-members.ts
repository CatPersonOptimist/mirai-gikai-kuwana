import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { CouncilMember, MemberVoteHistoryItem } from "../../shared/types";
import { sortHistoryBySubmittedDate } from "../../shared/utils/group-member-votes";
import {
  findAllCouncilMembers,
  findCouncilMemberById,
  findPublishedVotesByMemberId,
} from "../repositories/council-member-repository";

const CACHE_OPTIONS = {
  revalidate: 600, // 10分（600秒）
  tags: [CACHE_TAGS.BILLS],
};

/** 議員の一覧（表示順） */
export const getCouncilMembers = unstable_cache(
  async (): Promise<CouncilMember[]> => (await findAllCouncilMembers()) ?? [],
  ["council-members-list"],
  CACHE_OPTIONS
);

/** 議員1人（見つからなければ null） */
export const getCouncilMember = unstable_cache(
  async (id: string): Promise<CouncilMember | null> =>
    findCouncilMemberById(id),
  ["council-member"],
  CACHE_OPTIONS
);

/** 議員の賛否の履歴（公開中の議案のみ、提出日が新しい順） */
export const getMemberVoteHistory = unstable_cache(
  async (memberId: string): Promise<MemberVoteHistoryItem[]> => {
    const rows = await findPublishedVotesByMemberId(memberId);
    const items: MemberVoteHistoryItem[] = (rows ?? []).map((row) => {
      const contents = row.bill.bill_contents ?? [];
      const title =
        contents.find((c) => c.difficulty_level === "normal")?.title ??
        contents[0]?.title ??
        null;
      return {
        vote: row.vote,
        bill: {
          id: row.bill.id,
          name: row.bill.name,
          title,
          submitted_date: row.bill.submitted_date,
          diet_session_name: row.bill.diet_session?.name ?? null,
        },
      };
    });
    return sortHistoryBySubmittedDate(items);
  },
  ["member-vote-history"],
  CACHE_OPTIONS
);

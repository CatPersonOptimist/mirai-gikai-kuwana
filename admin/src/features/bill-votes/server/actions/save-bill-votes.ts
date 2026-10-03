"use server";

import type { MemberVoteType } from "@mirai-gikai/shared/member-votes";
import { MEMBER_VOTE_TYPES } from "@mirai-gikai/shared/member-votes";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import {
  buildVoteChanges,
  type VoteSelection,
} from "../../shared/utils/build-vote-changes";
import {
  deleteBillVoteRecords,
  findVotesByBillId,
  upsertBillVoteRecords,
} from "../repositories/bill-vote-repository";

/** 議案の議員別の賛否を保存する（未入力にした議員の登録済み賛否は削除する）。 */
export async function saveBillVotes(
  billId: string,
  selections: VoteSelection[]
) {
  try {
    await requireAdmin();

    const invalid = selections.find(
      (s) => s.vote !== null && !MEMBER_VOTE_TYPES.includes(s.vote)
    );
    if (invalid) {
      return { error: "賛否の値が正しくありません" };
    }

    const existingRows = await findVotesByBillId(billId);
    const existing = new Map<string, MemberVoteType>(
      (existingRows ?? []).map((row) => [row.member_id, row.vote])
    );

    const { upserts, deleteMemberIds } = buildVoteChanges(selections, existing);
    await upsertBillVoteRecords(billId, upserts);
    await deleteBillVoteRecords(billId, deleteMemberIds);

    await invalidateWebCache([WEB_CACHE_TAGS.BILLS]);
    return {
      data: { saved: upserts.length, deleted: deleteMemberIds.length },
    };
  } catch (error) {
    console.error("Save bill votes error:", error);
    return {
      error: getErrorMessage(error, "賛否の保存中にエラーが発生しました"),
    };
  }
}

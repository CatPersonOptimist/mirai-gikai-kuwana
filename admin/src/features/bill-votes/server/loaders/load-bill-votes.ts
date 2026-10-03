import type { MemberVoteType } from "@mirai-gikai/shared/member-votes";
import { findAllCouncilMembers } from "@/features/council-members/server/repositories/council-member-repository";
import type { CouncilMember } from "@/features/council-members/shared/types";
import { findVotesByBillId } from "../repositories/bill-vote-repository";

export interface BillVotesData {
  /** 入力対象の議員（現職と、この議案に賛否が登録済みの元職）。表示順。 */
  members: CouncilMember[];
  /** 登録済みの賛否（議員ID → 賛否） */
  votes: Record<string, MemberVoteType>;
}

export async function loadBillVotes(billId: string): Promise<BillVotesData> {
  const [allMembers, voteRows] = await Promise.all([
    findAllCouncilMembers(),
    findVotesByBillId(billId),
  ]);

  const votes: Record<string, MemberVoteType> = {};
  for (const row of voteRows ?? []) {
    votes[row.member_id] = row.vote;
  }

  const members = (allMembers ?? []).filter(
    (member) => member.is_active || votes[member.id] !== undefined
  );

  return { members, votes };
}

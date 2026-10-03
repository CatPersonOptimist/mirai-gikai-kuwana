import type { MemberVoteType } from "@mirai-gikai/shared/member-votes";

export interface VoteSelection {
  memberId: string;
  /** null は「未入力」（登録済みの賛否があれば削除する） */
  vote: MemberVoteType | null;
}

export interface VoteChanges {
  upserts: { member_id: string; vote: MemberVoteType }[];
  deleteMemberIds: string[];
}

/**
 * 画面で選んだ賛否と登録済みの賛否から、保存・削除する内容を求める。
 * 変更のない議員は含めない。同じ議員が複数回あれば後のものを優先する。
 */
export function buildVoteChanges(
  selections: readonly VoteSelection[],
  existing: ReadonlyMap<string, MemberVoteType>
): VoteChanges {
  const latest = new Map<string, MemberVoteType | null>();
  for (const selection of selections) {
    latest.set(selection.memberId, selection.vote);
  }

  const upserts: VoteChanges["upserts"] = [];
  const deleteMemberIds: string[] = [];

  for (const [memberId, vote] of latest) {
    const current = existing.get(memberId);
    if (vote === null) {
      if (current !== undefined) deleteMemberIds.push(memberId);
    } else if (vote !== current) {
      upserts.push({ member_id: memberId, vote });
    }
  }

  return { upserts, deleteMemberIds };
}

/**
 * 記号から読み取った賛否を、表示順に並んだ議員へ先頭から割り当てる。
 * 人数が合わないときは割り当てずに理由を返す（ずれたまま保存するのを防ぐ）。
 */
export function assignVotesInOrder(
  memberIds: readonly string[],
  votes: readonly MemberVoteType[]
): { ok: true; selections: VoteSelection[] } | { ok: false; reason: string } {
  if (votes.length !== memberIds.length) {
    return {
      ok: false,
      reason: `記号の数（${votes.length}）と議員の人数（${memberIds.length}）が一致しません`,
    };
  }
  return {
    ok: true,
    selections: memberIds.map((memberId, i) => ({ memberId, vote: votes[i] })),
  };
}

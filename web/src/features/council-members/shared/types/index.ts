import type { MemberVoteType } from "@mirai-gikai/shared/member-votes";

export type CouncilMember = {
  id: string;
  name: string;
  faction: string | null;
  is_active: boolean;
  display_order: number;
};

/** 議案ごとの議員の賛否（議員情報つき） */
export type BillMemberVote = {
  member: CouncilMember;
  vote: MemberVoteType;
};

/** 議員ごとの賛否の履歴1件（公開中の議案のみ） */
export type MemberVoteHistoryItem = {
  vote: MemberVoteType;
  bill: {
    id: string;
    name: string;
    title: string | null;
    submitted_date: string | null;
    diet_session_name: string | null;
  };
};

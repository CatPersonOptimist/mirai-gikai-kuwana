import {
  MEMBER_VOTE_LABELS,
  type MemberVoteType,
} from "@mirai-gikai/shared/member-votes";

/** 区分ごとの見た目。賛否で良し悪しの印象を与えないよう、強い色は使わない。 */
const VOTE_BADGE_CLASS: Record<MemberVoteType, string> = {
  for: "bg-mirai-brand-mint text-mirai-brand-teal-deep",
  against: "border border-mirai-text bg-white text-mirai-text",
  absent: "bg-mirai-surface-gray text-mirai-text-secondary",
  not_voting: "bg-mirai-surface-gray text-mirai-text-secondary",
};

export function VoteBadge({ vote }: { vote: MemberVoteType }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-0.5 text-xs font-bold ${VOTE_BADGE_CLASS[vote]}`}
    >
      {MEMBER_VOTE_LABELS[vote]}
    </span>
  );
}

import {
  MEMBER_VOTE_LABELS,
  MEMBER_VOTE_TYPES,
} from "@mirai-gikai/shared/member-votes";
import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import {
  countByVoteType,
  groupVotesByType,
} from "../../shared/utils/group-member-votes";
import { getBillMemberVotes } from "../loaders/get-bill-member-votes";
import { VoteBadge } from "./vote-badge";

interface BillMemberVotesSectionProps {
  billId: string;
}

/**
 * 議案ページの「議員の賛否」。
 * 賛否が1件も登録されていない議案では何も表示しない（ページの見た目を変えない）。
 */
export async function BillMemberVotesSection({
  billId,
}: BillMemberVotesSectionProps) {
  const votes = await getBillMemberVotes(billId);
  if (votes.length === 0) {
    return null;
  }

  const counts = countByVoteType(votes);
  const groups = groupVotesByType(votes);

  return (
    // 余白もこの中に持つ（未登録の議案では余白ごと出さず、見た目を変えないため）
    <section className="my-8 flex flex-col gap-4">
      <h2 className="text-[22px] font-bold">🗳️ 議員の賛否</h2>

      <div className="rounded-2xl bg-white px-5 py-6">
        {/* 集計 */}
        <p className="mb-5 text-[15px] font-bold text-mirai-text">
          {MEMBER_VOTE_TYPES.filter((type) => counts[type] > 0)
            .map((type) => `${MEMBER_VOTE_LABELS[type]} ${counts[type]}人`)
            .join("・")}
        </p>

        {/* 区分ごとの議員 */}
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.type} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <VoteBadge vote={group.type} />
                <span className="text-sm text-mirai-text-secondary">
                  {group.items.length}人
                </span>
              </div>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {group.items.map(({ member }) => (
                  <li key={member.id}>
                    <Link
                      href={routes.memberDetail(member.id) as Route}
                      className="text-[15px] text-mirai-text underline underline-offset-2 hover:opacity-70"
                    >
                      {member.name}
                    </Link>
                    {member.faction && (
                      <span className="ml-1 text-xs text-mirai-text-secondary">
                        （{member.faction}）
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-mirai-text-secondary">
          出典：桑名市議会「議員別表決結果」。議員の名前を押すと、その議員のこれまでの賛否を見られます。
          <Link
            href={routes.members() as Route}
            className="ml-1 underline underline-offset-2 hover:opacity-70"
          >
            議員の一覧
          </Link>
        </p>
      </div>
    </section>
  );
}

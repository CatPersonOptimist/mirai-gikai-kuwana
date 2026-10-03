import {
  MEMBER_VOTE_LABELS,
  MEMBER_VOTE_TYPES,
} from "@mirai-gikai/shared/member-votes";
import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { formatDateWithDots } from "@/lib/utils/date";
import type { CouncilMember, MemberVoteHistoryItem } from "../../shared/types";
import { countByVoteType } from "../../shared/utils/group-member-votes";
import { VoteBadge } from "./vote-badge";

interface MemberVoteHistoryProps {
  member: CouncilMember;
  history: MemberVoteHistoryItem[];
}

export function MemberVoteHistory({ member, history }: MemberVoteHistoryProps) {
  const counts = countByVoteType(history);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-primary-accent">
          議員のこれまでの賛否
        </p>
        <h1 className="text-3xl font-bold">{member.name}</h1>
        <p className="text-[15px] text-mirai-text-secondary">
          {[member.faction, member.is_active ? null : "元職"]
            .filter(Boolean)
            .join("・")}
        </p>
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl bg-white px-5 py-6 text-[15px]">
          このサイトに掲載している議案への賛否は、まだ登録されていません。
        </p>
      ) : (
        <>
          <p className="text-[15px] font-bold">
            {history.length}件の議案：
            {MEMBER_VOTE_TYPES.filter((type) => counts[type] > 0)
              .map((type) => `${MEMBER_VOTE_LABELS[type]} ${counts[type]}`)
              .join("・")}
          </p>

          <ul className="flex flex-col gap-3">
            {history.map((item) => (
              <li key={item.bill.id}>
                <Link
                  href={routes.billDetail(item.bill.id) as Route}
                  className="flex items-start gap-3 rounded-2xl bg-white px-5 py-4 transition-opacity hover:opacity-80"
                >
                  <VoteBadge vote={item.vote} />
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-[15px] font-bold leading-snug">
                      {item.bill.title ?? item.bill.name}
                    </span>
                    {item.bill.title && (
                      <span className="text-xs text-mirai-text-secondary">
                        {item.bill.name}
                      </span>
                    )}
                    <span className="text-xs text-mirai-text-secondary">
                      {[
                        item.bill.diet_session_name,
                        item.bill.submitted_date
                          ? `${formatDateWithDots(item.bill.submitted_date)} 提出`
                          : null,
                      ]
                        .filter(Boolean)
                        .join("・")}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="text-xs leading-relaxed text-mirai-text-secondary">
        出典：桑名市議会「議員別表決結果」。このサイトに掲載している議案についての賛否のみを表示しています。
      </p>
    </div>
  );
}

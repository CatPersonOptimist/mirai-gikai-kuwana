import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { CouncilMember } from "../../shared/types";

interface CouncilMemberDirectoryProps {
  members: CouncilMember[];
}

function MemberLinks({ members }: { members: CouncilMember[] }) {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {members.map((member) => (
        <li key={member.id}>
          <Link
            href={routes.memberDetail(member.id) as Route}
            className="flex items-baseline gap-2 rounded-xl bg-white px-4 py-3 transition-opacity hover:opacity-80"
          >
            <span className="text-[15px] font-bold">{member.name}</span>
            {member.faction && (
              <span className="text-xs text-mirai-text-secondary">
                {member.faction}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CouncilMemberDirectory({
  members,
}: CouncilMemberDirectoryProps) {
  const active = members.filter((member) => member.is_active);
  const former = members.filter((member) => !member.is_active);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-primary-accent">議員の賛否</p>
        <h1 className="text-3xl font-bold">桑名市議会の議員</h1>
        <p className="text-[15px] text-mirai-text-secondary">
          議員の名前を押すと、このサイトに掲載している議案への賛否を見られます。
        </p>
      </div>

      {members.length === 0 ? (
        <p className="rounded-2xl bg-white px-5 py-6 text-[15px]">
          議員の情報はまだ登録されていません。
        </p>
      ) : (
        <>
          {active.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-bold">現職</h2>
              <MemberLinks members={active} />
            </section>
          )}
          {former.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-bold">元職</h2>
              <MemberLinks members={former} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import type { DietSession } from "../../shared/types";
import {
  formatYearWithEra,
  groupSessionsByYear,
} from "../../shared/utils/group-sessions-by-year";

interface PastSessionLinksProps {
  sessions: DietSession[];
  /** 上の「直前の会期」で既に出している会期（重複して並べない） */
  excludeSessionIds?: string[];
  /** 見出し。直前の会期のカードの下に置くときは「ほかの会期」 */
  heading: string;
}

function SessionLinkList({ sessions }: { sessions: DietSession[] }) {
  return (
    <ul className="flex flex-col">
      {sessions.map((session) =>
        session.slug ? (
          <li key={session.id}>
            <Link
              href={routes.kokkaiSessionBills(session.slug) as Route}
              className="group flex items-center justify-between gap-3 border-b border-mirai-border-light py-3 text-[15px] font-bold text-mirai-text"
            >
              <span>{session.name}</span>
              <ChevronRight className="h-5 w-5 shrink-0 text-mirai-text-secondary transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ) : null
      )}
    </ul>
  );
}

/**
 * 過去の会期へのリンク一覧。
 * 一番新しい年は開いて並べ、それより前の年は折りたたむ（会期が増えても長くならないように）。
 */
export function PastSessionLinks({
  sessions,
  excludeSessionIds = [],
  heading,
}: PastSessionLinksProps) {
  const groups = groupSessionsByYear(sessions, excludeSessionIds);
  if (groups.length === 0) {
    return null;
  }

  const [latest, ...older] = groups;

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-mirai-text">{heading}</h3>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold text-mirai-text-secondary">
          {formatYearWithEra(latest.year)}
        </p>
        <SessionLinkList sessions={latest.sessions} />
      </div>

      {older.map((group) => (
        <details key={group.year} className="group/year">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 py-2 text-sm font-bold text-primary-accent [&::-webkit-details-marker]:hidden">
            <ChevronRight className="h-4 w-4 transition-transform group-open/year:rotate-90" />
            {formatYearWithEra(group.year)}の会期を見る
            <span className="font-medium text-mirai-text-secondary">
              （{group.sessions.length}件）
            </span>
          </summary>
          <SessionLinkList sessions={group.sessions} />
        </details>
      ))}
    </section>
  );
}

import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { BillCard } from "../../client/components/bill-list/bill-card";
import { CompactBillCard } from "../../client/components/bill-list/compact-bill-card";
import type { HomeLatestBills } from "../loaders/get-recently-updated-bills";

interface RecentlyUpdatedBillSectionProps {
  latestBills: HomeLatestBills;
}

export function RecentlyUpdatedBillSection({
  latestBills: { featured, sessionBills, sessionName },
}: RecentlyUpdatedBillSectionProps) {
  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      {/* セクションヘッダー */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[22px] font-bold text-mirai-text leading-[1.48]">
          最近更新された議案
        </h2>
        <p className="text-xs font-medium text-mirai-text-secondary leading-[1.67]">
          桑名市議会の議案を、更新が新しい順に表示しています
        </p>
      </div>

      {/* 最新の議案（大きいカード） */}
      <div className="flex flex-col gap-4">
        {featured.map((bill) => (
          <Link key={bill.id} href={routes.billDetail(bill.id) as Route}>
            <BillCard bill={bill} />
          </Link>
        ))}
      </div>

      {/* 今の会期のその他の議案（小さいカード） */}
      {sessionBills.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-mirai-text">
            {sessionName ? `${sessionName}のその他の議案` : "その他の議案"}
            <span className="ml-2 text-sm font-medium text-mirai-text-secondary">
              {sessionBills.length}件
            </span>
          </h3>
          {sessionBills.map((bill) => (
            <Link key={bill.id} href={routes.billDetail(bill.id) as Route}>
              <CompactBillCard bill={bill} className="max-w-[634px]" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

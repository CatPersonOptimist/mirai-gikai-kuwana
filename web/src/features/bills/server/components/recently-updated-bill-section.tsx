import type { Route } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { BillCard } from "../../client/components/bill-list/bill-card";
import type { BillWithContent } from "../../shared/types";

interface RecentlyUpdatedBillSectionProps {
  bills: BillWithContent[];
}

export function RecentlyUpdatedBillSection({
  bills,
}: RecentlyUpdatedBillSectionProps) {
  if (bills.length === 0) {
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

      <div className="flex flex-col gap-4">
        {bills.map((bill) => (
          <Link key={bill.id} href={routes.billDetail(bill.id) as Route}>
            <BillCard bill={bill} />
          </Link>
        ))}
      </div>
    </section>
  );
}

import { BillVotesForm } from "@/features/bill-votes/client/components/bill-votes-form";
import { loadBillVotes } from "@/features/bill-votes/server/loaders/load-bill-votes";
import { getBillById } from "@/features/bills-edit/server/loaders/get-bill-by-id";

interface BillVotesPageProps {
  params: Promise<{ id: string }>;
}

export default async function BillVotesPage({ params }: BillVotesPageProps) {
  const { id } = await params;

  const [bill, { members, votes }] = await Promise.all([
    getBillById(id),
    loadBillVotes(id),
  ]);

  if (!bill) {
    throw new Error("議案が見つかりません");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">議員の賛否</h1>
      <p className="mb-6 text-gray-600">{bill.name}</p>
      <BillVotesForm billId={bill.id} members={members} initialVotes={votes} />
    </div>
  );
}

import { CouncilMemberBulkForm } from "@/features/council-members/client/components/council-member-bulk-form";
import { CouncilMemberList } from "@/features/council-members/server/components/council-member-list";
import { loadCouncilMembers } from "@/features/council-members/server/loaders/load-council-members";

export default async function CouncilMembersPage() {
  const members = await loadCouncilMembers();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">議員管理</h1>

      <section className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">議員をまとめて登録</h2>
        <CouncilMemberBulkForm />
      </section>

      <section className="rounded-lg border bg-white p-6">
        <CouncilMemberList members={members} />
      </section>
    </div>
  );
}

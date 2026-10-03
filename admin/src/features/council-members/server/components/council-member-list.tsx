import { CouncilMemberItem } from "../../client/components/council-member-item";
import type { CouncilMember } from "../../shared/types";

interface CouncilMemberListProps {
  members: CouncilMember[];
}

export function CouncilMemberList({ members }: CouncilMemberListProps) {
  const activeCount = members.filter((member) => member.is_active).length;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        議員一覧（現職 {activeCount}人／全 {members.length}人）
      </h2>
      {members.length === 0 ? (
        <p className="text-gray-500">議員が登録されていません</p>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <CouncilMemberItem key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}

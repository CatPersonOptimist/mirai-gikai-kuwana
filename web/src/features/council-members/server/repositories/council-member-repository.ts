import "server-only";
import { createAdminClient } from "@mirai-gikai/supabase";

const MEMBER_COLUMNS = "id, name, faction, is_active, display_order";

export async function findAllCouncilMembers() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("council_members")
    .select(MEMBER_COLUMNS)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch council members: ${error.message}`);
  }
  return data;
}

export async function findCouncilMemberById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("council_members")
    .select(MEMBER_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch council member: ${error.message}`);
  }
  return data;
}

/** 議案の議員別の賛否（議員情報つき） */
export async function findVotesWithMembersByBillId(billId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bill_member_votes")
    .select(`vote, member:council_members!inner(${MEMBER_COLUMNS})`)
    .eq("bill_id", billId);

  if (error) {
    throw new Error(`Failed to fetch bill member votes: ${error.message}`);
  }
  return data;
}

/** 議員の賛否の履歴（公開中の議案のみ） */
export async function findPublishedVotesByMemberId(memberId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bill_member_votes")
    .select(
      `
      vote,
      bill:bills!inner(
        id,
        name,
        submitted_date,
        publish_status,
        diet_session:diet_sessions(name),
        bill_contents(title, difficulty_level)
      )
    `
    )
    .eq("member_id", memberId)
    .eq("bills.publish_status", "published");

  if (error) {
    throw new Error(`Failed to fetch member votes: ${error.message}`);
  }
  return data;
}

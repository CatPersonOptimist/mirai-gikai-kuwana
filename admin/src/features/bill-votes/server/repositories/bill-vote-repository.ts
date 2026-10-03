import "server-only";

import type { MemberVoteType } from "@mirai-gikai/shared/member-votes";
import { createAdminClient } from "@mirai-gikai/supabase";

export async function findVotesByBillId(billId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bill_member_votes")
    .select("member_id, vote")
    .eq("bill_id", billId);

  if (error) {
    throw new Error(`賛否の取得に失敗しました: ${error.message}`);
  }

  return data;
}

export async function upsertBillVoteRecords(
  billId: string,
  rows: { member_id: string; vote: MemberVoteType }[]
) {
  if (rows.length === 0) return;
  const supabase = createAdminClient();
  const { error } = await supabase.from("bill_member_votes").upsert(
    rows.map((row) => ({ ...row, bill_id: billId })),
    { onConflict: "bill_id,member_id" }
  );

  if (error) {
    throw new Error(`賛否の保存に失敗しました: ${error.message}`);
  }
}

export async function deleteBillVoteRecords(
  billId: string,
  memberIds: string[]
) {
  if (memberIds.length === 0) return;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("bill_member_votes")
    .delete()
    .eq("bill_id", billId)
    .in("member_id", memberIds);

  if (error) {
    throw new Error(`賛否の削除に失敗しました: ${error.message}`);
  }
}

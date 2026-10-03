import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";
import type { NewCouncilMemberInput } from "../../shared/types";

export async function findAllCouncilMembers() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("council_members")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`議員の取得に失敗しました: ${error.message}`);
  }

  return data;
}

/** 表示順の最大値（未登録なら0） */
export async function findMaxDisplayOrder() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("council_members")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`議員の表示順の取得に失敗しました: ${error.message}`);
  }

  return data?.display_order ?? 0;
}

export async function insertCouncilMemberRecords(
  members: (NewCouncilMemberInput & { display_order: number })[]
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("council_members")
    .insert(members)
    .select();

  if (error) {
    throw new Error(`議員の登録に失敗しました: ${error.message}`);
  }

  return data;
}

export async function updateCouncilMemberRecord(
  id: string,
  input: {
    name: string;
    faction: string | null;
    display_order: number;
    is_active: boolean;
  }
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("council_members")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`議員の更新に失敗しました: ${error.message}`);
  }

  return data;
}

export async function deleteCouncilMemberRecord(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("council_members")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`議員の削除に失敗しました: ${error.message}`);
  }
}

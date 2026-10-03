import type { Database } from "@mirai-gikai/supabase";

export type CouncilMember =
  Database["public"]["Tables"]["council_members"]["Row"];

export type NewCouncilMemberInput = {
  name: string;
  faction: string | null;
};

export type UpdateCouncilMemberInput = {
  id: string;
  name: string;
  faction: string | null;
  display_order: number;
  is_active: boolean;
};

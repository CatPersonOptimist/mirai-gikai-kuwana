"use server";

import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { deleteCouncilMemberRecord } from "../repositories/council-member-repository";

/** 議員を削除する。その議員の賛否もすべて削除される（DB の ON DELETE CASCADE）。 */
export async function deleteCouncilMember(id: string) {
  try {
    await requireAdmin();
    await deleteCouncilMemberRecord(id);
    await invalidateWebCache([WEB_CACHE_TAGS.BILLS]);
    return { success: true as const };
  } catch (error) {
    console.error("Delete council member error:", error);
    return {
      error: getErrorMessage(error, "議員の削除中にエラーが発生しました"),
    };
  }
}

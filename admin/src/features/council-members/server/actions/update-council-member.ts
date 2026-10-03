"use server";

import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { trimOrNull } from "@/lib/utils/normalize-string";
import type { UpdateCouncilMemberInput } from "../../shared/types";
import { updateCouncilMemberRecord } from "../repositories/council-member-repository";

export async function updateCouncilMember(input: UpdateCouncilMemberInput) {
  try {
    await requireAdmin();

    if (!input.name || input.name.trim().length === 0) {
      return { error: "氏名を入力してください" };
    }
    if (!Number.isInteger(input.display_order)) {
      return { error: "表示順は整数で入力してください" };
    }

    const data = await updateCouncilMemberRecord(input.id, {
      name: input.name.trim(),
      faction: trimOrNull(input.faction),
      display_order: input.display_order,
      is_active: input.is_active,
    });

    await invalidateWebCache([WEB_CACHE_TAGS.BILLS]);
    return { data };
  } catch (error) {
    console.error("Update council member error:", error);
    return {
      error: getErrorMessage(error, "議員の更新中にエラーが発生しました"),
    };
  }
}

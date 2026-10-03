"use server";

import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import {
  invalidateWebCache,
  WEB_CACHE_TAGS,
} from "@/lib/utils/cache-invalidation";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { parseMemberLines } from "../../shared/utils/parse-member-lines";
import {
  findMaxDisplayOrder,
  insertCouncilMemberRecords,
} from "../repositories/council-member-repository";

/**
 * 1行1人のテキストから議員をまとめて登録する。
 * 表示順は既存の議員の後ろに、入力した順で付ける。
 */
export async function createCouncilMembers(text: string) {
  try {
    await requireAdmin();

    const members = parseMemberLines(text);
    if (members.length === 0) {
      return { error: "議員の氏名を1行に1人ずつ入力してください" };
    }

    const maxOrder = await findMaxDisplayOrder();
    const data = await insertCouncilMemberRecords(
      members.map((member, i) => ({
        ...member,
        display_order: maxOrder + i + 1,
      }))
    );

    await invalidateWebCache([WEB_CACHE_TAGS.BILLS]);
    return { data };
  } catch (error) {
    console.error("Create council members error:", error);
    return {
      error: getErrorMessage(error, "議員の登録中にエラーが発生しました"),
    };
  }
}

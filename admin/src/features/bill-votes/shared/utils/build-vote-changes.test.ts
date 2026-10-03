import type { MemberVoteType } from "@mirai-gikai/shared/member-votes";
import { describe, expect, it } from "vitest";
import { assignVotesInOrder, buildVoteChanges } from "./build-vote-changes";

describe("buildVoteChanges", () => {
  const existing = new Map<string, MemberVoteType>([
    ["m1", "for"],
    ["m2", "against"],
  ]);

  it("新しく選んだ賛否と変更した賛否を保存対象にする", () => {
    const result = buildVoteChanges(
      [
        { memberId: "m1", vote: "for" }, // 変更なし
        { memberId: "m2", vote: "for" }, // 変更
        { memberId: "m3", vote: "absent" }, // 新規
      ],
      existing
    );

    expect(result.upserts).toEqual([
      { member_id: "m2", vote: "for" },
      { member_id: "m3", vote: "absent" },
    ]);
    expect(result.deleteMemberIds).toEqual([]);
  });

  it("未入力に戻した登録済みの賛否を削除対象にする", () => {
    const result = buildVoteChanges(
      [
        { memberId: "m1", vote: null },
        { memberId: "m3", vote: null }, // 未登録なので何もしない
      ],
      existing
    );

    expect(result.upserts).toEqual([]);
    expect(result.deleteMemberIds).toEqual(["m1"]);
  });

  it("同じ議員が複数回あれば後の選択を優先する", () => {
    const result = buildVoteChanges(
      [
        { memberId: "m3", vote: "for" },
        { memberId: "m3", vote: "against" },
      ],
      existing
    );

    expect(result.upserts).toEqual([{ member_id: "m3", vote: "against" }]);
  });
});

describe("assignVotesInOrder", () => {
  it("議員の並び順どおりに賛否を割り当てる", () => {
    const result = assignVotesInOrder(["m1", "m2"], ["for", "not_voting"]);

    expect(result).toEqual({
      ok: true,
      selections: [
        { memberId: "m1", vote: "for" },
        { memberId: "m2", vote: "not_voting" },
      ],
    });
  });

  it("記号の数と人数が違うときは割り当てずに理由を返す", () => {
    const result = assignVotesInOrder(["m1", "m2", "m3"], ["for", "for"]);

    expect(result).toEqual({
      ok: false,
      reason: "記号の数（2）と議員の人数（3）が一致しません",
    });
  });
});

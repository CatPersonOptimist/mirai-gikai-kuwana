import { describe, expect, it } from "vitest";
import {
  countByVoteType,
  groupVotesByType,
  sortHistoryBySubmittedDate,
} from "./group-member-votes";

const vote = (
  name: string,
  order: number,
  v: "for" | "against" | "absent" | "left" | "recused" | "chair"
) => ({ vote: v, member: { name, display_order: order } });

describe("countByVoteType", () => {
  it("区分ごとの件数を数え、該当なしの区分は0にする", () => {
    expect(
      countByVoteType([{ vote: "for" }, { vote: "for" }, { vote: "absent" }])
    ).toEqual({
      for: 2,
      against: 0,
      absent: 1,
      left: 0,
      recused: 0,
      chair: 0,
    });
  });
});

describe("groupVotesByType", () => {
  it("賛成・賛成でない・欠席・退席・除斥・議長の順にまとめ、該当なしの区分は除く", () => {
    const result = groupVotesByType([
      vote("A", 1, "absent"),
      vote("B", 2, "for"),
      vote("C", 3, "chair"),
      vote("D", 4, "left"),
    ]);

    expect(result.map((g) => g.type)).toEqual([
      "for",
      "absent",
      "left",
      "chair",
    ]);
  });

  it("各区分の中は議員の表示順で並べる", () => {
    const result = groupVotesByType([
      vote("C", 3, "for"),
      vote("A", 1, "for"),
      vote("B", 2, "for"),
    ]);

    expect(result[0].items.map((i) => i.member.name)).toEqual(["A", "B", "C"]);
  });

  it("賛否が1件もなければ空配列を返す", () => {
    expect(groupVotesByType([])).toEqual([]);
  });
});

describe("sortHistoryBySubmittedDate", () => {
  it("提出日が新しい順に並べ、提出日なしは最後にする", () => {
    const item = (name: string, date: string | null) => ({
      bill: { name, submitted_date: date },
    });
    const result = sortHistoryBySubmittedDate([
      item("old", "2026-03-01"),
      item("none", null),
      item("new", "2026-09-02"),
    ]);

    expect(result.map((i) => i.bill.name)).toEqual(["new", "old", "none"]);
  });
});

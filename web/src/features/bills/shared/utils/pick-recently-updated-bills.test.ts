import { describe, expect, it } from "vitest";
import {
  getBillLastUpdatedAt,
  pickRecentlyUpdatedBills,
} from "./pick-recently-updated-bills";

function bill(id: string, updatedAt: string, contentUpdatedAt?: string) {
  return {
    id,
    updated_at: updatedAt,
    bill_content: contentUpdatedAt
      ? { updated_at: contentUpdatedAt }
      : undefined,
  };
}

describe("getBillLastUpdatedAt", () => {
  it("議案本体と解説コンテンツのうち新しい方の日時を返す", () => {
    const target = bill("a", "2026-09-01T00:00:00Z", "2026-09-10T00:00:00Z");

    expect(getBillLastUpdatedAt(target)).toBe(
      Date.parse("2026-09-10T00:00:00Z")
    );
  });

  it("解説コンテンツが無い場合は議案本体の日時を返す", () => {
    const target = bill("a", "2026-09-01T00:00:00Z");

    expect(getBillLastUpdatedAt(target)).toBe(
      Date.parse("2026-09-01T00:00:00Z")
    );
  });

  it("日時が解釈できない側は無視し、両方とも解釈できなければ0を返す", () => {
    expect(
      getBillLastUpdatedAt(bill("a", "invalid", "2026-09-10T00:00:00Z"))
    ).toBe(Date.parse("2026-09-10T00:00:00Z"));
    expect(getBillLastUpdatedAt(bill("b", "invalid", "invalid"))).toBe(0);
  });
});

describe("pickRecentlyUpdatedBills", () => {
  const bills = [
    bill("old", "2026-08-01T00:00:00Z"),
    // 本体は古いが解説を最近書き直した議案は、更新が新しい扱いになる
    bill("content-edited", "2026-07-01T00:00:00Z", "2026-09-20T00:00:00Z"),
    bill("new", "2026-09-15T00:00:00Z"),
    bill("middle", "2026-09-01T00:00:00Z"),
  ];

  it("最終更新日時が新しい順に limit 件を返す", () => {
    const result = pickRecentlyUpdatedBills(bills, 3);

    expect(result.map((b) => b.id)).toEqual([
      "content-edited",
      "new",
      "middle",
    ]);
  });

  it("件数が limit より少なければ全件を新しい順で返す", () => {
    const result = pickRecentlyUpdatedBills(bills, 10);

    expect(result.map((b) => b.id)).toEqual([
      "content-edited",
      "new",
      "middle",
      "old",
    ]);
  });

  it("limit が0以下なら空配列を返す", () => {
    expect(pickRecentlyUpdatedBills(bills, 0)).toEqual([]);
  });

  it("元の配列の順序を変更しない", () => {
    const original = bills.map((b) => b.id);

    pickRecentlyUpdatedBills(bills, 2);

    expect(bills.map((b) => b.id)).toEqual(original);
  });
});

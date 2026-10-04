import { describe, expect, it } from "vitest";
import { splitHomeLatestBills } from "./split-home-latest-bills";

function bill(id: string, session: string | null, updatedAt: string) {
  return { id, diet_session_id: session, updated_at: updatedAt };
}

const bills = [
  bill("s1-old", "s1", "2026-09-01T00:00:00Z"),
  bill("s1-new", "s1", "2026-09-20T00:00:00Z"),
  bill("s0-newest", "s0", "2026-09-25T00:00:00Z"),
  bill("s1-mid", "s1", "2026-09-10T00:00:00Z"),
  bill("s1-mid2", "s1", "2026-09-05T00:00:00Z"),
  bill("no-session", null, "2026-08-01T00:00:00Z"),
];

describe("splitHomeLatestBills", () => {
  it("会期を問わず最終更新が新しい順に指定件数を大きく出す", () => {
    const { featured } = splitHomeLatestBills(bills, "s1", 3);

    expect(featured.map((b) => b.id)).toEqual([
      "s0-newest",
      "s1-new",
      "s1-mid",
    ]);
  });

  it("今の会期の議案のうち、大きく出さなかったものを新しい順に全件返す", () => {
    const { sessionBills } = splitHomeLatestBills(bills, "s1", 3);

    expect(sessionBills.map((b) => b.id)).toEqual(["s1-mid2", "s1-old"]);
  });

  it("今の会期が無いときは、会期の議案を返さない", () => {
    const { featured, sessionBills } = splitHomeLatestBills(bills, null, 3);

    expect(featured).toHaveLength(3);
    expect(sessionBills).toEqual([]);
  });

  it("議案が指定件数より少なければ、すべて大きく出して会期の議案は空になる", () => {
    const { featured, sessionBills } = splitHomeLatestBills(
      [bill("a", "s1", "2026-09-01T00:00:00Z")],
      "s1",
      3
    );

    expect(featured.map((b) => b.id)).toEqual(["a"]);
    expect(sessionBills).toEqual([]);
  });
});

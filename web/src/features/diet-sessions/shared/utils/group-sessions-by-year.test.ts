import { describe, expect, it } from "vitest";
import {
  formatYearWithEra,
  groupSessionsByYear,
} from "./group-sessions-by-year";

const session = (id: string, startDate: string, slug: string | null = id) => ({
  id,
  slug,
  start_date: startDate,
});

describe("groupSessionsByYear", () => {
  it("開始年ごとにまとめ、新しい年・新しい会期の順に並べる", () => {
    const result = groupSessionsByYear([
      session("r7-2", "2025-06-01"),
      session("r8-1", "2026-02-15"),
      session("r7-4", "2025-11-25"),
      session("r8-2", "2026-06-01"),
    ]);

    expect(result.map((g) => [g.year, g.sessions.map((s) => s.id)])).toEqual([
      [2026, ["r8-2", "r8-1"]],
      [2025, ["r7-4", "r7-2"]],
    ]);
  });

  it("除外指定した会期と、slug の無い会期は含めない", () => {
    const result = groupSessionsByYear(
      [
        session("r8-2", "2026-06-01"),
        session("r8-1", "2026-02-15"),
        session("no-slug", "2026-04-01", null),
      ],
      ["r8-2"]
    );

    expect(result).toEqual([
      { year: 2026, sessions: [session("r8-1", "2026-02-15")] },
    ]);
  });

  it("会期が無ければ空配列を返す", () => {
    expect(groupSessionsByYear([])).toEqual([]);
  });
});

describe("formatYearWithEra", () => {
  it("令和の年を添える（2019年は令和元年）", () => {
    expect(formatYearWithEra(2026)).toBe("2026年（令和8年）");
    expect(formatYearWithEra(2019)).toBe("2019年（令和元年）");
  });

  it("令和より前は西暦のみ", () => {
    expect(formatYearWithEra(2018)).toBe("2018年");
  });
});

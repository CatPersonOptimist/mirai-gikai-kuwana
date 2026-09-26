import { describe, expect, it } from "vitest";

import { getBillStatusLabel } from "./index";

describe("getBillStatusLabel", () => {
  it("returns '準備中' for preparing", () => {
    expect(getBillStatusLabel("preparing")).toBe("準備中");
  });

  it("returns '提出済み' for introduced", () => {
    expect(getBillStatusLabel("introduced")).toBe("提出済み");
  });

  it("returns '可決' for enacted", () => {
    expect(getBillStatusLabel("enacted")).toBe("可決");
  });

  it("returns '否決' for rejected", () => {
    expect(getBillStatusLabel("rejected")).toBe("否決");
  });

  // 市議会は一院制のため、発議院に関係なく「委員会審査 → 本会議」で表示する
  it.each([
    "HR",
    "HC",
    null,
    undefined,
  ] as const)("in_originating_house は発議院 %s でも '委員会審査中' を返す", (house) => {
    expect(getBillStatusLabel("in_originating_house", house)).toBe(
      "委員会審査中"
    );
  });

  it.each([
    "HR",
    "HC",
    null,
    undefined,
  ] as const)("in_receiving_house は発議院 %s でも '本会議審議中' を返す", (house) => {
    expect(getBillStatusLabel("in_receiving_house", house)).toBe(
      "本会議審議中"
    );
  });

  it("returns the status string as-is for unknown status", () => {
    // biome-ignore lint/suspicious/noExplicitAny: テスト用に未知のステータスを渡す
    expect(getBillStatusLabel("unknown_status" as any)).toBe("unknown_status");
  });
});

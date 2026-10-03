import { describe, expect, it } from "vitest";
import { parseMemberLines } from "./parse-member-lines";

describe("parseMemberLines", () => {
  it("1行に1人の氏名を読み取る", () => {
    expect(parseMemberLines("成田久美子\n渡辺仁美")).toEqual([
      { name: "成田久美子", faction: null },
      { name: "渡辺仁美", faction: null },
    ]);
  });

  it("カンマ・全角カンマ・タブの後ろを会派として読み取る", () => {
    expect(
      parseMemberLines("服部喜幸,無会派\n市野修平，公明党\n太田国男\t絆")
    ).toEqual([
      { name: "服部喜幸", faction: "無会派" },
      { name: "市野修平", faction: "公明党" },
      { name: "太田国男", faction: "絆" },
    ]);
  });

  it("姓と名の間の空白は氏名の一部として残す", () => {
    expect(parseMemberLines("冨田　薫,無会派")).toEqual([
      { name: "冨田　薫", faction: "無会派" },
    ]);
  });

  it("空行と前後の空白を無視し、氏名が空の行は除く", () => {
    expect(parseMemberLines("\n  近藤浩  \n\n,会派のみ\n")).toEqual([
      { name: "近藤浩", faction: null },
    ]);
  });
});

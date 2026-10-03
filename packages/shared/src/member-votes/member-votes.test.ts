import { describe, expect, it } from "vitest";
import { parseVoteSymbols } from "./member-votes";

describe("parseVoteSymbols", () => {
  it("空白区切りの記号を賛否に変換する", () => {
    const result = parseVoteSymbols("○ × 欠 －");

    expect(result.votes).toEqual(["for", "against", "absent", "not_voting"]);
    expect(result.invalidSymbols).toEqual([]);
  });

  it("区切りなしの記号の並びも1文字ずつ読む", () => {
    const result = parseVoteSymbols("○○×欠－");

    expect(result.votes).toEqual([
      "for",
      "for",
      "against",
      "absent",
      "not_voting",
    ]);
  });

  it("記号の表記ゆれ（〇・x・半角ハイフン・長音）を同じ区分として扱う", () => {
    const result = parseVoteSymbols("〇 x - ー");

    expect(result.votes).toEqual(["for", "against", "not_voting", "not_voting"]);
  });

  it("改行・カンマ・読点は区切りとして無視する", () => {
    const result = parseVoteSymbols("○,×\n欠、－");

    expect(result.votes).toEqual(["for", "against", "absent", "not_voting"]);
  });

  it("解釈できない文字は invalidSymbols に重複なく出現順で返す", () => {
    const result = parseVoteSymbols("○ 賛 ○ 22 賛");

    expect(result.votes).toEqual(["for", "for"]);
    expect(result.invalidSymbols).toEqual(["賛", "2"]);
  });

  it("空文字なら空の結果を返す", () => {
    expect(parseVoteSymbols("")).toEqual({ votes: [], invalidSymbols: [] });
  });
});

import { describe, expect, it } from "vitest";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { routes } from "@/lib/routes";
import { policyLinks, primaryLinks } from "./footer.config";

describe("footer.config", () => {
  it("policyLinks に規約ページへの内部リンクが含まれる", () => {
    const hrefs = policyLinks.map((link) => link.href);

    expect(hrefs).toContain(routes.terms());
    expect(hrefs).toContain(routes.privacy());
  });

  // FORK_GUIDELINES.md 必須要件6（AGPL-3.0 第13条）：fork 版自身のソースコードへのリンク
  it("policyLinks にこのサービス自身のソースコードへのリンクが含まれる", () => {
    const hrefs = policyLinks.map((link) => link.href);

    expect(hrefs).toContain(EXTERNAL_LINKS.GITHUB_REPO);
  });

  it("内部リンクには external フラグが付かない", () => {
    const internalHrefs = new Set<string>([
      routes.home(),
      routes.terms(),
      routes.privacy(),
      routes.developers(),
    ]);

    for (const link of [...primaryLinks, ...policyLinks]) {
      if (internalHrefs.has(link.href)) {
        expect(link.external).toBeUndefined();
      } else {
        expect(link.external).toBe(true);
      }
    }
  });
});

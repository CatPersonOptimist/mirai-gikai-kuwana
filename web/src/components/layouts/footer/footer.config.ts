import { EXTERNAL_LINKS } from "@/config/external-links";
import { routes } from "@/lib/routes";

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterPolicyLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryLinks: FooterLink[] = [
  {
    label: "TOP",
    href: routes.home(),
  },
  {
    label: "桑名市議会",
    href: EXTERNAL_LINKS.COUNCIL_SITE,
    external: true,
  },
  {
    label: "本家「みらい議会」",
    href: EXTERNAL_LINKS.UPSTREAM_SITE,
    external: true,
  },
];

export const policyLinks: FooterPolicyLink[] = [
  {
    label: "利用規約",
    href: routes.terms(),
  },
  {
    label: "プライバシーポリシー",
    href: routes.privacy(),
  },
  // FORK_GUIDELINES.md 必須要件6: この fork 版自身のソースコードへのリンク（削除しないこと）
  {
    label: "ソースコード",
    href: EXTERNAL_LINKS.GITHUB_REPO,
    external: true,
  },
];

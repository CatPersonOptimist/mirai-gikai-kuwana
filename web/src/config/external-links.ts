import { SITE_CONFIG } from "./site";

/**
 * 外部リンク定数
 */
export const EXTERNAL_LINKS = {
  /** 誤り報告・お問い合わせ（TODO: 専用フォームがあれば差し替える） */
  REPORT: `mailto:${SITE_CONFIG.contactEmail}`,
  /** 本家「みらい議会」の紹介記事 */
  ABOUT_NOTE: "https://note.com/team_mirai_jp/n/nd1656aa5f86d",
  FORK_GUIDELINES_NOTE: "https://note.com/team_mirai_jp/n/nc59ec347e8c7",
  /** FORK_GUIDELINES.md 必須要件6: この fork 版自身のソースコード公開先 */
  GITHUB_REPO: "https://github.com/CatPersonOptimist/mirai-gikai-kuwana",
  /** 本家「みらい議会」（推奨事項: 本家へのリンク） */
  UPSTREAM_SITE: "https://gikai.team-mir.ai/",
  /** fork 元リポジトリ */
  UPSTREAM_REPO: "https://github.com/team-mirai/mirai-gikai",
  /** 桑名市議会 公式サイト */
  COUNCIL_SITE: "https://www.city.kuwana.lg.jp/gikai/index.html",
  /** 桑名市議会 定例会・臨時会（審議結果） */
  COUNCIL_BILLS: "https://www.city.kuwana.lg.jp/gikai/kekka/teirei/index.html",
} as const;

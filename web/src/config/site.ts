/**
 * fork 版（みらい議会＠桑名市）のサイト設定
 *
 * 地域名・運営者名など、fork 版ごとに差し替える値をここに集約する。
 * FORK_GUIDELINES.md の必須要件（サービス名称・免責文言・ソースコード公開先）に対応。
 */
export const SITE_CONFIG = {
  /** 地域名 */
  regionName: "桑名市",
  /** 対象議会名 */
  councilName: "桑名市議会",
  /** サービス名（「みらい議会＠地域名」形式） */
  serviceName: "みらい議会＠桑名市",
  /** サービスの説明文 */
  description:
    "桑名市議会でいまどんな議案が審議されているか、わかりやすく伝えるプラットフォーム",
  /** 運営者名 */
  operatorName: "みらい議会＠桑名市",
  /** 問い合わせ先 */
  contactEmail: "Cat.Person.Optimist@gmail.com",
  /** コピーライト表記 */
  copyright: "© 2026 みらい議会＠桑名市",
  /** テーマカラー（globals.css の --primary と揃える） */
  themeColor: "#1f6fb2",
  /** FORK_GUIDELINES.md 必須要件5: 免責文言 */
  disclaimer: "これは政党チームみらいが運営しているものではありません",
} as const;

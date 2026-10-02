# みらい議会＠桑名市 — 改変に関する表示

本リポジトリは、チームみらいが AGPL-3.0 で公開している
[team-mirai/mirai-gikai](https://github.com/team-mirai/mirai-gikai)（`develop` ブランチ）を fork し、
三重県桑名市議会向けに改変したものです。

> これは政党チームみらいが運営しているものではありません

- fork 元: https://github.com/team-mirai/mirai-gikai
- 本家サービス: https://gikai.team-mir.ai/
- ライセンス: AGPL-3.0（[LICENSE](./LICENSE)）
- 改変日: 2026年9月26日（AGPL-3.0 第5条 (a) に基づく表示）

## FORK_GUIDELINES.md への対応状況

| 要件 | 対応内容 |
|------|----------|
| 1. サービス名称 | 「みらい議会＠桑名市」。`web/src/config/site.ts` に集約し、`layout.tsx` / `manifest.json` / 各ページのタイトルに反映 |
| 2. ロゴ | `web/public/img/logo.svg`・`service-logo.svg`・`ogp-logo.png`、`web/public/icons/pwa/*` を独自デザイン（はまぐり＋木曽三川）に差し替え |
| 3. トップ画像 | `web/public/ogp.jpg` を差し替え。国会議事堂写真のアーカイブ画像も `archive-hero-kuwana.jpg` に差し替え（本家では `hero_background.png` は既に廃止済み） |
| 4. カラーテーマ | `--primary: #1f6fb2` / `--primary-accent: #0f4f86` / グラデーション `#7cc4ee → #d4ecfa` ほか、ブランド系トークン・SVGアイコン内の色を青系に変更。`themeColor` も変更 |
| 5. 免責文言 | フッター・トップページ「運営について」・デスクトップメニュー・OGP画像・AIチャットのプロンプトに表示 |
| 6. ソースコード公開先 | `web/src/config/external-links.ts` の `GITHUB_REPO`。フッター・開発者向けページ・トップページからリンク |
| 推奨: 本家へのリンク | フッター・トップページ・メニューに本家サービスと fork 元リポジトリへのリンクを掲載 |

## 主な改変内容

- **ブランド**: 上記のとおり。チームみらいのロゴ・「チームみらいについて」セクション・SNSリンク・寄附導線を削除
- **対象議会の置き換え**: UI 上の「国会」を「桑名市議会」に、「法案」を「議案」に変更
- **審議ステータス**: 市議会は一院制のため、既存の enum を読み替えて表示
  - `in_originating_house` → 「委員会審査中」、`in_receiving_house` → 「本会議審議中」、`enacted` → 「可決」
  - 議案詳細の進行表示は「議案提出 → 委員会審査 → 本会議審議 → 議決」（発議院による並び替えは無効化）
  - DB スキーマは変更していません（本家への追従を容易にするため）
- **AIチャットのプロンプト**: チームみらいの党概要・2026年プランを削除し、桑名市議会の一般的な説明に差し替え（`web/src/lib/prompt/source-code/templates/shared-sections.ts`）
- **AIインタビュー関連の文言**: 「チームみらいの政策検討に活用」等を運営者名・市政向けの表現に変更
- **規約類**: 利用規約・プライバシーポリシー・AIインタビューデータ利用規約の運営主体・連絡先を `SITE_CONFIG` から参照するよう変更
- **外部リンク**: 「国会議案情報へ」を桑名市議会の定例会・臨時会ページへ変更。誤り報告は運営者メールアドレス宛てに変更
- **OGP 画像（動的生成）**: `/api/og/report` のバッジ・配色を変更
- **AIチャットのモデル**: `openai/gpt-5.4-mini-fast` → `anthropic/claude-haiku-4.5`（AI Gateway 経由、2026-10-02 に Sonnet 5 から変更）。Web 検索を OpenAI の検索ツールから Anthropic のサーバー側 Web 検索（`webSearch_20250305`、1応答最大3回、地域: 三重県桑名市）に変更。Sonnet 5 の単価表を $2 / $10（per 1M tokens）に修正

## デプロイ

Supabase + Vercel での公開手順は [docs/20260926_2330_桑名版デプロイ手順.md](./docs/20260926_2330_桑名版デプロイ手順.md) を参照。

## 公開前に必ず対応が必要な TODO

1. `web/src/config/site.ts`
   - `operatorName`（運営者名）・`contactEmail`（連絡先）は設定済み（2026-09-27）
2. `web/src/config/external-links.ts`
   - `GITHUB_REPO` は https://github.com/yasushikatayama1976/mirai-gikai-kuwana に設定済み（リポジトリを公開状態にしておくこと）
3. 規約類の法務確認（`web/src/app/(main)/terms`・`privacy`・`developers/interview-data-terms`）
   - 運営主体の実態に合わせた内容か確認（管轄裁判所は本家のまま「東京地方裁判所」）
4. データ投入（管理画面 `admin/`）
   - 会期（定例会・臨時会）を「国会会期」として登録。会期の `shugiin_url` には桑名市議会の該当ページ URL を設定
   - 議案の審議段階は上記の読み替えに従って設定
   - 「賛否」機能（`mirai_stances`）は「運営者の見解」として表示されます。使わない場合は登録しないでください
5. ロゴ・画像は仮デザインです。必要に応じて差し替えてください（`scripts/generate-kuwana-brand-assets.js` で再生成可能）
6. 管理画面（`admin/`）の文言も桑名市議会向けに変更済み（国会会期→会期、衆議院URL→市議会URL、提出院→提出先「桑名市議会」、ステータス→委員会審査中／本会議審議中／可決、法案→議案）

## ブランド画像の再生成

sharp を一時ディレクトリにインストールしてから実行します（リポジトリの依存には追加しません）。

```bash
npm install --prefix /tmp/brand-assets sharp@0.34
```

```bash
NODE_PATH=/tmp/brand-assets/node_modules node scripts/generate-kuwana-brand-assets.js "$PWD/web/public"
```

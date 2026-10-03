-- 市議会議員と、議案ごとの議員別表決結果（賛否）。
-- 桑名市議会が定例会ごとに公開している「議員別表決結果」を登録する。
-- 既存テーブルは変更しない（このマイグレーションだけで追加・削除できる）。

-- 表決の区分（桑名市議会の議員別表決結果の記号に対応）
--   for: 賛成（○） / against: 反対（×） / absent: 欠席（欠） / not_voting: 採決に加わらない（－。議長など）
CREATE TYPE member_vote_type AS ENUM (
  'for',
  'against',
  'absent',
  'not_voting'
);

-- 市議会議員
CREATE TABLE council_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_kana TEXT,
  faction TEXT,                                   -- 会派（例：無会派、公明党）
  is_active BOOLEAN NOT NULL DEFAULT true,        -- 現職か（任期満了後も過去の賛否は残す）
  display_order INTEGER NOT NULL DEFAULT 0,       -- 表示順（小さいほど先）
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_council_members_updated_at
  BEFORE UPDATE ON council_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 議案ごとの議員の賛否（1議案につき1議員1行）
CREATE TABLE bill_member_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES council_members(id) ON DELETE CASCADE,
  vote member_vote_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (bill_id, member_id)
);

CREATE INDEX idx_bill_member_votes_member ON bill_member_votes(member_id);

CREATE TRIGGER update_bill_member_votes_updated_at
  BEFORE UPDATE ON bill_member_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS は有効化のみ（ポリシーは定義しない。アクセスは Secret Key 経由のみ）
ALTER TABLE council_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_member_votes ENABLE ROW LEVEL SECURITY;

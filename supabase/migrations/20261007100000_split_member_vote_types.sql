-- 議員別表決結果の区分を、桑名市議会の凡例に合わせて細かくする。
--   not_voting（採決に加わらず）→ chair（議長「－」）に名前を変更
--     ※これまで「採決に加わらず」で登録した行は、すべて「議長」になる
--   left（退席「退」）と recused（除斥「除」）を追加
-- against の表示は「賛成でない」（凡例の空欄）に変更したが、値はそのまま。

ALTER TYPE member_vote_type RENAME VALUE 'not_voting' TO 'chair';
ALTER TYPE member_vote_type ADD VALUE IF NOT EXISTS 'left';
ALTER TYPE member_vote_type ADD VALUE IF NOT EXISTS 'recused';

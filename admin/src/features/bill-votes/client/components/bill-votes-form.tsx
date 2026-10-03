"use client";

import {
  MEMBER_VOTE_LABELS,
  MEMBER_VOTE_SYMBOLS,
  MEMBER_VOTE_TYPES,
  type MemberVoteType,
  parseVoteSymbols,
} from "@mirai-gikai/shared/member-votes";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CouncilMember } from "@/features/council-members/shared/types";
import { routes } from "@/lib/routes";
import { saveBillVotes } from "../../server/actions/save-bill-votes";
import { assignVotesInOrder } from "../../shared/utils/build-vote-changes";

interface BillVotesFormProps {
  billId: string;
  members: CouncilMember[];
  initialVotes: Record<string, MemberVoteType>;
}

type VoteState = Record<string, MemberVoteType | null>;

export function BillVotesForm({
  billId,
  members,
  initialVotes,
}: BillVotesFormProps) {
  const router = useRouter();
  const symbolsId = useId();
  const [votes, setVotes] = useState<VoteState>(() =>
    Object.fromEntries(
      members.map((member) => [member.id, initialVotes[member.id] ?? null])
    )
  );
  const [symbols, setSymbols] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const counts = useMemo(() => {
    const result: Record<MemberVoteType | "none", number> = {
      for: 0,
      against: 0,
      absent: 0,
      not_voting: 0,
      none: 0,
    };
    for (const vote of Object.values(votes)) {
      result[vote ?? "none"] += 1;
    }
    return result;
  }, [votes]);

  if (members.length === 0) {
    return (
      <p className="text-gray-600">
        議員が登録されていません。先に
        <Link
          href={routes.councilMembers() as Route}
          className="mx-1 text-blue-600 underline"
        >
          議員管理
        </Link>
        で議員を登録してください。
      </p>
    );
  }

  const setAll = (vote: MemberVoteType | null) => {
    setVotes(Object.fromEntries(members.map((member) => [member.id, vote])));
  };

  const applySymbols = () => {
    const { votes: parsed, invalidSymbols } = parseVoteSymbols(symbols);
    if (invalidSymbols.length > 0) {
      toast.error(`読み取れない文字があります：${invalidSymbols.join(" ")}`);
      return;
    }
    const result = assignVotesInOrder(
      members.map((member) => member.id),
      parsed
    );
    if (!result.ok) {
      toast.error(result.reason);
      return;
    }
    setVotes(
      Object.fromEntries(result.selections.map((s) => [s.memberId, s.vote]))
    );
    toast.success("記号を反映しました。内容を確認して保存してください");
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const result = await saveBillVotes(
        billId,
        members.map((member) => ({
          memberId: member.id,
          vote: votes[member.id] ?? null,
        }))
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("賛否を保存しました");
        router.refresh();
      }
    } catch (error) {
      console.error("Save bill votes error:", error);
      toast.error("賛否の保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 記号でまとめて入力 */}
      <section className="space-y-3 rounded-lg border bg-white p-6">
        <Label htmlFor={symbolsId} className="text-base font-semibold">
          記号でまとめて入力
        </Label>
        <p className="text-sm text-gray-600">
          市の「議員別表決結果」のこの議案の行の記号（
          {MEMBER_VOTE_TYPES.map(
            (type) =>
              `${MEMBER_VOTE_SYMBOLS[type]}＝${MEMBER_VOTE_LABELS[type]}`
          ).join("、")}
          ）を、下の議員の並び順どおりに貼り付けてください。空白や改行は無視されます。
        </p>
        <Textarea
          id={symbolsId}
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
          placeholder="○ ○ ○ ○ － ○ 欠 ○"
          className="min-h-[72px] font-mono"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={applySymbols}
            disabled={isSubmitting || !symbols.trim()}
          >
            記号を反映
          </Button>
        </div>
      </section>

      {/* 議員ごとの賛否 */}
      <section className="space-y-4 rounded-lg border bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="mr-auto text-base font-semibold">議員ごとの賛否</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setAll("for")}
            disabled={isSubmitting}
          >
            全員を賛成にする
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setAll(null)}
            disabled={isSubmitting}
          >
            すべて未入力に戻す
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          賛成 {counts.for}・反対 {counts.against}・欠席 {counts.absent}
          ・採決に加わらず {counts.not_voting}・未入力 {counts.none}
        </p>

        <div className="divide-y rounded-lg border">
          {members.map((member, i) => (
            <div
              key={member.id}
              className="flex flex-wrap items-center gap-3 px-3 py-2"
            >
              <span className="w-8 text-sm text-gray-500">{i + 1}</span>
              <span className="w-40 font-medium">
                {member.name}
                {!member.is_active && (
                  <span className="ml-1 text-xs text-gray-500">（元職）</span>
                )}
              </span>
              <span className="w-32 text-sm text-gray-500">
                {member.faction ?? ""}
              </span>
              <select
                value={votes[member.id] ?? ""}
                onChange={(e) =>
                  setVotes((prev) => ({
                    ...prev,
                    [member.id]:
                      e.target.value === ""
                        ? null
                        : (e.target.value as MemberVoteType),
                  }))
                }
                className="ml-auto h-9 rounded-md border border-input bg-background px-2 text-sm"
                aria-label={`${member.name}の賛否`}
                disabled={isSubmitting}
              >
                <option value="">未入力</option>
                {MEMBER_VOTE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {MEMBER_VOTE_SYMBOLS[type]} {MEMBER_VOTE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500">
          1人でも賛否を保存すると、公開サイトのこの議案のページに「議員の賛否」が表示されます。すべて未入力に戻して保存すると、表示は消えます。
        </p>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </section>
    </div>
  );
}

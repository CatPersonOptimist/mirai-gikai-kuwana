"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCouncilMembers } from "../../server/actions/create-council-members";

export function CouncilMemberBulkForm() {
  const router = useRouter();
  const textId = useId();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("議員の氏名を1行に1人ずつ入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCouncilMembers(text);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.data?.length ?? 0}人の議員を登録しました`);
        setText("");
        router.refresh();
      }
    } catch (error) {
      console.error("Create council members error:", error);
      toast.error("議員の登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={textId}>議員（1行に1人。「氏名,会派」の形式）</Label>
        <Textarea
          id={textId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"成田久美子,無会派\n渡辺仁美,絆"}
          className="min-h-[160px] font-mono"
          disabled={isSubmitting}
        />
        <p className="text-sm text-gray-500">
          市の「議員別表決結果」と同じ順番で入力すると、賛否を記号でまとめて入力できます。表示順は入力した順に付き、後から変更できます。
        </p>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "登録中..." : "まとめて登録"}
        </Button>
      </div>
    </form>
  );
}

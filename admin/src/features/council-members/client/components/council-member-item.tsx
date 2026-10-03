"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { deleteCouncilMember } from "../../server/actions/delete-council-member";
import { updateCouncilMember } from "../../server/actions/update-council-member";
import type { CouncilMember } from "../../shared/types";

interface CouncilMemberItemProps {
  member: CouncilMember;
}

export function CouncilMemberItem({ member }: CouncilMemberItemProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(member.name);
  const [faction, setFaction] = useState(member.faction ?? "");
  const [displayOrder, setDisplayOrder] = useState(
    String(member.display_order)
  );
  const [isActive, setIsActive] = useState(member.is_active);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const result = await updateCouncilMember({
        id: member.id,
        name,
        faction: faction || null,
        display_order: Number(displayOrder),
        is_active: isActive,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("議員を更新しました");
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Update council member error:", error);
      toast.error("議員の更新に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName(member.name);
    setFaction(member.faction ?? "");
    setDisplayOrder(String(member.display_order));
    setIsActive(member.is_active);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const result = await deleteCouncilMember(member.id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("議員を削除しました");
        router.refresh();
      }
    } catch (error) {
      console.error("Delete council member error:", error);
      toast.error("議員の削除に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
        <Input
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value)}
          className="w-20"
          aria-label="表示順"
          disabled={isSubmitting}
        />
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-48"
          aria-label="氏名"
          disabled={isSubmitting}
        />
        <Input
          value={faction}
          onChange={(e) => setFaction(e.target.value)}
          className="w-48"
          placeholder="会派"
          aria-label="会派"
          disabled={isSubmitting}
        />
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
            aria-label="現職"
            disabled={isSubmitting}
          />
          <span className="text-sm">現職</span>
        </div>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
            保存
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
      <span className="w-12 text-sm text-gray-500">{member.display_order}</span>
      <span className="font-medium">{member.name}</span>
      {member.faction && (
        <span className="text-sm text-gray-500">{member.faction}</span>
      )}
      {!member.is_active && (
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          元職
        </span>
      )}
      <div className="ml-auto flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
          disabled={isSubmitting}
        >
          編集
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" disabled={isSubmitting}>
              削除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>議員の削除</AlertDialogTitle>
              <AlertDialogDescription>
                「{member.name}
                」を削除しますか？この議員の賛否の記録もすべて削除され、元に戻せません。任期を終えた議員は、削除せずに「現職」をオフにしてください。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

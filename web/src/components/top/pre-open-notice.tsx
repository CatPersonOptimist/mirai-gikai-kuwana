import { Info } from "lucide-react";
import { Container } from "@/components/layouts/container";
import { SITE_CONFIG } from "@/config/site";

/**
 * プレオープン中のお知らせ（トップページ）。
 * SITE_CONFIG.preOpen.enabled が false なら何も表示しない。
 */
export function PreOpenNotice() {
  const { enabled, label, message } = SITE_CONFIG.preOpen;
  if (!enabled) {
    return null;
  }

  return (
    <Container className="pt-4">
      {/* 目立たせすぎないよう、背景はページと同じ色のまま */}
      <div className="flex gap-2 px-1">
        <Info className="mt-0.5 size-4 shrink-0 text-mirai-text-secondary" />
        <p className="text-[13px] font-medium leading-relaxed text-mirai-text-secondary">
          <span className="mr-1.5 font-bold">{label}</span>
          {message}
        </p>
      </div>
    </Container>
  );
}

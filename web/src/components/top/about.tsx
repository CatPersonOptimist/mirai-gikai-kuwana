import Image from "next/image";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE_CONFIG } from "@/config/site";
import { LinkButton } from "./link-button";

export function About() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-4">
        {/* ヘッダー */}
        <div className="flex flex-col gap-4">
          <h2>
            <Image
              src="/icons/about-typography.svg"
              alt="About"
              width={143}
              height={36}
              priority
            />
          </h2>
          <p className="text-sm font-bold text-primary-accent">
            {SITE_CONFIG.serviceName}とは
          </p>
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold leading-[43.2px]">
              {SITE_CONFIG.councilName}での議論を
              <br />
              できる限りわかりやすく
            </h3>
            <p className="text-[15px] leading-[28px] text-black">
              {SITE_CONFIG.serviceName}は、{SITE_CONFIG.councilName}
              でいまどんな議案が審議されているか、わかりやすく伝えるプラットフォームです。市民の声を市政に届けることを目指して、継続的にアップデートしていきます。
            </p>
          </div>

          {/* もっと詳しく知るボタン */}
          <LinkButton
            href={EXTERNAL_LINKS.ABOUT_NOTE}
            icon={{
              src: "/icons/note-icon.png",
              alt: "note",
              width: 25,
              height: 25,
            }}
          >
            本家「みらい議会」とは
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

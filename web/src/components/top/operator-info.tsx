import { EXTERNAL_LINKS } from "@/config/external-links";
import { SITE_CONFIG } from "@/config/site";
import { LinkButton } from "./link-button";

/**
 * 運営について（本家「チームみらいについて」セクションの置き換え）
 *
 * FORK_GUIDELINES.md の免責文言・ソースコード公開先・本家へのリンクを
 * トップページでも明示する。
 */
export function OperatorInfo() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="font-lexend text-[30px] font-bold leading-none tracking-wide text-primary">
            Operator
          </h2>
          <p className="text-sm font-bold text-primary-accent">運営について</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[15px] leading-[28px] text-black">
            {SITE_CONFIG.serviceName}
            は、チームみらいがオープンソースで公開している「みらい議会」のソースコードをもとに、
            {SITE_CONFIG.councilName}向けに改変・運営しているサービスです。
          </p>
          <p className="text-[15px] leading-[28px] text-black">
            運営：{SITE_CONFIG.operatorName}
            <br />
            お問い合わせ：
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="break-all text-primary underline underline-offset-2"
            >
              {SITE_CONFIG.contactEmail}
            </a>
          </p>
          <p className="text-[15px] font-bold leading-[28px] text-black">
            {SITE_CONFIG.disclaimer}。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <LinkButton
            href={EXTERNAL_LINKS.COUNCIL_SITE}
            icon={{
              src: "/icons/interview-landmark.svg",
              alt: "",
              width: 20,
              height: 20,
            }}
          >
            {SITE_CONFIG.councilName}公式サイト
          </LinkButton>
          <LinkButton
            href={EXTERNAL_LINKS.UPSTREAM_SITE}
            icon={{
              src: "/icons/arrow-right.svg",
              alt: "",
              width: 18,
              height: 18,
            }}
          >
            本家「みらい議会」
          </LinkButton>
          <LinkButton
            href={EXTERNAL_LINKS.GITHUB_REPO}
            icon={{
              src: "/icons/arrow-right.svg",
              alt: "",
              width: 18,
              height: 18,
            }}
          >
            ソースコード（GitHub）
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

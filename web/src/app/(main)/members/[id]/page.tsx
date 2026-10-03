import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { MemberVoteHistory } from "@/features/council-members/server/components/member-vote-history";
import {
  getCouncilMember,
  getMemberVoteHistory,
} from "@/features/council-members/server/loaders/get-council-members";
import { routes } from "@/lib/routes";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const member = await getCouncilMember(id);

  if (!member) {
    return { title: "議員が見つかりません" };
  }

  return {
    title: `${member.name}議員の賛否 | みらい議会＠桑名市`,
    description: `桑名市議会 ${member.name}議員の、このサイトに掲載している議案への賛否の一覧です。`,
  };
}

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params;
  const member = await getCouncilMember(id);

  if (!member) {
    notFound();
  }

  const history = await getMemberVoteHistory(id);

  return (
    <>
      <Container className="pt-24 pb-8 md:pt-12">
        <MemberVoteHistory member={member} history={history} />
      </Container>

      {/* パンくずリスト */}
      <Container className="pb-12">
        <nav className="flex items-center gap-2 text-[15px]">
          <Link href={routes.home()} className="text-black">
            TOP
          </Link>
          <ChevronRight className="h-5 w-5 text-black" />
          <Link href={routes.members() as Route} className="text-black">
            議員の一覧
          </Link>
          <ChevronRight className="h-5 w-5 text-black" />
          <span className="text-black">{member.name}</span>
        </nav>
      </Container>
    </>
  );
}

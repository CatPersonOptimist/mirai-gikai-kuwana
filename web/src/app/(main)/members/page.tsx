import type { Metadata } from "next";
import { Container } from "@/components/layouts/container";
import { CouncilMemberDirectory } from "@/features/council-members/server/components/council-member-directory";
import { getCouncilMembers } from "@/features/council-members/server/loaders/get-council-members";

export const metadata: Metadata = {
  title: "議員の一覧 | みらい議会＠桑名市",
  description:
    "桑名市議会の議員と、このサイトに掲載している議案への賛否の一覧です。",
};

export default async function MembersPage() {
  const members = await getCouncilMembers();

  return (
    <Container className="pt-24 pb-12 md:pt-12">
      <CouncilMemberDirectory members={members} />
    </Container>
  );
}

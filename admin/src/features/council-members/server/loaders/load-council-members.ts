import type { CouncilMember } from "../../shared/types";
import { findAllCouncilMembers } from "../repositories/council-member-repository";

export async function loadCouncilMembers(): Promise<CouncilMember[]> {
  return (await findAllCouncilMembers()) ?? [];
}

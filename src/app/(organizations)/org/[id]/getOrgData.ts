import { ORGANIZATION_SELECT } from "@/components/organization/utils/fetchAllOrgs";
import { prisma } from "@/server/db";

export async function getOrgData(id:string) {
    return await prisma.organization.findUnique({
      where: {
        id: id,
      },
      select: ORGANIZATION_SELECT,
    });
}
export type OrgData = Awaited<ReturnType<typeof getOrgData>>;

export type ProgramData = NonNullable<OrgData>["programs"];
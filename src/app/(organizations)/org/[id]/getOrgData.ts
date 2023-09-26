import { prisma } from "@/server/db";

export async function getOrgData(id:string) {
    return await prisma.organization.findUnique({
      where: {
        id: id,
      },
      include: {
        programs: {
          include: {
            tags: true,
            categoryMeta: true,
          },
        },
        exclusiveToCommunities: true,
        helpfulToCommunities: true,
        tags: true,
        categoryMeta: true,
      },
    });
}
export type OrgData = Awaited<ReturnType<typeof getOrgData>>;

export type ProgramData = NonNullable<OrgData>["programs"];
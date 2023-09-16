import { prisma } from "@/server/db";

export const fetchAllOrgs = async () => {
  const orgs = await prisma.organization.findMany({
    include: {
      tags: { select: { tag: true } },
      categories: true,
    },
  });

  return orgs;
};

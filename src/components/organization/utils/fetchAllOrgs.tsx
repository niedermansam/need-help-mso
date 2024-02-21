import { prisma } from "@/server/prisma";

export const PROGRAM_SELECT = {
  id: true,
  name: true,
  description: true,
  category: true,
  organizationId: true,
  url: true,
  phone: true,
  categoryMeta: { select: { slug: true } },
  tags: { select: { tag: true } },
  exclusiveToCommunities: {
    select: { name: true, id: true },
  },
  helpfulToCommunities: {
    select: { name: true, id: true },
  },
} as const;

export function selectProgramsByCategory(category: string) {
  return {
    where: {
      categoryMeta: {
        slug: category,
      },
    },
    select: PROGRAM_SELECT,
  };
}

export const ORGANIZATION_SELECT = {
  id: true,
  name: true,
  description: true,
  category: true,
  website: true,
  phone: true,
  email: true,
  tags: { select: { tag: true } },
  exclusiveToCommunities: {
    select: { name: true, id: true },
  },
  helpfulToCommunities: {
    select: { name: true, id: true },
  },
  programs: {
    select: PROGRAM_SELECT,
  },
  categories: {
    select: { category: true },
  },
} as const;

export const fetchAllOrgs = async () => {
  const orgs = await prisma.organization.findMany({
    select: {...ORGANIZATION_SELECT, adminVerified: true},
  });
  return orgs;
};

export function selectOrganzationsByCategory(category: string) {
  return {
    where: {
      categories: {
        some: {
          category: category,
        },
      },
    },
    select: { ...ORGANIZATION_SELECT, programs: { select: PROGRAM_SELECT } },
  };
}

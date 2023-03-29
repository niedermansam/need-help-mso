import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
//import Airtable from "airtable";

export interface OrganizationSchema {
  Tags?: string[];
  URL?: string;
  Category?: string;
  "Resources Available"?: string[];
  Expertise: string;
  Name: string;
  "Administer of"?: string[];
  "Resource Names"?: string[];
  id: string;
  Contacts?: string[];
  Notes?: string;
  Phone?: string;
  Email?: string;
  "Affiliated Organizations"?: string[];
}

export interface ResourceSchema {
  Contacts?: string[];
  Name: string;
  "Forms & Files"?: string[];
  Provides: string;
  "Administering Org"?: string[];
  Organizations?: string[];
  "Organization Names"?: string[];
  "Income Restrictions"?: boolean;
  Tags: string[];
  URL?: string;
  "Ease of Aid"?: string;
  resources?: string[];
  Funding: string;
  "File Names"?: string[];
  id: string;
  "Communities Served"?: string[];
  "Exclusive to Communities Served"?: boolean;
  Notes?: string;
  "Income Restrictions Details"?: string;
}
const orgInput = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  website: z.string().optional(),
  helpfulToCommunities: z.array(z.string()).optional(),
  exclusiveToCommunities: z.array(z.string()).optional(),
});

const orgUpdateInput = z.object({
  id: z.string(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  category: z.string().nullish(),
  email: z.string().email().nullish(),
  phone: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  website: z.string().nullish(),
  helpfulToCommunities: z.array(z.string()).nullish(),
  exclusiveToCommunities: z.array(z.string()).nullish(),
});

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(orgInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.organization.create({
          data: {
            name: input.name,
            description: input.description,
            email: input.email,
            phone: input.phone,
            website: input.website,
            tags: {
              connectOrCreate: input.tags
                ? input.tags.map((tag) => ({
                    where: { tag },
                    create: {
                      tag,
                    },
                  }))
                : [],
            },

            helpfulToCommunities: input.helpfulToCommunities
              ? {
                  connectOrCreate: input.helpfulToCommunities.map(
                    (community) => ({
                      where: { name: community },
                      create: {
                        name: community,
                      },
                    })
                  ),
                }
              : undefined,

            exclusiveToCommunities: input.exclusiveToCommunities
              ? {
                  connectOrCreate: input.exclusiveToCommunities.map(
                    (community) => ({
                      where: { name: community },
                      create: {
                        name: community,
                      },
                    })
                  ),
                }
              : undefined,

            categoryMeta: {
              connectOrCreate: {
                where: { category: input.category },
                create: {
                  category: input.category,
                },
              },
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    }),

  update: protectedProcedure
    .input(orgUpdateInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedOrg = await ctx.prisma.organization.update({
          where: {
            id: input.id,
          },
          include: {
            exclusiveToCommunities: true,
            resources: {
              select: {
                id: true,
              },
            },
          },
          data: {
            name: input.name || undefined,
            description: input.description || undefined,
            email: input.email,
            phone: input.phone,
            website: input.website,
            tags: {
              connectOrCreate: input.tags
                ? input.tags.map((tag) => ({
                    where: { tag },
                    create: {
                      tag,
                    },
                  }))
                : [],
            },

            categoryMeta: {
              connectOrCreate: input.category
                ? {
                    where: { category: input.category },
                    create: {
                      category: input.category,
                    },
                  }
                : undefined,
            },

            helpfulToCommunities: input.helpfulToCommunities
              ? {
                  connectOrCreate: input.helpfulToCommunities.map(
                    (community) => ({
                      where: { name: community },
                      create: {
                        name: community,
                      },
                    })
                  ),
                }
              : undefined,

            exclusiveToCommunities: input.exclusiveToCommunities
              ? {
                  connectOrCreate: input.exclusiveToCommunities.map(
                    (community) => ({
                      where: { name: community },
                      create: {
                        name: community,
                      },
                    })
                  ),
                }
              : undefined,
          },
        });

        if (input.exclusiveToCommunities && input.exclusiveToCommunities.length > 0) {
          
          updatedOrg.resources.map(async (resource) => {
            await ctx.prisma.resource.update({
              where: {
                id: resource.id,
              },
              data: {
                exclusiveToCommunities: input.exclusiveToCommunities ? {
                  connectOrCreate: input.exclusiveToCommunities.map(
                    (community) => ({
                      where: { name: community },
                      create: {
                        name: community,
                      },
                    })
                  ),
                } : undefined,
              },
            });
          });

        }

        return updatedOrg;
      } catch (err) {
        console.log(err);
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.organization.findMany({
      include: {
        tags: true,
      },
    });
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.organization.findUnique({
          where: {
            id: input.id,
          },
          include: {
            resources: true,
            tags: true,
            categoryMeta: true,
            helpfulToCommunities: true,
            exclusiveToCommunities: true,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }),
});

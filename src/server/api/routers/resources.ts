import { z } from "zod";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { getTagsFromResources } from "./tag";

export const resourceRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const resources = await ctx.prisma.resource.findMany({
      include: {
        tags: true,
        categoryMeta: true,
        organization: {
          select: {
            name: true,
            phone: true,
            email: true,
            website: true,
          },
        },
      },
    });
    return resources;
  }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const resource = await ctx.prisma.resource.findUnique({
      where: {
        id: input,
      },
      include: {
        organization: true,
        categoryMeta: true,
        tags: true,
        helpfulToCommunities: true,
        exclusiveToCommunities: true,
        helpingOrganizations: true,
      },
    });
    return resource;
  }),
  getByCategory: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const resources = await ctx.prisma.resource.findMany({
          where: {
            category: {
              mode: "insensitive",
              equals: input,
            },
          },
          include: {
            organization: true,
            categoryMeta: true,
            tags: true,
          },
        });

        const uniqueTags = getTagsFromResources(resources);

        return { resources, tags: uniqueTags };
      } catch (e) {
        console.log(e);
      }
    }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string(),
        orgId: z.string(),
        helpingOrganizations: z.array(z.string()).optional(),
        url: z.string().nullish(),
        tags: z.array(z.string()).optional(),
        exclusiveToCommunities: z.array(z.string()).optional(),
        helpfulToCommunities: z.array(z.string()).optional(),
        barriersToEntry: z
          .enum(["MINIMAL", "LOW", "MEDIUM", "HIGH"])
          .optional(),
        barriersToEntryDetails: z.string().optional(),
        speedOfAid: z
          .array(z.enum(["IMMEDIATE", "DAYS", "WEEKS", "MONTHS", "YEARS"]))
          .optional(),
        speedOfAidDetails: z.string().optional(),
        free: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        description,
        category,
        orgId,
        helpingOrganizations,
        url,
        tags,
        exclusiveToCommunities,
        helpfulToCommunities,
        barriersToEntry,
        barriersToEntryDetails,
        speedOfAid,
        speedOfAidDetails,
        free,
      } = input;

      let newName = name.replace(/\s/g, "-").toLowerCase();

      const newNameIsUnique =
        (await ctx.prisma.resource.findUnique({
          where: {
            id: newName,
          },
          select: {
            id: true,
          },
        })) === null;

      if (!newNameIsUnique) {
        const orgName = await ctx.prisma.organization.findUnique({
          where: {
            id: orgId,
          },
          select: {
            name: true,
          },
        });

        // remove any punctuation and get organization initials
        const orgInitials = orgName
          ? orgName.name
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toLowerCase()
          : Math.random().toString(36).substring(10);

        newName = `${newName}-${orgInitials}`;
      }

      const newResource = await ctx.prisma.resource.create({
        data: {
          id: newName,
          name: name,
          description: description,
          url: url,
          categoryMeta: {
            connectOrCreate: {
              where: { category: category },
              create: {
                category: category,
              },
            },
          },
          organization: {
            connect: {
              id: orgId,
            },
          },
          helpingOrganizations: helpingOrganizations && {
            connect: helpingOrganizations?.map((org) => ({
              id: org,
            })),
          },

          tags: {
            connectOrCreate: tags
              ? tags.map((tag) => ({
                  where: { tag },
                  create: {
                    tag,
                  },
                }))
              : [],
          },

          exclusiveToCommunities: exclusiveToCommunities
            ? {
                connectOrCreate: exclusiveToCommunities.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                })),
              }
            : undefined,

          helpfulToCommunities: helpfulToCommunities
            ? {
                connectOrCreate: helpfulToCommunities.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                })),
              }
            : undefined,

          barriersToEntry: barriersToEntry,
          barriersToEntryDetails: barriersToEntryDetails,

          speedOfAid: speedOfAid,
          speedOfAidDetails: speedOfAidDetails,

          free: free,
        },
      });
      return newResource;
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nullish(),
        description: z.string().nullish(),
        category: z.string().nullish(),
        url: z.string().nullish(),
        tags: z.array(z.string()).optional(),
        helpfulTo: z.array(z.string()).optional(),
        exclusiveTo: z.array(z.string()).optional(),
        barriersToEntry: z
          .enum(["MINIMAL", "LOW", "MEDIUM", "HIGH"])
          .optional(),
        barriersToEntryDetails: z.string().optional(),

        speedOfAid: z
          .array(z.enum(["IMMEDIATE", "DAYS", "WEEKS", "MONTHS", "YEARS"]))
          .optional(),
        speedOfAidDetails: z.string().optional(),
        free: z.boolean().optional(),
        helpingOrganizations: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        id,
        name,
        description,
        category,
        url,
        tags,
        helpfulTo,
        exclusiveTo,
        barriersToEntry,
        barriersToEntryDetails,
        speedOfAid,
        speedOfAidDetails,
        free,
        helpingOrganizations,
      } = input;

      console.log(helpingOrganizations);

      const resource = await ctx.prisma.resource.update({
        where: {
          id: id,
        },
        data: {
          name: name || undefined,
          description: description || undefined,
          categoryMeta: category
            ? {
                connectOrCreate: {
                  where: { category: category },
                  create: {
                    category: category,
                  },
                },
              }
            : undefined,
          helpingOrganizations: helpingOrganizations && {
            connect: helpingOrganizations.map((org) => ({
              id: org,
            })),
          },

          tags: {
            connectOrCreate: tags
              ? tags.map((tag) => ({
                  where: { tag },
                  create: {
                    tag,
                  },
                }))
              : [],
          },
          url: url,
          helpfulToCommunities: {
            connectOrCreate: helpfulTo
              ? helpfulTo.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                }))
              : [],
          },

          exclusiveToCommunities: {
            connectOrCreate: exclusiveTo
              ? exclusiveTo.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                }))
              : [],
          },

          barriersToEntry: barriersToEntry,
          barriersToEntryDetails: barriersToEntryDetails,

          speedOfAid: speedOfAid,
          speedOfAidDetails: speedOfAidDetails,

          free: free,
        },
      });
      return resource;
    }),

  reassignAdministeringOrg: adminProcedure
    .input(
      z.object({
        resourceId: z.string(),
        orgId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { resourceId, orgId } = input;

      const resource = await ctx.prisma.resource.update({
        where: {
          id: resourceId,
        },
        data: {
          organization: {
            connect: {
              id: orgId,
            },
          },
        },
      });
      return resource;
    }),
});

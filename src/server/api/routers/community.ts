import { z } from "zod";
import { adminProcedure, router, publicProcedure } from "../trpc";

export const communityRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.community.findMany();
  }),
  getByName: publicProcedure
    .input(z.object({ community: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.community.findFirst({
        where: { name: { equals: input.community } },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.community.findUnique({
        where: { id: input.id },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string().optional(),
        exclusiveOrgs: z.string().array().optional(),
        helpfulOrgs: z.string().array().optional(),
        exclusivePrograms: z.string().array().optional(),
        helpfulPrograms: z.string().array().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        slug,
        exclusiveOrgs,
        helpfulOrgs,
        exclusivePrograms,
        helpfulPrograms,
      } = input;

      return await ctx.prisma.community.create({
        data: {
          name,
          slug: slug || name.toLowerCase().replace(/ /g, "-"),
          exclusiveOrgs: {
            connect:
              exclusiveOrgs &&
              exclusiveOrgs.map((org) => {
                return { id: org };
              }),
          },
          helpfulOrgs: {
            connect:
              helpfulOrgs &&
              helpfulOrgs.map((org) => {
                return { id: org };
              }),
          },
          exclusivePrograms: {
            connect:
              exclusivePrograms &&
              exclusivePrograms.map((program) => {
                return { id: program };
              }),
          },

          helpfulPrograms: {
            connect:
              helpfulPrograms &&
              helpfulPrograms.map((program) => {
                return { id: program };
              }),
          },
        },
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
        id: z.string(),
        slug: z.string().optional(),
        exclusiveOrgs: z.string().array().optional(),
        helpfulOrgs: z.string().array().optional(),
        exclusivePrograms: z.string().array().optional(),
        helpfulPrograms: z.string().array().optional(),
        parentCommunityIds: z.string().array().optional(),
        subCommunityIds: z.string().array().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        id,
        slug,
        exclusiveOrgs,
        helpfulOrgs,
        exclusivePrograms,
        helpfulPrograms,
        parentCommunityIds,
        subCommunityIds,
      } = input;

      return await ctx.prisma.community.update({
        where: { id },
        data: {
          name: name,
          slug: slug,
          exclusiveOrgs: exclusiveOrgs
            ? {
                connect: exclusiveOrgs.map((org) => {
                  return { id: org };
                }),
              }
            : undefined,
          helpfulOrgs: helpfulOrgs
            ? {
                connect: helpfulOrgs.map((org) => {
                  return { id: org };
                }),
              }
            : undefined,
          exclusivePrograms: exclusivePrograms
            ? {
                connect: exclusivePrograms.map((program) => {
                  return { id: program };
                }),
              }
            : undefined,

          helpfulPrograms: helpfulPrograms
            ? {
                connect: helpfulPrograms.map((program) => {
                  return { id: program };
                }),
              }
            : undefined,

          parentCommunities: parentCommunityIds
            ? {
                connect: parentCommunityIds.map((id) => {
                  return { id: id };
                }),
              }
            : undefined,

          subCommunities: subCommunityIds
            ? {
                connect: subCommunityIds.map((id) => {
                  return { id: id };
                }),
              }
            : undefined,
        },
      });
    }),

  disconnectParentCommunity: adminProcedure
    .input(
      z.object({
        communityId: z.string(),
        parentId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { id: input.communityId },
        data: {
          parentCommunities: {
            disconnect: {
              id: input.parentId,
            },
          },
        },
      });
    }),

  connectExclusiveProgram: adminProcedure
    .input(
      z.object({
        community: z.string(),
        programId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          exclusivePrograms: {
            connect: {
              id: input.programId,
            },
          },
        },
      });
    }),

  connectExclusiveOrg: adminProcedure
    .input(
      z.object({
        community: z.string(),
        orgId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          exclusiveOrgs: {
            connect: {
              id: input.orgId,
            },
          },
        },
      });
    }),

  disconnectExclusiveProgram: adminProcedure
    .input(
      z.object({
        community: z.string(),
        programId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          exclusivePrograms: {
            disconnect: {
              id: input.programId,
            },
          },
        },
      });
    }),

  disconnectExclusiveOrg: adminProcedure
    .input(
      z.object({
        community: z.string(),
        orgId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          exclusiveOrgs: {
            disconnect: {
              id: input.orgId,
            },
          },
        },
      });
    }),

  connectHelpfulProgram: adminProcedure
    .input(
      z.object({
        community: z.string(),
        programId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          helpfulPrograms: {
            connect: {
              id: input.programId,
            },
          },
        },
      });
    }),

  connectHelpfulOrg: adminProcedure
    .input(
      z.object({
        community: z.string(),
        orgId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          helpfulOrgs: {
            connect: {
              id: input.orgId,
            },
          },
        },
      });
    }),

  disconnectHelpfulProgram: adminProcedure
    .input(
      z.object({
        community: z.string(),
        programId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          helpfulPrograms: {
            disconnect: {
              id: input.programId,
            },
          },
        },
      });
    }),
});

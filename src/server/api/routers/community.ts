import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const communityRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.community.findMany();
  }),
  getByName: publicProcedure
    .input(z.object({ community: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.community.findFirst({
        where: { name: {equals: input.community, mode: 'insensitive'} },
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
        id: z.string().optional(),
        exclusiveOrgs: z.string().array().optional(),
        helpfulOrgs: z.string().array().optional(),
        exclusiveResources: z.string().array().optional(),
        helpfulResources: z.string().array().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        id,
        exclusiveOrgs,
        helpfulOrgs,
        exclusiveResources,
        helpfulResources,
      } = input;


      return await ctx.prisma.community.create({
        data: {
          name,
          id: id || name.toLowerCase().replace(/ /g, "-"),
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
          exclusiveResources: {
            connect:
              exclusiveResources &&
              exclusiveResources.map((resource) => {
                return { id: resource };
              }),
          },

          helpfulResources: {
            connect:
              helpfulResources &&
              helpfulResources.map((resource) => {
                return { id: resource };
              }),
          },
        },
      });
    }),

  connectExclusiveResource: adminProcedure
    .input(
      z.object({
        community: z.string(),
        resourceId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          exclusiveResources: {
            connect: {
              id: input.resourceId,
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

  disconnectExclusiveResource: adminProcedure
    .input(
      z.object({
        community: z.string(),
        resourceId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          exclusiveResources: {
            disconnect: {
              id: input.resourceId,
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

  connectHelpfulResource: adminProcedure
    .input(
      z.object({
        community: z.string(),
        resourceId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          helpfulResources: {
            connect: {
              id: input.resourceId,
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
    }
    ),

  disconnectHelpfulResource: adminProcedure
    .input(
      z.object({
        community: z.string(),
        resourceId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.community.update({
        where: { name: input.community },
        data: {
          helpfulResources: {
            disconnect: {
              id: input.resourceId,
            },
          },
        },
      });
    }
    ),
});

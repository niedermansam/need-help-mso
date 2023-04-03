import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const communityRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.community.findMany();
  }),
  getById: publicProcedure
    .input(z.object({ community: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.community.findUnique({
        where: { name: input.community },
      });
    }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        exclusiveOrgs: z.string().array().optional(),
        helpfulOrgs: z.string().array().optional(),
        exclusiveResources: z.string().array().optional(),
        helpfulResources: z.string().array().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        exclusiveOrgs,
        helpfulOrgs,
        exclusiveResources,
        helpfulResources,
      } = input;
      return await ctx.prisma.community.create({
        data: {
          name,
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

  connectResource: adminProcedure
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

  connectOrg: adminProcedure
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

  disconnectResource: adminProcedure
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

  disconnectOrg: adminProcedure
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
});

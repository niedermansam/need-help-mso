import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tag.findMany();
    return tags;
  }),
  connectCategories: publicProcedure.mutation(async ({ ctx }) => {
    const resources = await ctx.prisma.resource.findMany({
      include: { tags: true },
    });

    for (const resource of resources) {
      for (const tag of resource.tags) {
        await ctx.prisma.tag.update({
          where: { tag: tag.tag },
          data: {
            categories: {
              connect: {
                category: resource.category,
              },
            },
          },
        });
      }
    }

    const organizations = await ctx.prisma.organization.findMany({
      include: { tags: true },
    });

    for (const organization of organizations) {
      for (const tag of organization.tags) {
        await ctx.prisma.tag.update({
          where: { tag: tag.tag },
          data: {
            categories: {
              connect: {
                category: organization.category,
              },
            },
          },
        });
      }
    }

    return true;
  }),
  connectOrganization: publicProcedure.input(z.object({orgId: z.string(), tag: z.string()})).mutation(async ({ ctx, input }) => {
    await ctx.prisma.tag.upsert({
      where: { tag: input.tag },
      create: {
        tag: input.tag,
        organizations: {
          connect: {
            id: input.orgId,
          },
        },
      },
      update: {
        organizations: {
          connect: {
            id: input.orgId,
          },
        },
      },
    })

    return true;
  }),

  connectResource: publicProcedure.input(z.object({resourceId: z.string(), tag: z.string()})).mutation(async ({ ctx, input }) => {
    await ctx.prisma.tag.upsert({
      where: { tag: input.tag },
      create: {
        tag: input.tag,
        resources: {
          connect: {
            id: input.resourceId,
          },
        },
      },
      update: {
        resources: {
          connect: {
            id: input.resourceId,
          },
        },
      },
    })

    return true;
  }),


  
});

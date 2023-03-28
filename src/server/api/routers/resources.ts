import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const resourceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string(),
        orgId: z.string(),
        url: z.string().nullish(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, description, category, orgId, url, tags } = input;

      const newResource = await ctx.prisma.resource.create({
        data: {
          name: name,
          description: description,
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
        },
      });
      return newResource;
    }),
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
      },
    });
    return resource;
  }),
  getByCategory: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
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
      return resources;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nullish(),
        description: z.string().nullish(),
        category: z.string().nullish(),
        orgId: z.string().nullish(),
        url: z.string().nullish(),
        tags: z.array(z.string()).optional(),
        helpfulTo: z.array(z.string()).optional(),
        exclusiveTo: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, name, description, category, orgId, url, tags } = input;

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
          organization: orgId
            ? {
                connect: {
                  id: orgId,
                },
              }
            : undefined,

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
            connectOrCreate: input.helpfulTo
              ? input.helpfulTo.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                }))
              : [],
          },

          exclusiveToCommunities: {
            connectOrCreate: input.exclusiveTo
              ? input.exclusiveTo.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                }))
              : [],
          },
        },
      });
      return resource;
    }),
});

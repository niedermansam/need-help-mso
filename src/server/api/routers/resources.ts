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

      if (tags && tags[0]) {
        await ctx.prisma.tag.createMany({
          data: tags.map((tag) => ({
            tag: tag,
            resource: {
              connect: {
                id: newResource.id,
              },
            },
          })),
        });
      }
    }),
    getAll: publicProcedure.query(async({ctx}) => {
      const resources = await ctx.prisma.resource.findMany({
        include: {
          tags: true,
          categoryMeta: true,
          organization: {
            select: {
              name: true,
            }
          },

        },
      });
      return resources;
    })
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const resource = await ctx.prisma.resource.findUnique({
      where: {
        id: input,
      },
      include: {
        organization: true,
        categoryMeta: true,
        tags: true,
      },
    });
    return resource;
  }),
});

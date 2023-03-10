import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const resourceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string(),
        orgName: z.string(),
        url: z.string(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, description, category, orgName, url, tags } = input;

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
              name: orgName,
            },
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
});

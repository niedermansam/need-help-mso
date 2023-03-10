import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import Airtable from "airtable";
import { NextResponse } from "next/server";

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
          name: input.name,
          description: input.description,
          categoryMeta: {
            connectOrCreate: {
              where: { category: input.category },
              create: {
                category: input.category,
              },
            },
          },
          organization: {
            connect: {
              name: input.orgName,
            },
          },
          url: input.url,
        },
      });

      if (tags && tags[0]) {
        ctx.prisma.tag.createMany({
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

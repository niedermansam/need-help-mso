import { z } from "zod";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { decodeTag } from "../../../utils/manageUrl";
import type { Resource, Organization, Tag, Category } from "@prisma/client";

type ResourceArray = (Resource & {
  organization: Organization;
  tags: Tag[];
  categoryMeta: Category;
})[];

export const getTagsFromResources = (resources: ResourceArray) => {
  const tags = resources.map((resource) => resource.tags).flat();
  const uniqueTags = [...new Set(tags.map((tag) => tag.tag))];
  return uniqueTags;
};

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const tags = await ctx.prisma.tag.findMany();
      return tags;
    } catch (err) {
      console.log(err);
    }
  }),
  connectCategories: adminProcedure.mutation(async ({ ctx }) => {
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
  connectOrganization: adminProcedure
    .input(z.object({ orgId: z.string(), tag: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
      });

      return true;
    }),

  connectResource: adminProcedure
    .input(z.object({ resourceId: z.string(), tag: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
      });

      return true;
    }),

  getResources: publicProcedure
    .input(z.object({ tag: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const decodedTag = decodeTag(input.tag);
        const tagArray = await ctx.prisma.tag.findMany({
          where: {
            tag: {
              equals: decodedTag,
              mode: "insensitive",
            },
          },
          include: {
            resources: {
              include: {
                tags: true,
                categoryMeta: true,
                organization: true,
              },
            },
            organizations: {
              include: {
                tags: true,
              },
            },
          },
        });

        const resources = tagArray.map((tag) => tag.resources).flat();
        const organizations = tagArray.map((tag) => tag.organizations).flat();

        return { resources, organizations };
      } catch (err) {
        console.log(err);
      }
    }),
});

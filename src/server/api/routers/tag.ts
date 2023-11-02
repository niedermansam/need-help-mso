import { z } from "zod";

import { volunteerProcedure, router, publicProcedure, adminProcedure } from "../trpc";
import { decodeTag } from "../../../utils/manageUrl";
import type { Program, Organization, Tag, Category } from "@prisma/client";

type ProgramArray = (Program & {
  organization: Organization;
  tags: Tag[];
  categoryMeta: Category;
})[];

export const getTagsFromPrograms = (programs: ProgramArray) => {
  const tags = programs.map((program) => program.tags).flat();
  const uniqueTags = [...new Set(tags.map((tag) => tag.tag))];
  return uniqueTags;
};

export const tagRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const tags = await ctx.prisma.tag.findMany();
      return tags;
    } catch (err) {
      console.log(err);
    }
  }),
  connectCategories: volunteerProcedure.mutation(async ({ ctx }) => {
    const programs = await ctx.prisma.program.findMany({
      include: { tags: true },
    });

    for (const program of programs) {
      for (const tag of program.tags) {
        await ctx.prisma.tag.update({
          where: { tag: tag.tag },
          data: {
            categories: {
              connect: {
                category: program.category,
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
  connectOrganization: volunteerProcedure
    .input(z.object({ orgId: z.string(), tag: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.tag.upsert({
        where: { tag: input.tag },
        create: {
          tag: input.tag,
          name: input.tag,
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
  disconnectOrganization: volunteerProcedure
    .input(z.object({ orgId: z.string(), tag: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.tag.update({
        where: { tag: input.tag },
        data: {
          organizations: {
            disconnect: {
              id: input.orgId,
            },
          },
        },
      });

      return true;
    }),



  connectProgram: volunteerProcedure
    .input(z.object({ programId: z.string(), tag: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.tag.upsert({
        where: { tag: input.tag },
        create: {
          tag: input.tag,
          name: input.tag,
          programs: {
            connect: {
              id: input.programId,
            },
          },
        },
        update: {
          programs: {
            connect: {
              id: input.programId,
            },
          },
        },
      });

      return true;
    }),

  getPrograms: publicProcedure
    .input(z.object({ tag: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const decodedTag = decodeTag(input.tag);
        const tagArray = await ctx.prisma.tag.findMany({
          where: {
            tag: {
              equals: decodedTag,
            },
          },
          select: {
            programs: {
              select: {
                id: true,
                name: true,
                description: true,
                url: true,
                organizationId: true,
                category: true,
                organization: true,
                categoryMeta: true,
                barriersToEntry: true,
                barriersToEntryDetails: true,
                free: true,
                tags: {
                  select: {
                    tag: true,
                  },
                },
              },
            },
            organizations: {
              select: {
                id: true,
                name: true,
                description: true,
                website: true,
                categoryMeta: true,
                category: true,
                phone: true,
                email: true,
                tags: {
                  select: {
                    tag: true,
                  },
                },
              },
            },
          },
        });

        const programs = tagArray.map((tag) => tag.programs).flat();
        const organizations = tagArray.map((tag) => tag.organizations).flat();

        return { programs, organizations };
      } catch (err) {
        console.log(err);
      }
    }),

    update: adminProcedure
    .input(z.object({ old: z.string(), new: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.$transaction([
          ctx.prisma.$executeRaw`UPDATE Tag SET tag = ${input.new}, name = ${input.new} WHERE tag = ${input.old}`,
          ctx.prisma.$executeRaw`UPDATE _ProgramToTag SET B = ${input.new} WHERE B = ${input.old}`,
          ctx.prisma.$executeRaw`UPDATE _OrganizationToTag SET B = ${input.new} WHERE B = ${input.old}`,
        ])

      } catch (err) {
        console.log(err);
      }
    }),
});

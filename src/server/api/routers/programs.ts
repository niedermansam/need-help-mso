import { z } from "zod";

import { adminProcedure, router, publicProcedure } from "../trpc";
import { getTagsFromPrograms } from "./tag";

const createProgramId = (name: string, orgName: string) => {
  let newId = name.trim().replace(/\s/g, "-").toLowerCase();

  // remove any punctuation
  newId = newId.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

  // remove any special characters
  newId = newId.replace(/[^\w\s]/gi, "");

  // remove any duplicate dashes
  newId = newId.replace(/-+/g, "-");

  // remove any dashes at the beginning or end
  newId = newId.replace(/^-+|-+$/g, "");

  // get organization initials
  const orgInitials = orgName
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toLowerCase();

  return newId + "-" + orgInitials;
};

export const programRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const programs = await ctx.prisma.program.findMany({
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
    return programs;
  }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const program = await ctx.prisma.program.findUnique({
      where: {
        id: input,
      },
      include: {
        organization: true,
        categoryMeta: true,
        tags: true,
        helpfulToCommunities: true,
        exclusiveToCommunities: true,
        helpingOrganizations: true,
      },
    });
    return program;
  }),
  getByCategory: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const programs = await ctx.prisma.program.findMany({
          where: {
            category: {
              equals: input,
            },
          },
          include: {
            organization: true,
            categoryMeta: true,
            tags: true,
          },
        });

        const uniqueTags = getTagsFromPrograms(programs);

        return { programs, tags: uniqueTags };
      } catch (e) {
        console.log(e);
      }
    }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullish(),
        phone: z.string().nullish(),
        category: z.string(),
        orgId: z.string(),
        orgName: z.string(),
        helpingOrganizations: z.array(z.string()).optional(),
        url: z.string().nullish(),
        tags: z.array(z.string()).optional(),
        exclusiveToCommunities: z.array(z.string()).optional(),
        helpfulToCommunities: z.array(z.string()).optional(),
        barriersToEntry: z
          .enum(["MINIMAL", "LOW", "MEDIUM", "HIGH"])
          .optional(),
        barriersToEntryDetails: z.string().optional(),
        speedOfAid: z
          .array(z.enum(["IMMEDIATE", "DAYS", "WEEKS", "MONTHS", "YEARS"]))
          .optional(),
        speedOfAidDetails: z.string().optional(),
        free: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        name,
        description,
        category,
        orgId,
        orgName,
        helpingOrganizations,
        url,
        tags,
        exclusiveToCommunities,
        helpfulToCommunities,
        free,
      } = input;

      let newId = name
        .replace(/\s/g, "-")

        .toLowerCase();

      const newIdIsUnique =
        (await ctx.prisma.program.findUnique({
          where: {
            id: newId,
          },
          select: {
            id: true,
          },
        })) === null;

      if (!newIdIsUnique) {
        const orgName = await ctx.prisma.organization.findUnique({
          where: {
            id: orgId,
          },
          select: {
            name: true,
          },
        });

        // remove any punctuation and get organization initials
        const orgInitials = orgName
          ? orgName.name
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toLowerCase()
          : Math.random().toString(36).substring(10);

        newId = `${newId}-${orgInitials}`;
      }

      const newProgram = await ctx.prisma.program.create({
        data: {
          id: createProgramId(name, orgName),
          name: name,
          description: description || undefined,
          url: url,
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
          helpingOrganizations: helpingOrganizations && {
            connect: helpingOrganizations?.map((org) => ({
              id: org,
            })),
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

          exclusiveToCommunities: exclusiveToCommunities
            ? {
                connectOrCreate: exclusiveToCommunities.map((community) => ({
                  where: { id: community },
                  create: {
                    name: community,
                  },
                })),
              }
            : undefined,

          helpfulToCommunities: helpfulToCommunities
            ? {
                connectOrCreate: helpfulToCommunities.map((community) => ({
                  where: { id: community },
                  create: {
                    name: community,
                  },
                })),
              }
            : undefined,

          free: free,
        },
      });
      return newProgram;
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nullish(),
        phone: z.string().nullish(),
        description: z.string().nullish(),
        category: z.string().nullish(),
        url: z.string().nullish(),
        tags: z.array(z.string()).optional(),
        helpfulTo: z.array(z.string()).optional(),
        exclusiveToCommunities: z.array(z.string()).optional(),
        helpfulToCommunities: z.array(z.string()).optional(),
        barriersToEntry: z.enum(["MINIMAL", "LOW", "MEDIUM", "HIGH"]).nullish(),
        barriersToEntryDetails: z.string().nullish(),

        speedOfAid: z
          .array(z.enum(["IMMEDIATE", "DAYS", "WEEKS", "MONTHS", "YEARS"]))
          .nullish(),
        speedOfAidDetails: z.string().nullish(),
        free: z.boolean().nullish(),
        helpingOrganizations: z.array(z.string()).nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        id,
        name,
        description,
        category,
        url,
        tags,
        helpfulTo,
        phone,
        exclusiveToCommunities: exclusiveTo,
        free,
        helpingOrganizations,
      } = input;

      const oldProgram = await ctx.prisma.program.update({
        where: {
          id: id,
        },
        include: {
          tags: true,
          exclusiveToCommunities: true,
          helpfulToCommunities: true,
        },
        data: {
          name: name || undefined,
          description: description || undefined,
          phone: phone || undefined,
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
          helpingOrganizations:
            (helpingOrganizations && {
              connect: helpingOrganizations.map((org) => ({
                id: org,
              })),
            }) ||
            undefined,

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
            connectOrCreate: helpfulTo
              ? helpfulTo.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                }))
              : [],
          },

          free: free || undefined,
        },
      });

      // update org with new tags

      await ctx.prisma.program.update({
        where: {
          id: input.id,
        },
        data: {
          tags: {
            disconnect: oldProgram.tags.filter((tag) => {
              if (!input.tags) return true;
              return !input.tags.find((tag2) => tag2 === tag.tag);
            }),
          },
        },
      });

      // get exclusiveToCommunities that were removed from old program

      await ctx.prisma.program.update({
        where: {
          id: input.id,
        },
        data: {
          exclusiveToCommunities: {
            disconnect: oldProgram.exclusiveToCommunities.filter(
              (community) => {
                if (!input.exclusiveToCommunities) return true;
                return !input.exclusiveToCommunities.find(
                  (community2) => community2 === community.id
                );
              }
            ),
            connectOrCreate: input.exclusiveToCommunities
              ? input.exclusiveToCommunities.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                }))
              : undefined,
          },
        },
      });

      // get helpfulToCommunities that were removed from old program
      await ctx.prisma.program.update({
        where: {
          id: input.id,
        },
        data: {
          helpfulToCommunities: {
            disconnect: oldProgram.helpfulToCommunities.filter((community) => {
              if (!input.helpfulTo) return true;
              return !input.helpfulTo.find(
                (community2) => community2 === community.id
              );
            }),
            connectOrCreate: input.helpfulTo
              ? input.helpfulTo.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                }))
              : undefined,
          },
        },
      });
      return oldProgram;
    }),

  reassignAdministeringOrg: adminProcedure
    .input(
      z.object({
        programId: z.string(),
        orgId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { programId, orgId } = input;

      const program = await ctx.prisma.program.update({
        where: {
          id: programId,
        },
        data: {
          organization: {
            connect: {
              id: orgId,
            },
          },
        },
      });
      return program;
    }),
});

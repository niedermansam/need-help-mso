import { z } from "zod";

import { adminProcedure, router, publicProcedure, volunteerProcedure } from "../trpc";
import { getTagsFromPrograms } from "./tag";
import { kysely } from "@/server/kysely";

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
  create: volunteerProcedure
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
                    name: tag
                  },
                }))
              : [],
          },

          exclusiveToCommunities: exclusiveToCommunities
            ? {
                connectOrCreate: exclusiveToCommunities.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                })),
              }
            : undefined,

          helpfulToCommunities: helpfulToCommunities
            ? {
                connectOrCreate: helpfulToCommunities.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                })),
              }
            : undefined,

          free: free,
        },
      });

      await ctx.prisma.organization.update({
        where: {
          id: orgId,
        },
        data: {
          categories: {
            connect: {
              category: category,
            },
          },
        },
      });

      return newProgram;
    }),
  update: volunteerProcedure
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
        helpfulToCommunities,
        exclusiveToCommunities,
        phone,
        free,
      } = input;



      type OldData =  {
        type: string;
        array: string[];
      }[];

      const oldData = await ctx.prisma
        .$queryRaw<OldData>`SELECT type, JSON_ARRAYAGG(id) as array FROM (SELECT _tags.B as id, "tags" as type 
FROM _ProgramToTag as _tags 
WHERE A = ${id} 
UNION 
SELECT _exclusive.A as exclusiveCommunities, "exclusive" from _ExclusiveProgram as _exclusive
WHERE B = ${id}
UNION 
SELECT _helpful.A as helpful, "helpful" from _HelpfulProgram as _helpful
WHERE B = ${id}) as Foo
GROUP BY type;`;



const oldTagData = oldData.find((x) => x.type === "tags")?.array || [];

const oldExclusiveData = oldData.find((x) => x.type === "exclusive")?.array || [];

const oldHelpfulData = oldData.find((x) => x.type === "helpful")?.array || [];

      const newTags = tags?.filter((tag) => !oldTagData.includes(tag)) || [];

      const removedTags = oldTagData.filter((tag) => !tags?.includes(tag));

      const newExclusive = exclusiveToCommunities?.filter(
        (community) => !oldExclusiveData.includes(community)
      );

      const removedExclusive = oldExclusiveData.filter(
        (community) => !exclusiveToCommunities?.includes(community)
      );

      const newHelpful = helpfulToCommunities?.filter(
        (community) => !oldHelpfulData.includes(community)
      );

      const removedHelpful = oldHelpfulData.filter(
        (community) => !helpfulToCommunities?.includes(community)
      );






      const oldProgram = await ctx.prisma.program.update({
        where: {
          id: id,
        },
        select: {
          organization: {
            select: {
              id: true,
            },
          },
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

          tags: {
            connectOrCreate: newTags.map((tag) => ({
                  where: { tag },
                  create: {
                    tag,
                    name: tag
                  },
                })),
            disconnect: removedTags.map((tag) => ({
                  tag,
                })),
          },
          url: url,
          helpfulToCommunities: {
            connectOrCreate: newHelpful?.map((community) => ({
                  where: { name: community },
                  create: {
                    name: community,
                  },
                })),
            disconnect: removedHelpful.map((community) => ({
                  name: community,
                })),


          },
          exclusiveToCommunities: {
            connectOrCreate: newExclusive?.map((community) => ({

                  where: { name: community },
                  create: {
                    name: community,
                  },
                })),
            disconnect: removedExclusive.map((community) => ({
                  name: community,
                })),

          },

          free: free || undefined,
        },
      });

      if (category)
        await ctx.prisma.organization.update({
          where: {
            id: oldProgram.organization.id,
          },
          data: {
            categories: {
              connect: {
                category: category,
              },
            },
          },
        });


        console.log("FINISHED UPDATE")

      return oldProgram;
    }),


    updateTags: volunteerProcedure  
      .input(z.object({
        programId: z.string(),
        addedTags: z.set(z.string()).optional(),
        removedTags: z.set(z.string()).optional(),
      })).mutation(async ({ input, ctx }) => {
        const { programId, addedTags, removedTags } = input;

        console.log(addedTags)

        const addedTagsArr = addedTags ? [...addedTags] : [];

       await ctx.prisma.tag.createMany({
          data:  addedTagsArr.map((tag) => ({ tag, name: tag })),
          skipDuplicates: true,
        });


        const program = await ctx.prisma.program.update({
          where: {
            id: programId,
          },
          select: {
            tags: {
              select: {
                tag: true,
              },
            },
          },
          data: {
            tags: {
              connect: addedTagsArr ? addedTagsArr.map((tag) => ({ tag })) : undefined,
              disconnect: removedTags ? [...removedTags].map((tag) => ({ tag })) : undefined,
            },
          },
        });

        return program;
      }
    ),

  reassignAdministeringOrg: volunteerProcedure
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

  delete: adminProcedure
    .input(
      z.object({
        programId: z.string(),
        confirmString: z.string().includes("confirm"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.confirmString !== "confirm")
        throw new Error(
          "Please confirm that you want to delete this program"
        );
      try {
        return await ctx.prisma.program.delete({
          where: {
            id: input.programId,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }),
});

import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import Airtable from "airtable";

interface OrganizationSchema {
  Tags?: string[];
  URL?: string;
  Category?: string;
  "Resources Available"?: string[];
  Expertise: string;
  Name: string;
  "Administer of"?: string[];
  "Resource Names"?: string[];
  id: string;
  Contacts?: string[];
  Notes?: string;
  Phone?: string;
  Email?: string;
  "Affiliated Organizations"?: string[];
}

interface ResourceSchema {
  Contacts?: string[];
  Name: string;
  "Forms & Files"?: string[];
  Provides: string;
  "Administering Org"?: string[];
  Organizations?: string[];
  "Organization Names"?: string[];
  "Income Restrictions"?: boolean;
  Tags: string[];
  URL?: string;
  "Ease of Aid"?: string;
  resources?: string[];
  Funding: string;
  "File Names"?: string[];
  id: string;
  "Communities Served"?: string[];
  "Exclusive to Communities Served"?: boolean;
  Notes?: string;
  "Income Restrictions Details"?: string;
}

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.organization.create({
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
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.organization.findMany();
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
        try {
      return await ctx.prisma.organization.findUnique({
        where: {
          id: input.id,
        },
        include: {
            resources: true
        }
      });} catch (err) {
        console.log(err)
      }
    }),

  syncAirtableOrgs: publicProcedure.mutation(async ({ ctx }) => {
    const base = new Airtable({
      apiKey:
        "patQokBzWVmDj821y.729da362fc840f86665519df7170ee4bbb90a402e406b37dc0e0267434e911d7",
    }).base("appZYx8yOoxvAISJG");

    base("Organizations")
      .select({
        // Selecting the first 3 records in Grid view:
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(async function (record) {
            const fields = record.fields as unknown as OrganizationSchema;
            /*
            const newTags = fields.Tags?.map(async(tag) => {
            await ctx.prisma.tag.create({data: {
                tag: tag,
                description: ''
            }})
            return {tag: tag}
            })

 */

            await ctx.prisma.organization.create({
              data: {
                name: fields.Name,
                description: fields.Notes || "",
                categoryMeta: {
                  connectOrCreate: {
                    where: { category: fields.Expertise },
                    create: {
                      category: fields.Expertise,
                      description: "",
                    },
                  },
                },
                tags: {
                  connect: fields.Tags?.map((tag) => {
                    return { tag: tag };
                  }),
                },
                website: fields.URL,
                phone: fields.Phone,
                email: fields.Email,
              },
            });
          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  }),

  syncAirtableResources: publicProcedure.mutation(async ({ ctx }) => {
    const base = new Airtable({
      apiKey:
        "patQokBzWVmDj821y.729da362fc840f86665519df7170ee4bbb90a402e406b37dc0e0267434e911d7",
    }).base("appZYx8yOoxvAISJG");

    base("Resources")
      .select({
        // Selecting the first 3 records in Grid view:
        view: "Organization View",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          // This function (`page`) will get called for each page of records.

          records.forEach(async function (record) {
            const fields = record.fields as unknown as ResourceSchema;
            /*
            const newTags = fields.Tags?.map(async (tag) => {
              await ctx.prisma.tag.create({
                data: {
                  tag: tag,
                  description: "",
                },
              });
              return { tag: tag };
            });
        */

            console.log(
              "CONSOLE________________________________________- ",
              fields["Administering Org"]
                ? fields["Administering Org"][0]
                : "whoops"
            );

            /*
            await ctx.prisma.resources.create({
              data: {
                name: fields.Name,
                description: fields.Notes || "",
                categoryMeta: {
                  connectOrCreate: {
                    where: { category: fields.Provides },
                    create: {
                      category: fields.Provides,
                      description: "",
                    },
                  },
                },
                tags: {
                  connect: fields.Tags?.map((tag) => {
                    return { tag: tag };
                  }),
                },
                url: fields.URL || "",
                organization: {
                  connect: {
                    name: fields["Administering Org"]
                      ? fields["Administering Org"][0]
                      : undefined,
                  },
                },
              },
            });
            */

          });

          // To fetch the next page of records, call `fetchNextPage`.
          // If there are more records, `page` will get called again.
          // If there are no more records, `done` will get called.
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
  }),
});

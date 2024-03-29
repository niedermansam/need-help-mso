import { z } from "zod";

import { router, publicProcedure, adminProcedure, volunteerProcedure } from "../trpc";
import { SITE_URL } from "@/utils/constants";
import NodeGeocoder from "node-geocoder";
//import Airtable from "airtable";

export interface OrganizationSchema {
  Tags?: string[];
  URL?: string;
  Category?: string;
  "Programs Available"?: string[];
  Expertise: string;
  Name: string;
  "Administer of"?: string[];
  "Program Names"?: string[];
  id: string;
  Contacts?: string[];
  Notes?: string;
  Phone?: string;
  Email?: string;
  "Affiliated Organizations"?: string[];
}

export interface ProgramSchema {
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
  programs?: string[];
  Funding: string;
  "File Names"?: string[];
  id: string;
  "Communities Served"?: string[];
  "Exclusive to Communities Served"?: boolean;
  Notes?: string;
  "Income Restrictions Details"?: string;
}
const orgInput = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  website: z.string().optional(),
  helpfulToCommunities: z.array(z.string()).optional(),
  exclusiveToCommunities: z.array(z.string()).optional(),
  address: z.string().optional(),
  apt: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

const communityUpdate = z.object({
  id: z.string(),
  name: z.string(),
});

const orgUpdateInput = z.object({
  id: z.string(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  category: z.string().nullish(),
  email: z.string().email().nullish(),
  phone: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  website: z.string().nullish(),
  helpfulToCommunities: z.array(communityUpdate).nullish(),
  exclusiveToCommunities: z.array(communityUpdate).nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zip: z.string().nullish(),
  adminVerified: z.boolean().optional(),
});

// regex to replace all punctuation with a space

const createOrgId = (name: string) => {
  return name
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s/g, "-")
    .toLowerCase();
};

export const organizationRouter = router({
  create: volunteerProcedure.input(orgInput).mutation(async ({ input, ctx }) => {
    const options = {
      provider: "openstreetmap",
    } as const;

    let geocoded;

    if (input.address) {
      const geocoder = NodeGeocoder(options);

      const res = await geocoder.geocode(
        `${input.address || ""}, ${input.city || ""}, ${input.state || ""}, ${
          input.zip || ""
        }`
      );

      geocoded = res[0];
    }

    try {
      const newOrg = await ctx.prisma.organization.create({
        data: {
          id: createOrgId(input.name),
          name: input.name,
          description: input.description,
          email: input.email || undefined,
          phone: input.phone,
          website: input.website,
          tags: {
            connectOrCreate: input.tags
              ? input.tags.map((tag) => ({
                  where: { tag },
                  create: {
                    tag,
                    name: tag,
                  },
                }))
              : [],
          },

          helpfulToCommunities: input.helpfulToCommunities
            ? {
                connectOrCreate: input.helpfulToCommunities.map(
                  (community) => ({
                    where: { name: community },
                    create: {
                      name: community,
                    },
                  })
                ),
              }
            : undefined,

          exclusiveToCommunities: input.exclusiveToCommunities
            ? {
                connectOrCreate: input.exclusiveToCommunities.map(
                  (community) => ({
                    where: { name: community },
                    create: {
                      name: community,
                    },
                  })
                ),
              }
            : undefined,

          locations: input.address
            ? {
                create: {
                  address: input.address,
                  apt: input.apt,
                  city: input.city,
                  state: input.state,
                  zip: input.zip,
                  latitude: geocoded && geocoded.latitude,
                  longitude: geocoded && geocoded.longitude,
                },
              }
            : undefined,

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

      await fetch(SITE_URL + "/api/revalidate?path=/api/org");
      await fetch(SITE_URL + "/api/revalidate?path=/organizations");

      return newOrg;
    } catch (err) {
      console.log(err);
    }
  }),

  update: volunteerProcedure
    .input(orgUpdateInput)
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedOrg = await ctx.prisma.organization.update({
          where: {
            id: input.id,
          },
          include: {
            exclusiveToCommunities: true,
            helpfulToCommunities: true,
            tags: true,
            programs: {
              select: {
                id: true,
              },
            },
          },
          data: {
            name: input.name || undefined,
            description: input.description || undefined,
            email: input.email,
            phone: input.phone,
            website: input.website,
            adminVerified: input.adminVerified,
            tags: {
              connectOrCreate: input.tags
                ? input.tags.map((tag) => ({
                    where: { tag },
                    create: {
                      tag,
                      name: tag
                    },
                  }))
                : [],
            },

            categoryMeta: {
              connectOrCreate: input.category
                ? {
                    where: { category: input.category },
                    create: {
                      category: input.category,
                    },
                  }
                : undefined,
            },
          },
        });

        await ctx.prisma.organization.update({
          where: {
            id: input.id,
          },
          data: {
            exclusiveToCommunities: {
              disconnect: updatedOrg.exclusiveToCommunities.filter(
                (community) => {
                  if (!input.exclusiveToCommunities) return true;
                  return !input.exclusiveToCommunities.find(
                    (community2) => community2.id === community.id
                  );
                }
              ),
              connectOrCreate: input.exclusiveToCommunities
                ? input.exclusiveToCommunities.map((community) => ({
                    where: { name: community.name },
                    create: {
                      name: community.name,
                    },
                  }))
                : undefined,
            },
          },
        });

        await ctx.prisma.organization.update({
          where: {
            id: input.id,
          },
          data: {
            helpfulToCommunities: {
              disconnect: updatedOrg.helpfulToCommunities.filter(
                (community) => {
                  if (!input.helpfulToCommunities) return true;
                  return !input.helpfulToCommunities.find(
                    (community2) => community2.id === community.id
                  );
                }
              ),
              connectOrCreate: input.helpfulToCommunities
                ? input.helpfulToCommunities.map((community) => ({
                    where: { name: community.name },
                    create: {
                      name: community.name,
                    },
                  }))
                : undefined,
            },
          },
        });

        await ctx.prisma.organization.update({
          where: {
            id: input.id,
          },
          data: {
            tags: {
              disconnect: updatedOrg.tags.filter((tag) => {
                if (!input.tags) return true;
                return !input.tags.find((tag2) => tag2 === tag.tag);
              }),
          }
          }
        })

        return updatedOrg;
      } catch (err) {
        console.log(err);
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.organization.findMany({
      include: {
        tags: true,
      },
    });
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
            programs: true,
            tags: true,
            categoryMeta: true,
            helpfulToCommunities: true,
            exclusiveToCommunities: true,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }),

  disconnectTag: volunteerProcedure
    .input(z.object({ orgId: z.string(), tag: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.organization.update({
          where: {
            id: input.orgId,
          },
          data: {
            tags: {
              disconnect: {
                tag: input.tag,
              },
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    }),

  updateLocation: volunteerProcedure
    .input(
      z.object({
        name: z.string().optional(),
        locationid: z.string(),
        address: z.string(),
        apt: z.string().optional(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
        lat: z.number().optional(),
        lng: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let { lat, lng } = input;

      if (!lat || !lng) {
        const options = {
          provider: "openstreetmap",
        } as const;

        const geocoder = NodeGeocoder(options);

        const res = await geocoder.geocode(
          `${input.address}, ${input.city}, ${input.state}, ${input.zip}`
        );

        lat = res[0]?.latitude;
        lng = res[0]?.longitude;
      }
      try {
        return await ctx.prisma.location.update({
          where: {
            id: input.locationid,
          },
          data: {
            name: input.name,
            address: input.address,
            apt: input.apt,
            city: input.city,
            state: input.state,
            zip: input.zip,
            latitude: lat,
            longitude: lng,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }),

    createLocation: volunteerProcedure
    .input(
      z.object({
        orgId: z.string(),
        name: z.string().optional(),
        address: z.string(),
        apt: z.string().optional(),
        city: z.string(),
        state: z.string(),
        zip: z.string(),
      })
    ).mutation(async ({ input, ctx }) => {

      const options = {
        provider: "openstreetmap",
      } as const;

      const geocoder = NodeGeocoder(options);

      const res = await geocoder.geocode(
        `${input.address}, ${input.city}, ${input.state}, ${input.zip}`
      );

      const lat = res[0]?.latitude;
      const lng = res[0]?.longitude;

      try {
        return await ctx.prisma.location.create({
          data: {
            name: input.name,
            address: input.address,
            apt: input.apt,
            city: input.city,
            state: input.state,
            zip: input.zip,
            latitude: lat,
            longitude: lng,

            org: {
              connect: {
                id: input.orgId
              }
            }
          }
        })
      } catch (err) {
        console.log(err)
      }
    }),

    updateAdminVerified: volunteerProcedure
    .input(
      z.object({
        orgId: z.string(),
        adminVerified: z.boolean()
      })
    ).mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.organization.update({
          where: {
            id: input.orgId
          },
          data: {
            adminVerified: input.adminVerified
          }
        })
      } catch (err) {
        console.log(err)
      }
    }),

    delete: adminProcedure
    .input(
      z.object({
        orgId: z.string(),
        confirmString: z.string().includes("confirm")
      })
    ).mutation(async ({ input, ctx }) => {
      if(input.confirmString !=="confirm") throw new Error("Please confirm that you want to delete this organization")
      try {
        return await ctx.prisma.organization.delete({
          where: {
            id: input.orgId
          }
        })
      } catch (err) {
        console.log(err)
      }
    }),

    updateTags: volunteerProcedure
    .input(
      z.object({
        orgId: z.string(), 
        addedTags: z.array(z.string()),
        removedTags: z.array(z.string())
      })
    ).mutation(async ({ input, ctx }) => { 
        return await ctx.prisma.organization.update({
          where: {
            id: input.orgId
          },
          data: {
            tags: {
              connectOrCreate: input.addedTags.map((tag) => ({
                where: { tag },
                create: {
                  tag,
                  name: tag
                }
              })),
              disconnect: input.removedTags.map((tag) => ({
                tag
              }))
            }
          }
        }) 
    })

});

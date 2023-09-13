import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import type { Prisma, PrismaClient } from "@prisma/client";

async function createFavoriteList(
  userId: string,
  prisma: PrismaClient<Prisma.PrismaClientOptions>
) {
  try {
    const newList = await prisma.favoritesList.create({
      data: {
        adminId: userId,
      },
    });

    const newListId = newList.id;

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currentListId: newListId,
      },
    });

    return newListId;
  } catch (e) {
    console.log(e);
  }
}

export const userRouter = router({
  getFavoriteList: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    let currentListId = ctx.session.user.currentListId;

    // create a new list and assign it to the user if they do not have a favorites list already
    if (!currentListId)
      currentListId = await createFavoriteList(userId, ctx.prisma);

    if (!currentListId) throw new Error("Could not create favorites list");

    const favoriteList = await ctx.prisma.favoritesList.findUnique({
      where: {
        id: currentListId,
      },
      select: {
        name: true,
        id: true,
        resources: {
          select: {
            id: true,
          },
        },
        organizations: {
          select: {
            id: true,
          },
        },
      },
    });

    const resourceArray = favoriteList?.resources.map((x) => x.id);
    const orgArray = favoriteList?.organizations.map((x) => x.id);

    return {
      ...favoriteList,
      resources: resourceArray || [],
      organizations: orgArray || [],
    };
  }),
  toggleFavoriteResource: protectedProcedure
    .input(z.object({ resourceId: z.string(), newState: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      let userList = ctx.session.user.currentListId;

      if (!userList)
        userList = await createFavoriteList(ctx.session.user.id, ctx.prisma);

      if (!userList) throw new Error("Could not create favorites list");

      try {
        await ctx.prisma.favoritesList.update({
          where: {
            id: userList,
          },
          data: {
            resources: {
              [input.newState ? "connect" : "disconnect"]: {
                id: input.resourceId,
              },
            },
          },
        });
        return input.newState;
      } catch (err) {
        console.log(err);
        return !input.newState;
      }
    }),

  toggleFavoriteOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string(), newState: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      let userList = ctx.session.user.currentListId;

      if (!userList)
        userList = await createFavoriteList(ctx.session.user.id, ctx.prisma);

      if (!userList) throw new Error("Could not create favorites list");

      try {
        await ctx.prisma.favoritesList.update({
          where: {
            id: userList,
          },
          data: {
            organizations: {
              [input.newState ? "connect" : "disconnect"]: {
                id: input.organizationId,
              },
            },
          },
        });
        return input.newState;
      } catch (err) {
        console.log(err);
        return !input.newState;
      }
    }),
});

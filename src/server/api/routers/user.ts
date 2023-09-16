import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import type { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

async function createFavoriteList(
  userId: string,
  prisma: PrismaClient<Prisma.PrismaClientOptions>,
  name?: string
) {
  try {
    const newList = await prisma.favoritesList.create({
      data: {
        adminId: userId,
        name: name || "Favorites",
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
  getCurrentFavoritesList: protectedProcedure.query(async ({ ctx }) => {
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
        programs: {
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

    const programArray = favoriteList?.programs.map((x) => x.id);
    const orgArray = favoriteList?.organizations.map((x) => x.id);

    return {
      ...favoriteList,
      programs: programArray || [],
      organizations: orgArray || [],
    };
  }),
  toggleFavoriteProgram: protectedProcedure
    .input(z.object({ programId: z.string(), newState: z.boolean() }))
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
            programs: {
              [input.newState ? "connect" : "disconnect"]: {
                id: input.programId,
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

  getFavoriteOrganizations: publicProcedure
    .input(z.object({ listId: z.number().nullable() }))
    .query(async ({ ctx, input }) => {
      if (!input.listId) return null;

      const list = await ctx.prisma.favoritesList.findUnique({
        where: {
          id: input.listId,
        },
        select: {
          name: true,
          id: true,
          organizations: {
            include: {
              tags: true,
            },
          },
        },
      });

      return list;
    }),

  userOwnsFavoritesList: protectedProcedure
    .input(z.object({ listId: z.number().nullable() }))
    .query(async ({ ctx, input }) => {
      if (!input.listId) return false;
      const userId = ctx.session.user.id;

      const list = await ctx.prisma.favoritesList.findUnique({
        where: {
          id: input.listId,
        },
        select: {
          adminId: true,
        },
      });

      return list?.adminId === userId;
    }),

  updateFavoritesListInfo: protectedProcedure
    .input(z.object({ listId: z.number(), name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const list = await ctx.prisma.favoritesList.findUnique({
        where: {
          id: input.listId,
        },
        select: {
          adminId: true,
        },
      });

      if (list?.adminId !== userId) return list;

      const newList = await ctx.prisma.favoritesList.update({
        where: {
          id: input.listId,
        },
        data: {
          name: input.name,
        },
      });

      return newList;
    }),

  createFavoriteList: protectedProcedure
    .input(z.object({ name: z.string().optional() }).optional())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const newList = await createFavoriteList(
        userId,
        ctx.prisma,
        input?.name || "" + " (Copy)"
      );

      return newList;
    }),

  getOwnFavoritesLists: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const lists = await ctx.prisma.favoritesList.findMany({
      where: {
        adminId: userId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    ctx.session.user.currentListId;

    return lists.map((x) => ({
      ...x,
      current: x.id === ctx.session.user.currentListId,
    }));
  }),

  setCurrentFavoritesList: protectedProcedure
    .input(z.object({ listId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const list = await ctx.prisma.favoritesList.findUnique({
        where: {
          id: input.listId,
        },
        select: {
          adminId: true,
          id: true,
          organizations: {
            select: {
              id: true,
            },
          },
        },
      });

      if (list?.adminId !== userId) return false;

      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          currentListId: input.listId,
        },
      });

      return list;
    }),

  copyFavoritesList: protectedProcedure
    .input(z.object({ listId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const list = await ctx.prisma.favoritesList.findUnique({
        where: {
          id: input.listId,
        },
        select: {
          name: true,
          organizations: {
            select: {
              id: true,
            },
          },
          programs: {
            select: {
              id: true,
            },
          },
        },
      });

      const newList = await ctx.prisma.favoritesList.create({
        data: {
          adminId: userId,
          name: list?.name || "Favorites " + " (Copy)",
          organizations: {
            connect: list?.organizations.map((x) => ({ id: x.id })),
          },
          programs: {
            connect: list?.programs.map((x) => ({ id: x.id })),
          },
        },
      });

      return newList;
    }),

  deleteFavoritesList: protectedProcedure
    .input(z.object({ listId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const list = await ctx.prisma.favoritesList.findUnique({
        where: {
          id: input.listId,
        },
        select: {
          adminId: true,
        },
      });

      if (list?.adminId !== userId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this list",
        });

      await ctx.prisma.favoritesList.delete({
        where: {
          id: input.listId,
        },
      });

      // get most recent favorites list
      const recentlyCreatedListArr = await ctx.prisma.favoritesList.findMany({
        where: {
          adminId: userId,
        },
        select: {
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });

      if (ctx.session.user.currentListId !== input.listId)
        return { success: true, listId: input.listId };

      let recentlyCreatedListId = recentlyCreatedListArr[0]?.id;

      if (!recentlyCreatedListId)
        recentlyCreatedListId = await createFavoriteList(userId, ctx.prisma);

      if (!recentlyCreatedListId)
        throw new Error("Could not create favorites list");

      if (ctx.session.user.currentListId === input.listId)
        await ctx.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            currentListId: recentlyCreatedListId,
          },
        });

      return {
        success: true,
        listId: input.listId,
        currentListId: recentlyCreatedListId,
      };
    }),
});

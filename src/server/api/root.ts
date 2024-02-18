import { router, publicProcedure, superAdminProcedure, volunteerProcedure, adminProcedure } from "./trpc";
import { organizationRouter } from "./routers/organization";
import { programRouter } from "./routers/programs";
import { tagRouter } from "./routers/tag";
import { communityRouter } from "./routers/community";
import { userRouter } from "./routers/user";
import { env } from "@/env.mjs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = router({
  organization: organizationRouter,
  program: programRouter,
  tag: tagRouter,
  community: communityRouter,
  user: userRouter,

  getCategoryList: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany();
    return categories;
  }),

  rebuildApp: adminProcedure.mutation(async () => {
    const res = await fetch(
      env.VERCEL_DEPLOY_HOOK, {
      method: 'POST',
      }
    );
    return res;
  }
  )

});

// export type definition of API
export type AppRouter = typeof appRouter;

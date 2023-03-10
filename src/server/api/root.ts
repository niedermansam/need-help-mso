import { createTRPCRouter } from "./trpc";
import { organizationRouter } from "./routers/organization";
import { resourceRouter } from "./routers/resources";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  resource: resourceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

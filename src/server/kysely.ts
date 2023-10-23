import type { DB } from "./kysely/types"; // this is the Database interface we defined earlier
import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import { env } from "@/env.mjs";

const dialect = new PlanetScaleDialect({
  url: env.DATABASE_URL,
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const kysely = new Kysely<DB>({
  dialect,
});

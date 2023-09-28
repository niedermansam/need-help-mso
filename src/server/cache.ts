import { env } from "@/env.mjs";
import { createClient } from "redis";

const cache = createClient({
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
  },
});

export default cache;

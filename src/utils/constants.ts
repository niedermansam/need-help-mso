import { env } from "@/env.mjs";

export const SITE_URL = env.NODE_ENV === 'development' ? "http://localhost:3000" : "https://www.needhelpmissoula.org";
// export const SITE_URL = "https://www.needhelpmissoula.org";
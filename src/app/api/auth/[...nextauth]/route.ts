import NextAuth from "next-auth";
import { authOptions } from "../../../../server/auth";

export const runtime = "edge";

const handler = NextAuth(authOptions) as undefined;

export { handler as GET, handler as POST };

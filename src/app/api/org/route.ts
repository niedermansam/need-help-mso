import { prisma } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // const cat = request.nextUrl.searchParams.get('cat')

  console.log(req.body)

  const orgs = await prisma.organization.findMany({
    include: {
      tags: {
        select: {
          tag: true,
        },
      },
    },
  });

  return NextResponse.json(orgs);
}

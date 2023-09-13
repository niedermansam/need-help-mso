import { prisma } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  // const cat = request.nextUrl.searchParams.get('cat')

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

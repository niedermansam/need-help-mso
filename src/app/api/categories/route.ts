import { prisma } from "@/server/prisma";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(req: Request) {
  // const cat = request.nextUrl.searchParams.get('cat')

  console.log(req.body);

  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  });

  return NextResponse.json(categories.map((c) => c.slug));
}

import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }

  return NextResponse.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  });
}

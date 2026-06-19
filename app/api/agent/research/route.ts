import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { runResearch } from "@/lib/contentAgent";

export const maxDuration = 300;

export async function POST(request: Request) {
  // Verify admin token (same check as middleware but belt-and-suspenders for API)
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runResearch();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

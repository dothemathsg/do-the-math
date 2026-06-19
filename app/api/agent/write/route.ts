import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeArticle } from "@/lib/contentAgent";

export const maxDuration = 300;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let planId: string;
  try {
    const body = await request.json();
    planId = body.planId;
    if (!planId) throw new Error("planId is required");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const result = await writeArticle(planId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const secret = (formData.get("secret") as string) ?? "";
  const expected = process.env.ADMIN_SECRET;

  if (!expected) return { error: "ADMIN_SECRET is not configured on the server." };
  if (secret !== expected) return { error: "Incorrect password." };

  const cookieStore = await cookies();
  cookieStore.set("admin_token", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect("/admin");
}

"use server";

import { createClient } from "@supabase/supabase-js";
import { sendNotification } from "@/lib/mailer";

type State = { success: true } | { error: string } | null;

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function submitPartnership(_prev: State, formData: FormData): Promise<State> {
  const name         = (formData.get("name") as string | null)?.trim() ?? "";
  const title        = (formData.get("title") as string | null)?.trim() ?? "";
  const email        = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const organisation = (formData.get("organisation") as string | null)?.trim() ?? "";
  const message      = (formData.get("message") as string | null)?.trim() ?? "";
  const consent      = formData.get("consent") === "on";

  if (!name)         return { error: "Please enter your name." };
  if (!title)        return { error: "Please enter your title." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                     return { error: "Please enter a valid email address." };
  if (!organisation) return { error: "Please enter your organisation." };
  if (!message)      return { error: "Please enter a message." };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("partnership_submissions")
    .insert({ name, title, email, organisation, message, consent });

  if (error) return { error: "Something went wrong. Please try again." };

  try {
    await sendNotification(
      "New partnership enquiry — Do The Math",
      `<h2>New partnership enquiry</h2>
      <table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
        <tr><td><strong>Name</strong></td><td>${name}</td></tr>
        <tr><td><strong>Title</strong></td><td>${title}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Organisation</strong></td><td>${organisation}</td></tr>
        <tr><td><strong>Consent to contact</strong></td><td>${consent ? "Yes" : "No"}</td></tr>
      </table>
      <h3 style="margin-top:16px;">Message</h3>
      <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;">${message}</p>`
    );
  } catch (e) {
    console.error("Partnership notification failed:", e);
  }

  return { success: true };
}

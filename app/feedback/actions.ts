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

export async function submitFeedback(_prev: State, formData: FormData): Promise<State> {
  const name           = (formData.get("name") as string | null)?.trim() ?? "";
  const email          = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const message        = (formData.get("message") as string | null)?.trim() ?? "";
  const allow_followup = formData.get("allow_followup") === "on";

  if (!name)    return { error: "Please enter your name." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                return { error: "Please enter a valid email address." };
  if (!message) return { error: "Please share your feedback." };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("feedback_submissions")
    .insert({ name, email, message, allow_followup });

  if (error) return { error: "Something went wrong. Please try again." };

  try {
    await sendNotification(
      "New feedback — Do The Math",
      `<h2>New feedback submission</h2>
      <table cellpadding="6" style="font-family:sans-serif;font-size:14px;">
        <tr><td><strong>Name</strong></td><td>${name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Allow follow-up</strong></td><td>${allow_followup ? "Yes" : "No"}</td></tr>
      </table>
      <h3 style="margin-top:16px;">Message</h3>
      <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;">${message}</p>`
    );
  } catch (e) {
    console.error("Feedback notification failed:", e);
  }

  return { success: true };
}

"use client";

import { useActionState } from "react";
import { submitFeedback } from "./actions";

export default function FeedbackForm() {
  const [state, action, isPending] = useActionState(submitFeedback, null);

  if (state && "success" in state) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-10 text-center">
        <p className="text-lg font-semibold text-neutral-900">Thanks for your feedback.</p>
        <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
          It means a lot and helps us build a better product for Singaporeans.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name" name="name" placeholder="Alex Lim" required />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="alex@example.com"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-neutral-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Share your thoughts, suggestions, or anything on your mind…"
          className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors resize-none"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="allow_followup"
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
        />
        <span className="text-sm text-neutral-600 leading-relaxed">
          I'm happy for Do The Math to contact me to learn more about my experience.
        </span>
      </label>

      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto rounded-lg bg-neutral-900 px-8 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors"
      />
    </div>
  );
}

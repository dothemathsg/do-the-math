"use client";

import { useActionState } from "react";
import { subscribe } from "./actions";

export default function SubscribeForm() {
  const [state, action, isPending] = useActionState(subscribe, null);

  if (state && "success" in state) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-8 text-center">
        <p className="text-lg font-semibold text-neutral-900">You're in.</p>
        <p className="mt-1 text-sm text-neutral-500">
          Thanks for subscribing — expect your first update soon.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {isPending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <p className="text-xs text-neutral-400">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}

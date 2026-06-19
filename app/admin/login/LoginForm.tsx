"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Admin password
        </label>
        <input
          type="password"
          name="secret"
          required
          autoFocus
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          placeholder="Enter ADMIN_SECRET"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-neutral-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-neutral-700 disabled:opacity-50 transition-colors"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

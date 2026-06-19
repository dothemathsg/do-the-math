"use client";

import { useState } from "react";

export default function ResearchButton() {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function run() {
    setState("running");
    setMessage("");
    try {
      const res = await fetch("/api/agent/research", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setState("done");
      setMessage(`${data.count} content plans created.`);
      // refresh the page to show new plans
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Research failed");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={run}
        disabled={state === "running"}
        className="bg-neutral-900 text-white text-sm rounded-lg px-4 py-2 font-medium hover:bg-neutral-700 disabled:opacity-50 transition-colors"
      >
        {state === "running" ? "Researching…" : "Run Research"}
      </button>
      {message && (
        <span className={`text-sm ${state === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </span>
      )}
    </div>
  );
}

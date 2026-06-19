"use client";

import { useState } from "react";

export default function WriteButton({ planId }: { planId: string }) {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function write() {
    setState("running");
    setMessage("");
    try {
      const res = await fetch("/api/agent/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      setState("done");
      setMessage(`Draft saved: /articles/${data.slug}`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Write failed");
    }
  }

  return (
    <div>
      <button
        onClick={write}
        disabled={state === "running"}
        className="text-xs bg-blue-600 text-white rounded px-3 py-1.5 hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {state === "running" ? "Writing…" : "Write Article"}
      </button>
      {message && (
        <p className={`text-xs mt-1 ${state === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </p>
      )}
    </div>
  );
}

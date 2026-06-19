"use client";

import { useState } from "react";
import { scheduleArticle, publishNow } from "./actions";

export default function ScheduleForm({ articleId }: { articleId: string }) {
  const [open, setOpen] = useState(false);
  const [dt, setDt] = useState("");

  if (!open) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => setOpen(true)}
          className="text-xs border border-neutral-300 rounded px-3 py-1.5 hover:border-neutral-600 transition-colors"
        >
          Schedule
        </button>
        <form action={publishNow.bind(null, articleId)}>
          <button
            type="submit"
            className="text-xs bg-green-600 text-white rounded px-3 py-1.5 hover:bg-green-700 transition-colors"
          >
            Publish now
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={scheduleArticle.bind(null, articleId, dt)}
      className="flex items-center gap-2"
    >
      <input
        type="datetime-local"
        value={dt}
        onChange={(e) => setDt(e.target.value)}
        required
        className="text-xs border border-neutral-300 rounded px-2 py-1.5"
      />
      <button
        type="submit"
        className="text-xs bg-neutral-900 text-white rounded px-3 py-1.5"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-neutral-500"
      >
        Cancel
      </button>
    </form>
  );
}

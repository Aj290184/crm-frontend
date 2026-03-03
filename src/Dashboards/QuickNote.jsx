import React from "react";

export default function QuickNote() {
  return (
    <div className="rounded-2xl bg-white/85 border shadow-md p-4">
      <h3 className="text-sm font-semibold mb-2">Quick Note</h3>
      <textarea
        rows={3}
        placeholder="Write a note..."
        className="w-full p-2 rounded-xl border bg-white focus:outline-none"
      />
      <button className="mt-2 px-3 py-1.5 rounded-full bg-cyan-600 text-white text-xs">
        Save Note
      </button>
    </div>
  );
}

import React from "react";

export default function Stats({ stats = [] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((item, idx) => (
        <div key={idx} className="rounded-2xl border bg-white/80 shadow p-4">
          <p className="text-xs text-gray-500 uppercase">{item.label || "Stat"}</p>
          <p className="text-2xl font-bold">{item.value || 0}</p>
          <p className="text-xs text-gray-600">{item.sub || ""}</p>
        </div>
      ))}
    </section>
  );
}

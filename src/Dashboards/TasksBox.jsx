import React from "react";

export default function TasksBox({ tasks = [] }) {
  return (
    <div className="rounded-2xl bg-white/85 border shadow-md p-4">
      <div className="flex justify-between mb-3">
        <h3 className="text-lg font-semibold">Today's Tasks</h3>
        <button className="text-sm text-cyan-700 underline">View all</button>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div key={idx} className="rounded-xl border bg-white p-2">
            <p className="font-medium">{task.title || "Untitled Task"}</p>
            <p className="text-xs text-gray-600">{task.time || "-"}</p>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2 border rounded-full">+ Add Task</button>
    </div>
  );
}

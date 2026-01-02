import React from "react";

export default function LeadsTable({ recentLeads = [] }) {
  return (
    <div className="rounded-2xl bg-white/85 border shadow-md p-5">
      <div className="flex justify-between mb-3">
        <h3 className="text-lg font-semibold">Recent Leads</h3>
        <button className="text-sm text-cyan-700 underline">View all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Company</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Last Activity</th>
            </tr>
          </thead>

          <tbody>
            {recentLeads.map((lead, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{lead.name || "N/A"}</td>
                <td>{lead.company || "Unknown"}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] ${
                      lead.status === "Won"
                        ? "bg-green-100 text-green-700"
                        : lead.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : lead.status === "Follow Up"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {lead.status || "N/A"}
                  </span>
                </td>
                <td>{lead.date || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

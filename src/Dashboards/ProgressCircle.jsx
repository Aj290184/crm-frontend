import React from "react";

export default function ProgressCircle({ value = 0, label = "No Label" }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  const safeValue = Number(value) || 0;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="w-16 h-16">
        <circle cx="20" cy="20" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="transparent"
          stroke="#06b6d4"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 20 20)"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-gray-900 text-[10px] font-semibold"
        >
          {safeValue}%
        </text>
      </svg>

      <div>
        <span className="text-xs text-gray-500 uppercase">{label}</span>
        <p className="text-sm font-semibold">Progress</p>
      </div>
    </div>
  );
}

import React from "react";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  const name = user?.name || "User";
  const profileImage = user?.profileImage;

  return (
    <header className="w-full px-6 py-3 flex items-center justify-between border-b border-white/40 bg-gray-50 backdrop-blur-xl">
      
      {/* LEFT */}
      <div className="flex items-center gap-2 select-none">
        <svg
          className="h-10 w-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#procodeGradient)"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient
              id="procodeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00d0ff" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
          </defs>
          <path d="M3 17l6-6 4 4 8-8" />
        </svg>

        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-cyan-600">
            PROCODE CRM
          </span>
          <span className="text-[11px] text-cyan-600 tracking-widest">
            CODING THE FUTURE
          </span>
        </div>
      </div>

      {/* RIGHT (Only User info) */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block leading-tight">
          <p className="text-xs text-gray-500">Logged in as</p>
          <p className="text-sm font-semibold">{name}</p>
        </div>

        <div className="h-9 w-9 rounded-full overflow-hidden border bg-cyan-50 flex items-center justify-center">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-cyan-700 text-sm font-bold">
              {name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

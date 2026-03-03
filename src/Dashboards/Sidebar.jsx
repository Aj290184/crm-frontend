import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

// Icons
import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiUserPlus,
  FiUserCheck,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiUser,
  FiGrid,
} from "react-icons/fi";

import { CgProfile } from "react-icons/cg";

export default function Sidebar() {
  const { role, allowedTabs } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "User";

  //icon mapping
  const iconMap = {
    dashboard: <FiHome size={16} />,
    students: <FiUsers size={16} />,
    courses: <FiBookOpen size={16} />,
    placements: <FiBriefcase size={16} />,
    resumes: <FiFileText size={16} />,
    "add-student": <FiUserPlus size={16} />,
    signup: <FiUserCheck size={16} />,
    alumni: <FiUser size={16} />,
    profile: <CgProfile size={17} />,
    "edit-profile": <FiSettings size={16} />,
  };

  const getIcon = (tab) => {
    const path = tab.path?.toLowerCase() || "";

    const matchedKey = Object.keys(iconMap).find((key) =>
      path.includes(key)
    );

    return iconMap[matchedKey] || <FiGrid size={16} />;
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 px-3 py-2 rounded-lg bg-white border text-gray-700">
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40
          min-h-screen w-60 md:w-64
          bg-gray-50 px-4 pb-4
          pt-16 md:pt-4
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          border-r border-gray-200`}>

        {/* Header */}
        <div className="px-1 pt-2 pb-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-semibold">
            PC
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-xs text-gray-500 font-medium">
              PROCODE CRM
            </span>
            <span className="text-sm font-semibold text-gray-900 capitalize">
              {displayRole}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 space-y-1">
          {allowedTabs?.length > 0 ? (
            allowedTabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-100 text-cyan-700"
                      : "text-gray-800 hover:bg-gray-100"
                  }`
                }
              >
                <span>{getIcon(tab)}</span>
                <span>{tab.label}</span>
              </NavLink>
            ))
          ) : (
            <p className="text-xs text-gray-500 mt-4 px-1">
              No menu available for this role.
            </p>
          )}
        </nav>
      </aside>
    </>
  );
}
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { AuthContext } from "../Context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, role, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header userName="Profile" />

          <main className="flex-1 p-6 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white rounded-3xl p-8
                shadow-sm hover:shadow-xl
                transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div
                  className="h-32 w-32 rounded-2xl overflow-hidden
                    flex items-center justify-center
                    text-white text-4xl font-bold">
                  {user?.profileImage ? (
                    <img src={user.profileImage}
                      alt="profile"
                      className="h-full w-full object-cover overflow-hidden rounded-full border border-cyan-500"/>
                  ) : (
                    initials
                  )}
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                  <span className="inline-block mt-2 px-4 py-1 rounded-full
                      text-xs bg-cyan-100 text-cyan-700 capitalize">
                    {role}
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><span className="text-gray-500">Phone :</span> {user?.phone}</p>
                <p><span className="text-gray-500">Experience :</span> {user?.experience} years</p>
                <p><span className="text-gray-500">Status :</span> {user?.status}</p>
                <p>
                  <span className="text-gray-500">Joined :</span>{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => navigate("/profile/edit")}
                className="flex-1 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-300 
                 text-white text-sm font-semibold
                 shadow-md hover:shadow-lg 
                 hover:scale-[1.02] 
                 transition-all duration-300">
                 Edit Profile
                </button>

                <button onClick={handleLogout}
                  className="flex-1 py-2 rounded-full
                  border border-red-300 text-red-600
                  text-sm hover:bg-red-50">
                  Logout
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
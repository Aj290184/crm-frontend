import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";
import { AuthContext } from "../Context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { role, logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await callApi("/profile", "GET");
        setUser(res?.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await callApi("/logout", "POST");
    logout();
    navigate("/", { replace: true });
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  const initials = user.name
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
            {/* SINGLE PROFILE CARD */}
            <div
              className="w-full max-w-3xl bg-white rounded-3xl p-8
                shadow-sm hover:shadow-xl
                transition-all duration-300">
              {/* TOP SECTION */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div
                  className="h-32 w-32 rounded-2xl overflow-hidden
                     from-cyan-400 to-blue-500
                    flex items-center justify-center
                    text-white text-4xl font-bold">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="profile"
                      className="h-full w-full object-cover"/>
                  ) : (
                    initials
                  )}
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>

                  <span
                    className="inline-block mt-2 px-4 py-1 rounded-full
                      text-xs bg-cyan-100 text-cyan-700 capitalize">
                    {role}
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><span className="text-gray-500">Phone :</span> {user.phone}</p>
                <p><span className="text-gray-500">Designation :</span> {user.designation}</p>
                <p><span className="text-gray-500">Department :</span> {user.department}</p>
                <p><span className="text-gray-500">Experience :</span> {user.experience} years</p>
                <p><span className="text-gray-500">Status :</span> {user.status}</p>
                <p>
                  <span className="text-gray-500">Joined :</span>{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="flex-1 py-2 rounded-full
                    input from-cyan-500 to-blue-500
                    text-cyan-500 text-sm font-medium
                    hover:opacity-90">
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
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

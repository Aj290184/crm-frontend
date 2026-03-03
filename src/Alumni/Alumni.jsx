import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

function Alumni() {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlumni = async () => {
    try {
      const res = await callApi("/alumni", "GET");
      setAlumni(res?.data || []);
    } catch {
      toast.error("Failed to load alumni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this alumni?")) return;

    try {
      await callApi(`/alumni/${id}`, "DELETE");
      toast.success("Alumni deleted");
      setAlumni((prev) => prev.filter((a) => a._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gray-50">
      {/* DASHBOARD BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header userName="Alumni" />

          <main className="flex-1 px-6 py-8">
            <div className="max-w-7xl mx-auto space-y-8">

              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Alumni
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed students & career history
                  </p>
                </div>

                <button
                  onClick={() => navigate("/add-alumni")}
                  className="
                    px-6 py-2 rounded-full
                    bg-cyan-600 text-white text-sm
                    font-medium hover:bg-cyan-700
                    shadow-sm
                  "
                >
                  + Add Alumni
                </button>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="text-center text-gray-500 py-16">
                  Loading alumni...
                </div>
              )}

              {/* PREMIUM ALUMNI CARDS */}
              {!loading && alumni.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alumni.map((a) => (
                    <article
                      key={a._id}
                      className="
                        bg-white rounded-2xl p-5
                        border border-cyan-200
                        shadow-sm hover:shadow-lg
                        transition-all duration-300
                        hover:-translate-y-1
                      "
                    >
                      {/* STUDENT */}
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {a.student?.name || "Student"}
                      </h3>

                      {/* INFO */}
                      <div className="mt-2 text-xs text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Company:</span>{" "}
                          {a.companyName}
                        </p>
                        <p>
                          <span className="font-medium">Role:</span>{" "}
                          {a.jobRole}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {a.location}
                        </p>
                        <p className="text-gray-500">
                          Passing Year: {a.passingYear}
                        </p>
                      </div>

                      {/* ACTION */}
                      <div className="mt-4">
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="
                            w-full rounded-full py-2 text-xs
                            border border-red-300 text-red-600
                            hover:bg-red-50
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* EMPTY */}
              {!loading && alumni.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                  No alumni found
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Alumni;

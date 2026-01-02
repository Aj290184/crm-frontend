import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

function Placement() {
  const navigate = useNavigate();

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await callApi("/placements", "GET");
        setPlacements(res?.data || []);
      } catch (err) {
        console.error("Fetch placements error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

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
          <Header userName="Placements" />

          <main className="flex-1 px-6 py-8">
            <div className="max-w-7xl mx-auto space-y-8">

              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Placements
                  </h2>
                  <p className="text-sm text-gray-500">
                    Student placement records
                  </p>
                </div>

                <button
                  onClick={() => navigate("/add-placement")}
                  className="
                    px-6 py-2 rounded-full
                    bg-cyan-600 text-white text-sm
                    font-medium hover:bg-cyan-700
                    shadow-sm
                  "
                >
                  + Add Placement
                </button>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="text-center text-gray-500 py-16">
                  Loading placements...
                </div>
              )}

              {/* PREMIUM PLACEMENT CARDS */}
              {!loading && placements.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {placements.map((p) => (
                    <article
                      key={p._id}
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
                        {p.student?.name || "Student"}
                      </h3>

                      {/* INFO */}
                      <div className="mt-2 text-xs text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Company:</span>{" "}
                          {p.companyName}
                        </p>
                        <p>
                          <span className="font-medium">Role:</span>{" "}
                          {p.jobRole}
                        </p>
                        <p className="font-medium text-gray-800">
                          Package: ₹{p.package}
                        </p>
                      </div>

                      {/* STATUS */}
                      <div className="mt-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full
                          text-[11px] font-medium ${
                            p.status === "Placed"
                              ? "bg-green-100 text-green-700"
                              : p.status === "Offered"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {p.status || "Placed"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* EMPTY */}
              {!loading && placements.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                  No placements found
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Placement;

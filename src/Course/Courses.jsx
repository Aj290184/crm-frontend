import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await callApi("/courses", "GET");
        setCourses(res?.data || []);
      } catch (err) {
        console.error("Fetch courses error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filtered = courses.filter((c) =>
    (c.courseName + (c.description || ""))
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const showCourses = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      setDeletingId(id);
      await callApi(`/courses/${id}`, "DELETE");
      toast.success("Course deleted successfully");
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete course"
      );
    } finally {
      setDeletingId(null);
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
          <Header userName="Courses" />

          <main className="flex-1 px-6 py-8">
            <div className="max-w-7xl mx-auto space-y-8">

              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Courses
                  </h2>
                  <p className="text-sm text-gray-500">
                    Manage institute courses
                  </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setVisible(6);
                    }}
                    placeholder="Search courses..."
                    className="
                      px-5 py-2 rounded-full
                      border border-gray-300
                      text-sm w-full md:w-72
                      focus:outline-none focus:ring-2 focus:ring-cyan-300
                    "
                  />

                  <button
                    onClick={() => navigate("/add-course")}
                    className="
                      px-6 py-2 rounded-full
                      bg-cyan-600 text-white text-sm
                      font-medium hover:bg-cyan-700
                      shadow-sm
                    "
                  >
                    + Add Course
                  </button>
                </div>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="text-center text-gray-500 py-16">
                  Loading courses...
                </div>
              )}

              {/* PREMIUM COURSE CARDS */}
              {!loading && showCourses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {showCourses.map((c) => (
                    <article
                      key={c._id}
                      className="
                        bg-white rounded-2xl p-5
                        border border-cyan-200
                        shadow-sm hover:shadow-lg
                        transition-all duration-300
                        hover:-translate-y-1
                        flex gap-4
                      "
                    >
                      {/* IMAGE */}
                      <div className="
                        w-14 h-14 rounded-full
                        overflow-hidden bg-cyan-100
                        shrink-0
                      ">
                        {c.courseImg ? (
                          <img
                            src={c.courseImg}
                            alt={c.courseName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center
                            text-cyan-700 font-semibold text-sm">
                            {c.courseName?.[0]}
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {c.courseName}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {c.description || "No description available"}
                          </p>

                          <div className="mt-2 text-xs text-gray-600 space-y-1">
                            <p>
                              <span className="font-medium">Duration:</span>{" "}
                              {c.duration}
                            </p>
                            <p className="font-medium text-gray-800">
                              Fee: ₹{c.fee}
                            </p>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => navigate(`/courses/${c._id}`)}
                            className="
                              flex-1 rounded-full py-1.5 text-xs
                              border border-cyan-400 text-cyan-700
                              hover:bg-cyan-50
                            "
                          >
                            View
                          </button>

                          <button
                            onClick={() => navigate(`/courses/edit/${c._id}`)}
                            className="
                              flex-1 rounded-full py-1.5 text-xs
                              border border-gray-300 text-gray-700
                              hover:bg-gray-50
                            "
                          >
                            Edit
                          </button>

                          <button
                            disabled={deletingId === c._id}
                            onClick={() => handleDelete(c._id)}
                            className="
                              flex-1 rounded-full py-1.5 text-xs
                              border border-red-300 text-red-600
                              hover:bg-red-50 disabled:opacity-60
                            "
                          >
                            {deletingId === c._id ? "..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* LOAD MORE */}
              {hasMore && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setVisible((v) => v + 3)}
                    className="
                      px-6 py-2 rounded-full
                      border border-cyan-400
                      text-cyan-700 text-sm
                      hover:bg-cyan-50
                    "
                  >
                    Load More
                  </button>
                </div>
              )}

              {/* EMPTY */}
              {!loading && !filtered.length && (
                <div className="text-center text-gray-500 py-16">
                  No courses found
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

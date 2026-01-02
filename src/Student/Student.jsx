import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";
import EditStudent from "./EditStudent";

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await callApi("/students", "GET");
        setStudents(res?.data || []);
      } catch (err) {
        console.error("Fetch students error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) =>
    (s.name + s.email + s.course)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const visibleStudents = filteredStudents.slice(0, visible);

  const handleView = (id) => navigate(`/students/${id}`);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditOpen(true);
  };

  const handleUpdatedStudent = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((s) => (s._id === updatedStudent._id ? updatedStudent : s))
    );
  };

  /* 🗑 DELETE FROM CARD */
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirm) return;

    try {
      setDeletingId(id);
      await callApi(`/students/${id}`, "DELETE");

      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete student error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gray-50">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 px-6 py-8">
            <div className="max-w-7xl mx-auto space-y-8">

              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Students
                  </h2>
                  <p className="text-sm text-gray-500">
                    All enrolled students
                  </p>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setVisible(6);
                    }}
                    placeholder="Search students..."
                    className="px-5 py-2 rounded-full border border-gray-300
                    text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  />

                  <button
                    onClick={() => navigate("/add-student")}
                    className="px-6 py-2 rounded-full bg-cyan-600
                    text-white text-sm font-medium hover:bg-cyan-700 shadow-sm">
                    + Add Student
                  </button>
                </div>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="text-center text-gray-500 py-16">
                  Loading students...
                </div>
              )}

              {/* STUDENT CARDS */}
              {!loading && visibleStudents.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleStudents.map((s) => (
                    <article
                      key={s._id}
                      className="bg-white rounded-2xl p-5 border border-cyan-200
                      shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">

                      {/* TOP */}
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-cyan-100 text-cyan-700
                          flex items-center justify-center font-semibold text-sm">
                          {s.profileImage ? (
                            <img
                              src={s.profileImage}
                              alt={s.name}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            s.name?.split(" ").map(n => n[0]).slice(0,2).join("")
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {s.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {s.email}
                          </p>
                        </div>
                      </div>

                      {/* INFO */}
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <p><span className="font-medium">Course:</span> {s.course}</p>
                        <p><span className="font-medium">Batch:</span> {s.batch}</p>

                        <span
                          className={`w-fit px-3 py-0.5 rounded-full text-[10px] font-medium ${
                            s.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                          {s.status}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleView(s._id)}
                          className="flex-1 rounded-full py-1.5 text-xs
                          border border-cyan-400 text-cyan-700 hover:bg-cyan-50">
                          View
                        </button>

                        <button
                          onClick={() => handleEdit(s)}
                          className="flex-1 rounded-full py-1.5 text-xs
                          border border-gray-300 text-gray-700 hover:bg-gray-50">
                          Edit
                        </button>

                        {/* 🗑 DELETE */}
                        <button
                          onClick={() => handleDelete(s._id)}
                          disabled={deletingId === s._id}
                          className="rounded-full px-3 py-1.5 text-xs
                          border border-red-300 text-red-600 hover:bg-red-50
                          disabled:opacity-60">
                          {deletingId === s._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* LOAD MORE */}
              {!loading && filteredStudents.length > visible && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setVisible((v) => v + 6)}
                    className="px-6 py-2 rounded-full border border-cyan-400
                    text-cyan-700 text-sm hover:bg-cyan-50">
                    Load More
                  </button>
                </div>
              )}

              {/* EMPTY */}
              {!loading && filteredStudents.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                  No students found
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-3xl">
            <EditStudent
              student={selectedStudent}
              onClose={() => setIsEditOpen(false)}
              onUpdated={handleUpdatedStudent}
            />
          </div>
        </div>
      )}
    </div>
  );
}

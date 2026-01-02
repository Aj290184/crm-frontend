import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function AddResume() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    student: "",
    name: "",
    email: "",
    phone: "",
    course: "",
    resumeUrl: "",
    status: "Pending",
  });

//fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await callApi("/students", "GET");
        setStudents(res?.data || []);
      } catch (err) {
        console.error("Fetch students error:", err);
      }
    };

    fetchStudents();
  }, []);

  //hendle select student
  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    const selectedStudent = students.find((s) => s._id === studentId);

    if (!selectedStudent) return;

    setForm((prev) => ({
      ...prev,
      student: selectedStudent._id,
      name: selectedStudent.name || "",
      email: selectedStudent.email || "",
      phone: selectedStudent.phone || "",
      course: selectedStudent.course || "",
    }));
  };

  //handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { student, name, email, phone, course, resumeUrl } = form;

    if (!student || !name || !email || !phone || !course || !resumeUrl) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await callApi("/admin/createResumes", "POST", form);
      toast.success("Resume created successfully");
      navigate("/resumes");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create resume";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header userName="Add Resume" />

          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-3xl mx-auto bg-white border border-cyan-300 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Add Resume
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Select student and upload resume details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* ===== Student Select ===== */}
                <select
                  value={form.student}
                  onChange={handleStudentSelect}
                  className="w-full px-4 py-3 border rounded-full text-sm
                  focus:outline-none focus:ring-1 focus:ring-cyan-300"
                >
                  <option value="">Select Student *</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>

                {/* Name */}
                <input
                  type="text"
                  value={form.name}
                  disabled
                  placeholder="Name"
                  className="w-full px-4 py-3 border rounded-full text-sm bg-gray-100"
                />

                {/* Email */}
                <input
                  type="email"
                  value={form.email}
                  disabled
                  placeholder="Email"
                  className="w-full px-4 py-3 border rounded-full text-sm bg-gray-100"
                />

                {/* Phone */}
                <input
                  type="text"
                  value={form.phone}
                  disabled
                  placeholder="Phone"
                  className="w-full px-4 py-3 border rounded-full text-sm bg-gray-100"
                />

                {/* Course */}
                <input
                  type="text"
                  value={form.course}
                  disabled
                  placeholder="Course"
                  className="w-full px-4 py-3 border rounded-full text-sm bg-gray-100"
                />

                {/* Resume URL */}
                <input
                  type="text"
                  name="resumeUrl"
                  value={form.resumeUrl}
                  onChange={handleChange}
                  placeholder="Resume URL *"
                  className="w-full px-4 py-3 border rounded-full text-sm
                  focus:outline-none focus:ring-1 focus:ring-cyan-300"
                />

                {/* Status */}
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-full text-sm
                  focus:outline-none focus:ring-1 focus:ring-cyan-300"
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-cyan-600 text-white py-3
                    rounded-full font-medium hover:bg-cyan-700
                    disabled:opacity-70"
                  >
                    {loading ? "Saving..." : "Add Resume"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/resumes")}
                    className="px-6 py-3 border rounded-full text-sm"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

import "../Auth/signup.css";

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

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await callApi("/students", "GET");
        setStudents(res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  // Select student
  const handleStudentSelect = (e) => {
    const studentId = e.target.value;
    const selectedStudent = students.find((s) => s._id === studentId);

    if (!selectedStudent) return;

    setForm((prev) => ({
      ...prev,
      student: selectedStudent._id,
      name: selectedStudent.name,
      email: selectedStudent.email,
      phone: selectedStudent.phone,
      course: selectedStudent.course,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { student, resumeUrl } = form;

    if (!student || !resumeUrl) {
      toast.error("Please select student and enter resume URL");
      return;
    }

    try {
      setLoading(true);
      await callApi("/admin/createResumes", "POST", form);
      toast.success("Resume added successfully");
      navigate("/resumes");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add resume"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${bgImage})` }}/>
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 px-10 py-10 flex items-center">

            <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
              <div className="w-full max-w-xl rounded-2xl p-8 z-10">

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add Resume
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Select student and attach resume
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Student Select */}
                  <select value={form.student} onChange={handleStudentSelect}
                  className="w-full px-4 py-3 border border-black-300 
                  rounded-full text-sm bg-white text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition">
                  <option value="">Select Student</option>
                  {students.map((s) => (<option key={s._id} value={s._id}>{s.name} ({s.email})
                  </option>))}</select>

                  {/* Auto Filled Fields */}
                  <ReadOnlyInput value={form.name} placeholder="Name" />
                  <ReadOnlyInput value={form.email} placeholder="Email" />
                  <ReadOnlyInput value={form.phone} placeholder="Phone" />
                  <ReadOnlyInput value={form.course} placeholder="Course" />

                  {/* Resume URL */}
                  <input type="text"
                    name="resumeUrl"
                    value={form.resumeUrl}
                    onChange={handleChange}
                    placeholder="Resume URL *"
                    className="w-1/2 px-4 py-3 border border-black-300 
                  rounded-full text-sm bg-white text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"/>

                  {/* Status */}
                  <select name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-3 border border-black-300 
                    rounded-full text-sm bg-white text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition">
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button type="submit"
                      disabled={loading}
                      className="flex-1 bg-cyan-600 text-white py-3 rounded-full font-medium hover:bg-cyan-700 disabled:opacity-70">
                      {loading ? "Saving..." : "Add Resume"}
                    </button>

                    <button type="button"
                      onClick={() => navigate("/resumes")}
                      className="px-6 py-3 border rounded-full text-sm hover:bg-gray-100">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT 3D SIDE */}
              <div className="hidden lg:flex relative w-1/2 items-center justify-center">

                <div className="floating-ball ball1"></div>
                <div className="floating-ball ball2"></div>
                <div className="floating-ball ball3"></div>
                <div className="floating-ball ball4"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* Reusable */

const ReadOnlyInput = ({ value, placeholder }) => (
  <input
    value={value || ""}
    disabled
    placeholder={placeholder}
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-100"/>
);
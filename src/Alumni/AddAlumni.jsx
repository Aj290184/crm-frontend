import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

import "../Auth/signup.css";

function AddAlumni() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    student: "",
    passingYear: "",
    companyName: "",
    jobRole: "",
    location: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await callApi("/students", "GET");
        setStudents(res?.data || []);
      } catch {
        toast.error("Failed to load students");
      }
    };
    fetchStudents();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.student || !form.passingYear) {
      toast.error("Student and passing year are required");
      return;
    }

    try {
      setLoading(true);
      await callApi("/admin/createAlumni", "POST", form);
      toast.success("Alumni created successfully");
      navigate("/alumni");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create alumni"
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
                    Add Alumni
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Convert student to alumni
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Student */}
                  <select name="student"
                    value={form.student}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-black-300 
                    rounded-full text-sm bg-white text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition">
                    <option value="">Select Student *</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>

                  <Input
                    name="passingYear"
                    placeholder="Passing Year * (e.g. 2023)"
                    onChange={handleChange}
                  />

                  <Input
                    name="companyName"
                    placeholder="Company Name"
                    onChange={handleChange}
                  />

                  <Input
                    name="jobRole"
                    placeholder="Job Role"
                    onChange={handleChange}
                  />

                  <Input
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                  />

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-cyan-600 text-white py-3 rounded-full font-medium hover:bg-cyan-700 disabled:opacity-70"
                    >
                      {loading ? "Creating..." : "Create Alumni"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/alumni")}
                      className="px-6 py-3 border rounded-full text-sm hover:bg-gray-50"
                    >
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

/* Reusable Input */

const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    {...props}
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 
    focus:outline-none focus:ring-2 focus:ring-cyan-400"
  />
);

export default AddAlumni;
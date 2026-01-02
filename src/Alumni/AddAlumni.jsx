import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

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

  /* ===== Fetch students ===== */
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
      toast.error(err?.response?.data?.message || "Failed to create alumni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}/>
      <div className="absolute inset-0 bg-gray-50 backdrop-blur-xl" />

      <div className="relative z-20 flex min-h-screen">
        <Sidebar/>

        <div className="flex-1 flex flex-col">
          <Header userName="Add Alumni" />

          <main className="flex-1 px-4 py-10">
            <div className="max-w-3xl mx-auto">

              {/* Heading */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Add Alumni
                </h2>
                <p className="text-gray-600 mt-1">
                  Mark a student as alumni after placement
                </p>
              </div>

              {/* Card */}
              <div
                className="bg-white border border-cyan-300
                rounded-3xl p-8 shadow-sm"
              >
                <form className="space-y-6">

                  {/* Student */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Student *
                    </label>
                    <select
                      name="student"
                      value={form.student}
                      onChange={handleChange}
                      className="input">
                      <option value="">Select Student</option>
                      {students.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Passing Year *
                      </label>
                      <input
                        name="passingYear"
                        value={form.passingYear}
                        onChange={handleChange}
                        placeholder="e.g. 2023"
                        className="input"/>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Company
                      </label>
                      <input
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Company name"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Job Role
                      </label>
                      <input
                        name="jobRole"
                        value={form.jobRole}
                        onChange={handleChange}
                        placeholder="Job role"
                        className="input"/>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="City / Location"
                        className="input"/>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-cyan-600 text-white
                      py-3 rounded-full font-medium text-sm
                      hover:bg-cyan-700 transition
                      disabled:opacity-70">
                      {loading ? "Creating..." : "Create Alumni"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/alumni")}
                      className="px-6 py-3 rounded-full border
                      text-sm hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AddAlumni;

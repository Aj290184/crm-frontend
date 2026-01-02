import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function AddPlacement() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    student: "",
    companyName: "",
    jobRole: "",
    package: "",
    location: "",
    status: "Placed",
    joiningDate: "",
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !form.student || !form.companyName || !form.jobRole ||
      !form.package || !form.location ){
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await callApi("/admin/createPlacement", "POST", form);

      toast.success("Placement added successfully");
      navigate("/placements");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add placement";
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
      <div className="absolute inset-0 bg-gray-50 backdrop-blur-xl" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header userName="Add Placement" />

          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-3xl mx-auto bg-white border border-cyan-300 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Add New Placement
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Student */}
                <select
                  name="student"
                  value={form.student}
                  onChange={handleChange}
                  className="input">
                  <option value="">Select Student *</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Company name *"
                  className="input"/>

                <input
                  type="text"
                  name="jobRole"
                  value={form.jobRole}
                  onChange={handleChange}
                  placeholder="Job role *"
                  className="input"/>

                <input
                  type="text"
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  placeholder="Package (e.g. 6 LPA) *"
                  className="input"/>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location *"
                  className="input"/>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input">
                  <option value="Placed">Placed</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <input
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  className="input"/>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-600 text-white py-3 rounded-full">
                  {loading ? "Saving..." : "Add Placement"}
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

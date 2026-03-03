import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

import "../Auth/signup.css";

export default function AddPlacement() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    student: "",
    companyName: "",
    jobRole: "",
    package: "",
    location: "",
    status: "Placed",
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.student ||
      !form.companyName ||
      !form.jobRole ||
      !form.package ||
      !form.location
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await callApi("/admin/createPlacement", "POST", form);
      toast.success("Placement added successfully");
      navigate("/placements");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add placement"
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

              {/* LEFT FORM */}
              <div className="w-full max-w-xl rounded-2xl p-8 z-10">

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add Placement
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Record student placement details
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

                  <Input name="companyName"
                    placeholder="Company name *"
                    onChange={handleChange}/>

                  <Input
                    name="jobRole"
                    placeholder="Job role *"
                    onChange={handleChange}
                  />

                  <Input
                    name="package"
                    placeholder="Package (e.g. 6 LPA) *"
                    onChange={handleChange}
                  />

                  <Input name="location"
                    placeholder="Location *"
                    onChange={handleChange}/>

                  <select name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-black-300 
                    rounded-full text-sm bg-white text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition">
                    <option value="Placed">Placed</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-600 text-white py-3 rounded-full font-medium hover:bg-cyan-700 disabled:opacity-70">
                    {loading ? "Saving..." : "Add Placement"}
                  </button>
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
    focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
);
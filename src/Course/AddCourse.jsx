import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

import "../Auth/signup.css";

export default function AddCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseName: "",
    duration: "",
    fee: "",
    description: "",
    status: "Active",
  });

  const [courseImg, setCourseImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.courseName || !form.duration || !form.fee || !courseImg) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      formData.append("courseImg", courseImg);

      await callApi("/admin/createCourse", "POST", formData);

      toast.success("Course created successfully");
      navigate("/courses");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create course"
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
                    Create Course
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Add basic course details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  <Input
                    name="courseName"
                    placeholder="Course name *"
                    onChange={handleChange}
                  />

                  <Input
                    name="duration"
                    placeholder="Duration (e.g. 6 Months) *"
                    onChange={handleChange}
                  />

                  <Input
                    type="number"
                    name="fee"
                    placeholder="Course fee *"
                    onChange={handleChange}
                  />

                  <textarea
                    name="description"
                    placeholder="Short description"
                    rows={1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-full text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                  <Select
                    name="status"
                    onChange={handleChange}
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ]}
                  />

                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Course Image *
                    </label>
                    <input type="file"
                      accept="image/*"
                      onChange={(e) => setCourseImg(e.target.files[0])}
                      className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-cyan-600 text-white py-3 rounded-full font-medium hover:bg-cyan-700 disabled:opacity-70"
                    >
                      {loading ? "Creating..." : "Create Course"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/courses")}
                      className="px-8 py-3 border rounded-full text-sm hover:bg-gray-100"
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

/* Reusable */

const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    {...props}
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 
    focus:outline-none focus:ring-2 focus:ring-cyan-400"
  />
);

const Select = ({ options, ...props }) => (
  <select {...props}
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 
    focus:outline-none focus:ring-2 focus:ring-cyan-400">
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
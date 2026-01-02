import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function AddCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseName: "",
    duration: "",
    fee: "",
    description: "",
    eligibility: "",
    level: "Beginner",
    mode: "Offline",
    syllabus: "",
    instructorName: "",
    instructorExperience: "",
    status: "Active",
    startDate: "",
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

      // normal fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === "syllabus") {
          formData.append(
            "syllabus",
            JSON.stringify(
              value.split(",").map((s) => s.trim())
            )
          );
        } else {
          formData.append(key, value);
        }
      });

      // nested instructor
      formData.append("instructor[name]", form.instructorName);
      formData.append(
        "instructor[experience]",
        form.instructorExperience
      );

      // image
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
    <div className="w-full min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gray-50 backdrop-blur-sm" />

      <div className="relative z-20 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-4xl mx-auto bg-white border border-cyan-200 rounded-2xl p-8">

              <h2 className="text-2xl font-bold text-gray-900">
                Create Course
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Add course details
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* BASIC INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="courseName"
                    placeholder="Course name *"
                    onChange={handleChange}
                    className="input"
                  />

                  <input
                    name="duration"
                    placeholder="Duration (e.g. 6 Months) *"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="fee"
                    placeholder="Course fee *"
                    onChange={handleChange}
                    className="input"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCourseImg(e.target.files[0])}
                    className="input"
                  />
                </div>

                {/* DESCRIPTION */}
                <textarea
                  name="description"
                  placeholder="Short description"
                  rows={2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />

                {/* SYLLABUS */}
                <input
                  name="syllabus"
                  placeholder="Syllabus (comma separated)"
                  onChange={handleChange}
                  className="input"
                />

                {/* ELIGIBILITY + LEVEL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="eligibility"
                    placeholder="Eligibility"
                    onChange={handleChange}
                    className="input"
                  />

                  <select
                    name="level"
                    onChange={handleChange}
                    className="input"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                {/* MODE + STATUS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="mode"
                    onChange={handleChange}
                    className="input"
                  >
                    <option>Offline</option>
                    <option>Online</option>
                    <option>Hybrid</option>
                  </select>

                  <select
                    name="status"
                    onChange={handleChange}
                    className="input"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                {/* INSTRUCTOR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="instructorName"
                    placeholder="Instructor name"
                    onChange={handleChange}
                    className="input"
                  />

                  <input
                    name="instructorExperience"
                    placeholder="Instructor experience (e.g. 5+ years)"
                    onChange={handleChange}
                    className="input"
                  />
                </div>

                {/* START DATE */}
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  className="input"
                />

                {/* ACTIONS */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-cyan-600 text-white py-2.5 rounded-full font-medium hover:bg-cyan-700 disabled:opacity-70"
                  >
                    {loading ? "Creating..." : "Create Course"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/courses")}
                    className="px-8 py-2 border rounded-full text-sm"
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

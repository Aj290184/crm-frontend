import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    courseName: "",
    duration: "",
    fee: "",
    courseImg: "",
    description: "",
    eligibility: "",
    level: "Beginner",
    mode: "Offline",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // fetch course by id
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await callApi(`/courses/${id}`, "GET");
        const c = res?.data;

        setForm({
          courseName: c.courseName || "",
          duration: c.duration || "",
          fee: c.fee || "",
          courseImg: c.courseImg || "",
          description: c.description || "",
          eligibility: c.eligibility || "",
          level: c.level || "Beginner",
          mode: c.mode || "Offline",
        });
      } catch (err) {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.courseName || !form.duration || !form.fee) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setSaving(true);
      await callApi(`/courses/${id}`, "PUT", form);
      toast.success("Course updated successfully");
      navigate(`/courses/${id}`);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update course"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading course...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />

      <div className="relative z-20 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header userName="Edit Course" />

          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-5xl mx-auto bg-white border-2 border-cyan-300 rounded-3xl p-10">

              <h2 className="text-2xl font-bold text-gray-900">
                Edit Course
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                Update course details below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    name="courseName"
                    value={form.courseName}
                    onChange={handleChange}
                    placeholder="Course name *"
                    className="pill-input"
                  />

                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Duration *"
                    className="pill-input"
                  />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="number"
                    name="fee"
                    value={form.fee}
                    onChange={handleChange}
                    placeholder="Course fee *"
                    className="pill-input"
                  />

                  <input
                    name="courseImg"
                    value={form.courseImg}
                    onChange={handleChange}
                    placeholder="Course image URL"
                    className="pill-input"
                  />
                </div>

                {/* Description */}
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Course description"
                  className="pill-input"
                />

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    name="eligibility"
                    value={form.eligibility}
                    onChange={handleChange}
                    placeholder="Eligibility"
                    className="pill-input"
                  />

                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className="pill-input"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Mode */}
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="pill-input"
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>

                {/* Buttons */}
                <div className="flex items-center gap-6 pt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-cyan-600 text-white py-4 rounded-full
                    text-lg font-medium hover:bg-cyan-700 disabled:opacity-70"
                  >
                    {saving ? "Saving..." : "Update Course"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-10 py-4 border rounded-full text-lg"
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

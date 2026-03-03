import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

import "../Auth/signup.css";

export default function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    courseName: "",
    duration: "",
    fee: "",
    description: "",
    courseImg: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await callApi(`/courses/${id}`, "GET");
        const c = res?.data;

        setForm({
          courseName: c.courseName || "",
          duration: c.duration || "",
          fee: c.fee || "",
          description: c.description || "",
          courseImg: c.courseImg || "",
        });
      } catch {
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
    <div className="w-full min-h-screen relative bg-gray-50 overflow-hidden">

      {/* Background */}
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

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Edit Course
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      name="courseName"
                      value={form.courseName}
                      onChange={handleChange}
                      placeholder="Course name *"
                    />

                    <Input
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="Duration *"
                    />
                  </div>

                  <Input
                    type="number"
                    name="fee"
                    value={form.fee}
                    onChange={handleChange}
                    placeholder="Course fee *"
                  />

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Course description"
                    rows={1}
                    className="w-full border border-gray-300 rounded-full 
                    px-4 py-3 text-sm text-gray-800 bg-white
                    focus:outline-none focus:ring-2 focus:ring-cyan-500
                    whitespace-nowrap overflow-hidden"/>

                  <Input
                    name="courseImg"
                    value={form.courseImg}
                    onChange={handleChange}
                    placeholder="Course image URL"
                  />

                  <div className="flex gap-4 pt-4">
                    <button type="submit"
                      disabled={saving}
                      className="flex-1 bg-cyan-600 text-white py-3 rounded-full 
                      font-medium hover:bg-cyan-700 disabled:opacity-70">
                      {saving ? "Saving..." : "Update Course"}
                    </button>

                    <button type="button"
                      onClick={() => navigate(-1)}
                      className="px-6 py-3 border rounded-full text-sm hover:bg-gray-50">
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
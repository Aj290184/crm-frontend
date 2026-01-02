import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    designation: "",
    department: "",
    experience: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //password required ONLY if not teacher
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.role ||
      (form.role !== "teacher" && !form.password)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        //do not send empty password for teacher
        if (key === "password" && form.role === "teacher") return;
        if (value !== "") formData.append(key, value);
      });

      if (form.experience) {
        formData.set("experience", Number(form.experience));
      }

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      await callApi("/admin/createUser", "POST", formData);

      toast.success("User created successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create user"
      );
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
          <Header />

          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-5xl mx-auto bg-white border border-cyan-300 rounded-2xl p-6 md:p-8">

              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Create New User
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Add admin, counsellor, HR or teacher.
              </p>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name *"
                  className="input"
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address *"
                  className="input"
                />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number *"
                  className="input"
                />

                {/* PASSWORD (hide for teacher) */}
                {form.role !== "teacher" && (
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password *"
                    className="input"
                  />
                )}

                {/* ROLE */}
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select role *</option>
                  <option value="admin">Admin</option>
                  <option value="counseller">Counsellor</option>
                  <option value="hr">HR</option>
                  <option value="teacher">Teacher</option>
                </select>

                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="Designation (e.g. MERN Instructor)"
                  className="input"
                />

                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Department (e.g. Development)"
                  className="input"
                />

                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Experience (years)"
                  className="input"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfileImage(e.target.files[0])}
                  className="md:col-span-2 input"/>

                <div className="md:col-span-2 flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-cyan-600 text-white py-3 rounded-full
                    font-medium hover:bg-cyan-700 disabled:opacity-70">
                    {loading ? "Creating..." : "Create User"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-3 border rounded-full text-sm">
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

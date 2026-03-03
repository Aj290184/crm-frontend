import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    experience: "",
    role: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.experience ||
      !form.role
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "") formData.append(key, value);
      });

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
    <div className="w-full min-h-screen relative bg-gray-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 px-10 py-10 flex items-center">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between">

              <div className="w-full max-w-lg rounded-2xl p-8 z-10">

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create User
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Add new team member
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                  />

                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                  />

                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number *"
                  />

                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password *"
                  />

                  <Input
                    type="number"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Experience (years) *"
                  />

                  <Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    options={[
                      { label: "Select Role *", value: "" },
                      { label: "Admin", value: "admin" },
                      { label: "Counsellor", value: "counseller" },
                      { label: "HR", value: "hr" },
                      { label: "Teacher", value: "teacher" },
                    ]}
                  />

                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                      className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-cyan-600 text-white py-3 rounded-full font-medium hover:bg-cyan-700 transition disabled:opacity-70"
                    >
                      {loading ? "Creating..." : "Create User"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="px-5 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>

                </form>
              </div>

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

const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    {...props}
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
);

const Select = ({ options, ...props }) => (
  <select {...props}
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400">
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
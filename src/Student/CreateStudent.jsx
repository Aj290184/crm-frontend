import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

import "../Auth/signup.css";

export default function CreateStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    gender: "",
    age: "",
    qualification: "",
    email: "",
    phone: "",
    address: "",
    course: "",
    batch: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in form) {
      if (!form[key]) {
        toast.error("Please fill all required fields");
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await callApi("/admin/create-students", "POST", formData);

      toast.success(res?.message || "Student created successfully");
      navigate("/students");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to create student"
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
              <div className="w-full max-w-2xl rounded-2xl p-8 z-10">

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create Student
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Add new student to the system
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" />

                  <Select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    options={[
                      { label: "Select Gender *", value: "" },
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                  />

                  <Input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age *" />

                  <Input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification *" />

                  <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address *" />

                  <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" />

                  <Input name="course" value={form.course} onChange={handleChange} placeholder="Course *" />

                  <Input name="batch" value={form.batch} onChange={handleChange} placeholder="Batch *" />

                  <div className="md:col-span-2">
                    <Input name="address" value={form.address} onChange={handleChange} placeholder="Address *" />
                  </div>

                  <div className="md:col-span-2">
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

                  <div className="md:col-span-2 flex gap-3 pt-4">
                    <button type="submit"
                      disabled={loading}
                      className="flex-1 bg-cyan-600 text-white py-3 rounded-full font-medium hover:bg-cyan-700 disabled:opacity-70">
                      {loading ? "Creating..." : "Create Student"}
                    </button>

                    <button type="button"
                      onClick={() => navigate("/students")}
                      className="px-6 py-3 border rounded-full text-sm hover:bg-gray-100">
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
  <select
    {...props}
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 
    focus:outline-none focus:ring-2 focus:ring-cyan-400"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
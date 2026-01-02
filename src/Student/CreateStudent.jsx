import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

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
    <div className="w-full min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}/>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header userName="Add Student" />

          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-3xl mx-auto bg-white border border-cyan-300 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Create Student
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Fill student details and add them to the system.
              </p>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full name *" className="input" />

                <select name="gender" value={form.gender} onChange={handleChange} className="input">
                  <option value="">Select gender *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age *" className="input" />

                <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification *" className="input" />

                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="student@mail.com *" className="input" />

                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number *" className="input" />

                <input name="address" value={form.address} onChange={handleChange} placeholder="Address *" className="md:col-span-2 input" />

                <input name="course" value={form.course} onChange={handleChange} placeholder="Course *" className="input" />

                <input name="batch" value={form.batch} onChange={handleChange} placeholder="Batch *" className="input" />

                {/* Image upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="md:col-span-2 input"/>

                <div className="md:col-span-2 flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-cyan-600 text-white py-3 rounded-full font-medium hover:bg-cyan-700 disabled:opacity-70">
                    {loading ? "Creating..." : "Create Student"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/students")}
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

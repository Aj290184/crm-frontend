import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    designation: "",
    department: "",
    experience: "",
    status: "Active",
    profileImage: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await callApi("/profile", "GET");
        const data = res?.data || {};

        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          designation: data.designation || "",
          department: data.department || "",
          experience: data.experience || "",
          status: data.status || "Active",
          profileImage: data.profileImage || "",
        });
      } catch (err) {
        console.error("fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key !== "profileImage") {
          formData.append(key, value);
        }
      });

      if (newImage) {
        formData.append("profileImage", newImage);
      }

      await callApi("/profile", "PUT", formData);
      navigate("/profile");
    } catch (err) {
      console.error("update profile error:", err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />

      <div className="relative z-20 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="w-full max-w-3xl mx-auto">

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Profile
                </h2>
                <p className="text-sm text-gray-600">
                  Update your account details
                </p>
              </div>

              <article className="border border-cyan-400 rounded-xl p-6 bg-white">
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* PROFILE IMAGE */}
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-cyan-50 flex items-center justify-center">
                      {newImage ? (
                        <img
                          src={URL.createObjectURL(newImage)}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                      ) : form.profileImage ? (
                        <img
                          src={form.profileImage}
                          alt="profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-cyan-700 font-bold text-lg">
                          {form.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                      )}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewImage(e.target.files[0])}
                      className="text-sm"
                    />
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="text-xs text-gray-500">Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <input
                        value={form.email}
                        disabled
                        className="input bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Designation</label>
                      <input
                        name="designation"
                        value={form.designation}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Department</label>
                      <input
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Experience (years)</label>
                      <input
                        type="number"
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="input"
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Suspended</option>
                      </select>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-cyan-600 text-white px-6 py-2 rounded-full text-sm hover:bg-cyan-700">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/profile")}
                      className="border px-6 py-2 rounded-full text-sm hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </form>
              </article>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";
import { AuthContext } from "../Context/AuthContext";
import bgImage from "../assets/89124.jpg";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        experience: user.experience || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("role", form.role);
      formData.append("experience", form.experience);

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const res = await callApi("/profile", "PUT", formData);
      const updatedUser = res?.data;

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      navigate("/profile");
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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

              <div className="w-full max-w-lg rounded-2xl p-8 z-10">

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Profile
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Update your account details
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
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number *"
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
                      Email
                    </label>
                    <input
                      value={form.email}
                      disabled
                      className="w-full border rounded-full px-4 py-3 text-sm bg-gray-100"
                    />
                  </div>

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
                    <button type="submit"
                      disabled={loading}
                      className="flex-1 bg-cyan-600 text-white py-3 rounded-full font-medium hover:bg-cyan-700 transition disabled:opacity-70">
                      {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button type="button"
                      onClick={() => navigate("/profile")}
                      className="px-5 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition">
                      Cancel
                    </button>
                  </div>

                  <button type="button"
                    onClick={() => navigate("/change-password")}
                    className="w-full mt-3 text-sm text-cyan-600 hover:underline">
                    Change Password
                  </button>
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
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
  />
);

const Select = ({ options, ...props }) => (
  <select
    {...props}
    className="w-full border rounded-full px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
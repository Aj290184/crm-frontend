import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import bgImage from "../assets/89124.jpg";
import { callApi } from "../Services/Api";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      Toast.fire({ icon: "warning", title: "Please fill all fields" });
      return;
    }

    if (form.newPassword.length < 6) {
      Toast.fire({
        icon: "warning",
        title: "Password must be at least 6 characters",
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      Toast.fire({ icon: "error", title: "Passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      await callApi("/update-password", "PUT", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      Toast.fire({
        icon: "success",
        title: "Password updated successfully",
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      const backend = err?.response?.data;
      const msg = backend?.message || backend?.error ||
      "Password update failed";

      Toast.fire({ icon: "error", title: msg });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-md rounded-2xl p-8">

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Change Password
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Update your account password securely
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type={showPwd ? "text" : "password"}
            name="currentPassword"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-full
            focus:outline-none focus:border-cyan-400 text-sm"/>

          <input
            type={showPwd ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-full focus:outline-none focus:border-cyan-400 text-sm"
          />

          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full focus:outline-none focus:border-cyan-400 text-sm pr-16"/>

            <button
              type="button"
              onClick={() => setShowPwd((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600 text-white rounded-full text-lg font-medium hover:bg-cyan-700 disabled:opacity-70">
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full border py-3 rounded-full text-sm hover:bg-gray-50">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import bgImage from "../assets/89124.jpg";
import { callApi } from "../Services/Api";

export default function Reset() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [form, setForm] = useState({
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

    if (!form.newPassword || !form.confirmPassword) {
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
      await callApi(`/reset-password/${token}`, "POST", {
        newPassword: form.newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "You can now login with your new password.",
        confirmButtonColor: "#0891b2",
      });

      navigate("/");

    } catch (err) {
      const backend = err?.response?.data;
      const msg =
        backend?.message ||
        backend?.error ||
        "Invalid or expired reset link";

      Swal.fire({
        icon: "error",
        title: msg,
        confirmButtonColor: "#0891b2",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg">

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type={showPwd ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-full focus:outline-none
           focus:border-cyan-400 text-sm"/>

          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-full focus:outline-none focus:border-cyan-400 text-sm pr-16"/>

            <button type="button"
              onClick={() => setShowPwd((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600 text-white rounded-full text-lg font-medium hover:bg-cyan-700 disabled:opacity-70">
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
}
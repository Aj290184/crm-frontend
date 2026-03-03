import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../index.css";

import bgImage from "../assets/89124.jpg";
import { callApi } from "../Services/Api";
import { AuthContext } from "../Context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
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

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your registered email",
      inputPlaceholder: "hello@yourmail.com",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
      confirmButtonColor: "#0891b2",
      inputValidator: (value) => {
        if (!value) return "Email is required!";
      },
    });

    if (!email) return;

    try {
      await callApi("/forgot-password", "POST", { email });
      await Swal.fire({
        icon: "success",
        title: "Check your email",
        text: "Reset link has been sent successfully.",
        confirmButtonColor: "#0891b2",
      });
    } catch (err) {
      const backend = err?.response?.data;
      const msg =
        backend?.message ||
        backend?.error ||
        "Failed to send reset link";

      Swal.fire({
        icon: "error",
        title: msg,
        confirmButtonColor: "#0891b2",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      Toast.fire({
        icon: "warning",
        title: "Please enter email and password",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await callApi("/login", "POST", { email, password });
      const { message, data } = res || {};
      const payload = data || {};

      Toast.fire({
        icon: "success",
        title:
          message ||
          (payload.isVarified
            ? "Logged in successfully"
            : "OTP sent to your email"),
      });

      if (payload.isVarified) {
        if (payload.token) {
          localStorage.setItem("accessToken", payload.token);
        }

        if (payload.user) {
          localStorage.setItem("user", JSON.stringify(payload.user));
          setUser(payload.user);
        }

        setForm({ email: "", password: "" });
        navigate("/dashboard");
      } else {
        const finalEmail = payload.email || email;
        localStorage.setItem("loginEmail", finalEmail);
        setForm({ email: "", password: "" });
        navigate("/otp", { state: { email: finalEmail } });
      }
    } catch (err) {
      const backend = err?.response?.data;
      const msg =
        backend?.message ||
        backend?.error ||
        err?.message ||
        "Login failed. Please try again.";

      Toast.fire({ icon: "error", title: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 overflow-hidden">

        {/* LEFT SIDE - LOGIN FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md backdrop-blur-lg rounded-3xl p-10">

            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Welcome to <br />
                <span className="block text-cyan-600">PROCODE CRM</span>
              </h1>
              <p className="text-sm text-gray-600 mt-4">
                Manage your courses, assignments and progress from one place.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="email"
                name="email"
                placeholder="hello@yourmail.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-full focus:outline-none focus:border-cyan-400 text-sm"
              />

              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-full focus:outline-none focus:border-cyan-400 text-sm pr-16"
                />

                <button
                  type="button"
                  onClick={() => setShowPwd((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600">
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>

              <div className="text-right">
                <button type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-cyan-600 hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-600 text-white rounded-full text-lg font-medium disabled:opacity-70">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE - FLOATING 3D AREA */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
          {/* Floating Balls */}
          <div className="absolute w-72 h-72 bg-cyan-400 rounded-full opacity-30 blur-3xl animate-floatSlow left-20"></div>
          <div className="absolute w-52 h-52 bg-pink-400 rounded-full opacity-30 blur-3xl animate-floatMedium bottom-20 right-24"></div>
          <div className="absolute w-40 h-40 bg-yellow-400 rounded-full opacity-30 blur-3xl animate-floatFast top-1/2 right-10"></div>
        </div>
      </div>
    </div>
  );
}
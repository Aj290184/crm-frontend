import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import bgImage from "../assets/89124.jpg";
import { callApi } from "../Services/Api";

export default function OtpVerify() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location?.state?.email || localStorage.getItem("loginEmail");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Session expired, please login again");
      navigate("/");
    }
  }, [email, navigate]);

  //Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) return toast.error("Please enter OTP");

    setLoading(true);

    try {
      const res = await callApi("/verify-otp", "POST", { email, otp });

      const { message, data } = res || {};
      const { token, user } = data || {};

      toast.success(message || "OTP verified");

      // Save auth info
      if (token) localStorage.setItem("accessToken", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Remove temporary stored email
      localStorage.removeItem("loginEmail");

      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "OTP verification failed";
      toast.error(msg);
      console.error("OTP verify error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleChangeAccount = () => {
    localStorage.removeItem("loginEmail");
    navigate("/");
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="w-full max-w-6xl rounded-[30px] flex flex-col md:flex-row gap-6 md:max-h-[90vh] overflow-hidden">
        <div className="w-full md:w-1/2 flex items-center justify-center mx-auto">
          <div className="w-full max-w-md rounded-[22px] p-5 md:p-10 backdrop-blur">
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              OTP Verification
            </h1>

            <p className="text-sm md:text-base text-gray-600 mb-6">
              An OTP has been sent to{" "}
              <span className="font-semibold">{email}</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-900 rounded-full focus:outline-none focus:border-cyan-300 text-sm"/>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-600 text-white rounded-full text-lg font-medium disabled:opacity-70">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={handleChangeAccount}
                className="w-full py-3 border border-gray-900 rounded-full text-gray-700 text-sm">
                Change email / password
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

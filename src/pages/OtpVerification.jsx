import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { IoArrowBackOutline } from "react-icons/io5";
import { authApi } from "../api/authApi";

export default function OtpVerification() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const inputs = useRef([]);


  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));

  useEffect(() => {
    const savedEmail = localStorage.getItem("pendingEmail");
    if (!savedEmail) {
      navigate("/register");
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otpArray];
    newOtp[index] = element.value;
    setOtpArray(newOtp);
    if (element.value !== "" && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otpArray.join("");
    if (otpString.length < 6) return alert("Vui lòng nhập đủ 6 số");

    setLoading(true);
    try {
      const response = await authApi.verifyOtp({ email, otp: otpString });
      if (response.status === 200) {
        alert("Xác thực thành công!");
        localStorage.removeItem("pendingEmail");
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        navigate("/profile-setup");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      setTimer(60);
      alert("Mã OTP mới đã được gửi vào email của bạn");
    } catch (error) {
      alert("Không thể gửi lại mã, vui lòng thử lại sau");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="card w-full max-w-sm bg-slate-800 shadow-2xl border border-slate-700 text-white">
        <form onSubmit={handleVerify} className="card-body p-8 items-center text-center">

          <Link to="/register" className="self-start text-slate-400 hover:text-white flex items-center gap-1 mb-4 text-sm">
            <IoArrowBackOutline /> Quay lại
          </Link>

          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
            <HiOutlineMail className="text-3xl text-indigo-500" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Xác thực mã OTP</h2>
          <p className="text-sm text-slate-400">
            Mã xác nhận đã gửi đến <br /> <span className="text-indigo-400">{email}</span>
          </p>

          <div className="flex gap-2 mt-8 mb-6">
            {otpArray.map((data, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 text-center font-bold text-xl bg-slate-700 border border-slate-600 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary w-full text-white border-none bg-indigo-600 hover:bg-indigo-700 font-bold text-lg mb-4 ${loading ? 'loading' : ''}`}
          >
            {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN"}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0}
            className={`flex items-center justify-center gap-2 text-sm font-medium transition-all
              ${timer > 0 ? "text-slate-500 cursor-not-allowed" : "text-indigo-400 hover:text-indigo-300 cursor-pointer"}`}
          >
            Gửi lại mã OTP {timer > 0 && <span className="badge badge-sm bg-slate-700 border-none text-indigo-400 font-mono">{timer}s</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
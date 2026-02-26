import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { authApi } from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    if (name.trim().length < 2) {
      return alert("Họ và tên phải có ít nhất 2 ký tự.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return alert("Vui lòng nhập địa chỉ Email hợp lệ.");
    }

    if (password.length < 6) {
      return alert("Mật khẩu phải có ít nhất 6 ký tự.");
    }

    setLoading(true);
    try {
      const registerData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      };

      const response = await authApi.register(registerData);

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("pendingEmail", registerData.email);
        navigate("/otp");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="card w-full max-w-md bg-slate-800 shadow-2xl border border-slate-700 text-white">
        <form onSubmit={handleSubmit} className="card-body p-8">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
              Clique Profile
            </h2>
            <div className="h-1 w-12 bg-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {/* Họ và Tên */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-slate-300 font-semibold">Họ và Tên</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <HiOutlineUser className="text-xl text-slate-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  className="input input-bordered w-full bg-slate-700 border-slate-600 text-white pl-10 focus:border-primary focus:outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-slate-300 font-semibold">Email</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <HiOutlineEnvelope className="text-xl text-slate-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  placeholder="clique@vi-du.com"
                  className="input input-bordered w-full bg-slate-700 border-slate-600 text-white pl-10 focus:border-primary focus:outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-slate-300 font-semibold">Mật khẩu</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <HiOutlineLockClosed className="text-xl text-slate-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input input-bordered w-full bg-slate-700 border-slate-600 text-white pl-10 focus:border-primary focus:outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full text-white border-none bg-indigo-600 hover:bg-indigo-700 font-bold text-lg shadow-lg uppercase active:scale-95 transition-transform ${loading ? 'loading' : ''}`}
            >
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>

            <div className="divider text-[10px] uppercase text-slate-500 my-2 px-10">Hoặc đăng ký bằng</div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="btn btn-outline border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors">
                <FcGoogle className="text-2xl mr-1" /> Google
              </button>
              <button type="button" className="btn btn-outline border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors">
                <FaApple className="text-2xl mr-1 text-white" /> Apple
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-primary no-underline hover:underline font-bold transition-all">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineEnvelope, HiOutlineLockClosed } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { authApi } from "../api/authApi";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        if (!email.trim() || !password) {
            return alert("Vui lòng nhập đầy đủ Email và Mật khẩu.");
        }

        setLoading(true);
        try {
            const response = await authApi.login({
                email: email.trim().toLowerCase(),
                password: password
            });

            const user = response.data.user;

            localStorage.setItem("pendingEmail", user.email);

            if (!user.isActivated) {
                return navigate("/otp");
            }

            if (!user.hasCompletedOnboarding) {
                return navigate("/profile-setup");
            }

            navigate("/home");
        } catch (error) {
            alert(error.response?.data?.message || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 font-sans text-white">
            <div className="card w-full max-w-md bg-slate-800 shadow-2xl border border-slate-700">
                <form onSubmit={handleLogin} className="card-body p-8">

                    {/* Brand Name */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
                            Clique Profile
                        </h2>
                        <div className="h-1 w-12 bg-indigo-500 mx-auto rounded-full"></div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Email */}
                        <div className="form-control w-full">
                            <label className="label py-1">
                                <span className="label-text text-slate-300 font-semibold">Email</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                    <HiOutlineEnvelope className="text-xl text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="clique@example.com"
                                    className="input input-bordered w-full bg-slate-700 border-slate-600 text-white pl-10 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-control w-full">
                            <label className="label py-1">
                                <span className="label-text text-slate-300 font-semibold">Password</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                    <HiOutlineLockClosed className="text-xl text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="input input-bordered w-full bg-slate-700 border-slate-600 text-white pl-10 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn btn-primary w-full text-white border-none bg-indigo-600 hover:bg-indigo-700 font-bold text-lg shadow-lg active:scale-95 transition-transform ${loading ? 'loading' : ''}`}
                        >
                            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
                        </button>

                        <div className="divider text-[10px] uppercase text-slate-500 my-2">Hoặc đăng nhập với</div>

                        {/* Social login*/}
                        <div className="flex flex-col gap-2">
                            <button type="button" className="btn btn-outline w-full border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors">
                                <FcGoogle className="text-2xl mr-2" />
                                Google
                            </button>
                            <button type="button" className="btn btn-outline w-full border-slate-600 text-slate-200 hover:bg-slate-700 transition-colors">
                                <FaApple className="text-2xl mr-2 text-white" />
                                Apple
                            </button>
                        </div>
                    </div>

                    {/* Footer Link */}
                    <p className="mt-8 text-center text-sm text-slate-400">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="text-indigo-500 no-underline hover:underline font-bold transition-all">
                            Đăng ký ngay
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
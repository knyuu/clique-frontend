import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import {
    HiOutlineCamera, HiOutlineUser, HiOutlineMapPin,
    HiOutlineIdentification, HiOutlineHeart, HiOutlineCake
} from "react-icons/hi2";

export default function ProfileSetup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        city: "",
        gender: "Male",
        genderPreference: "Both",
        bio: ""
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await authApi.getMe();
                const user = response.data;

                setFormData({
                    name: user.name || "",
                    age: user.age || "",
                    city: user.city === "Update later" ? "" : user.city,
                    gender: user.gender || "Male",
                    genderPreference: user.genderPreference || "Both",
                    bio: user.bio || ""
                });
                if (user.avatar) setPreview(user.avatar);
            } catch (error) {
                console.error("Lỗi khi load profile:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchUserData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleFinish = async (e) => {
        e.preventDefault();
        if (!preview && !avatarFile) {
            return alert("Vui lòng tải lên ảnh đại diện. Hồ sơ có ảnh sẽ tăng 80% tỷ lệ kết nối!");
        }

        if (!formData.name.trim() || formData.name.trim().length < 2) {
            return alert("Tên hiển thị không được để trống và phải có ít nhất 2 ký tự.");
        }

        const ageNum = parseInt(formData.age);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
            return alert("Tuổi phải là số và bạn phải từ 18 tuổi trở lên để sử dụng ứng dụng.");
        }

        if (!formData.city.trim() || formData.city === "Update later") {
            return alert("Vui lòng nhập thành phố bạn đang sinh sống.");
        }

        if (!formData.bio.trim() || formData.bio.trim().length < 10) {
            return alert("Hãy viết một chút về bản thân (ít nhất 10 ký tự) để mọi người hiểu bạn hơn.");
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("age", formData.age);
            data.append("city", formData.city);
            data.append("gender", formData.gender);
            data.append("genderPreference", formData.genderPreference);
            data.append("bio", formData.bio);
            if (avatarFile) data.append("avatar", avatarFile);

            await authApi.updateProfile(data);

            alert("Hồ sơ của bạn đã sẵn sàng!");
            navigate("/home");
        } catch (error) {
            alert(error.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <span className="loading loading-dots loading-lg text-indigo-500"></span>
        </div>
    );

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4 py-12">
            <div className="w-full max-w-xl bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2 uppercase italic">
                        Clique Profile
                    </h2>
                    <div className="h-1 w-12 bg-indigo-500 mx-auto rounded-full"></div>
                </div>

                <form onSubmit={handleFinish} className="space-y-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative w-32 h-32 rounded-full border-2 border-slate-600 bg-slate-900 flex items-center justify-center overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <HiOutlineCamera className="text-3xl text-slate-600" />
                                )}
                                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 mt-3 tracking-widest uppercase">Ảnh đại diện</p>
                    </div>

                    <div className="space-y-5">
                        {/* Tên */}
                        <div className="group">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Tên hiển thị</label>
                            <div className="relative">
                                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 h-14 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Tuổi & Thành phố */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Tuổi</label>
                                <div className="relative">
                                    <HiOutlineCake className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                    <input
                                        type="number"
                                        required
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 h-14 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Thành phố</label>
                                <div className="relative">
                                    <HiOutlineMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 h-14 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Giới tính</label>
                            <div className="flex gap-3">
                                {[
                                    { val: 'Male', label: 'Nam' },
                                    { val: 'Female', label: 'Nữ' },
                                    { val: 'Other', label: 'Khác' }
                                ].map((item) => (
                                    <button
                                        key={item.val}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: item.val })}
                                        className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-all ${formData.gender === item.val
                                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                                            : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-indigo-500"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tìm kiếm */}
                        <div className="group">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Bạn muốn tìm thấy ai?</label>
                            <div className="relative">
                                <HiOutlineHeart className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500/60" />
                                <select
                                    value={formData.genderPreference}
                                    onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-10 h-14 rounded-2xl focus:border-indigo-500 focus:outline-none appearance-none transition-all cursor-pointer"
                                >
                                    <option value="Both">Tất cả mọi người</option>
                                    <option value="Male">Nam giới</option>
                                    <option value="Female">Nữ giới</option>
                                </select>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="group">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block">Giới thiệu bản thân</label>
                            <div className="relative">
                                <HiOutlineIdentification className="absolute left-4 top-4 text-slate-600" />
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Chia sẻ sở thích, đam mê của bạn..."
                                    className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-4 h-32 rounded-2xl focus:border-indigo-500 focus:outline-none resize-none transition-all"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg tracking-widest uppercase rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 active:scale-95">
                        {loading ? "Đang lưu hồ sơ..." : "Hoàn tất hồ sơ"}
                    </button>
                </form>
            </div>
        </div>
    );
}
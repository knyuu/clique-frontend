import React, { useEffect } from 'react';
import { HiHeart, HiXMark, HiOutlineMapPin } from "react-icons/hi2";
import { BsGenderFemale, BsGenderMale, BsGenderAmbiguous } from "react-icons/bs";

const UserDetailPopup = ({ user, onClose, onLike }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose} />
            <div className="relative bg-[#0a0a0f] w-full max-w-7xl h-[90vh] md:h-[85vh] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row">              
                <button onClick={onClose} className="absolute top-8 right-8 z-50 bg-black/60 hover:bg-white hover:text-black text-white rounded-full p-2 transition-all duration-300 border border-white/10">
                    <HiXMark className="w-6 h-6" />
                </button>
                <div className="relative w-full md:w-[30%] h-72 md:h-full shrink-0 overflow-hidden border-r border-white/5">
                    <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent" />
                </div>
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0f]">
                    {/* Header */}
                    <div className="p-10 pb-6 shrink-0">
                        <h2 className="text-5xl font-black text-white tracking-tight flex items-baseline gap-4">
                            {user.name}
                            <span className="text-3xl font-light text-slate-600">{user.age}</span>
                        </h2>
                        
                        <div className="flex items-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-indigo-500 font-bold tracking-[0.2em] uppercase text-xs">
                                <HiOutlineMapPin className="text-xl" /> {user.city}
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                                user.gender === 'Female' ? 'border-pink-500/30 text-pink-400 bg-pink-500/5' : 'border-blue-500/30 text-blue-400 bg-blue-500/5'
                            }`}>
                                {user.gender === 'Female' ? <BsGenderFemale /> : <BsGenderMale />}
                                {user.gender}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-10 py-2 custom-scrollbar">
                        <div className="w-full">
                            <h4 className="text-[11px] uppercase tracking-[0.4em] text-slate-500 font-black mb-6 shrink-0">
                                Giới thiệu bản thân
                            </h4>
                            <p className="text-slate-200 leading-[1.8] text-2xl font-medium whitespace-pre-wrap italic border-l-4 border-indigo-600/40 pl-8 py-2 w-full">
                                {user.bio || 'Người dùng này chưa viết gì...'}
                            </p>
                            <div className="h-20" />
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="p-10 pt-6 bg-[#0a0a0f] border-t border-white/5 shrink-0">
                        <button onClick={() => onLike(user._id)} className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group ${user.isLiked ? "bg-red-500 text-white shadow-red-500/20" : "bg-indigo-600 text-white shadow-indigo-600/20"}`}>
                            <HiHeart className={`w-7 h-7 transition-transform group-hover:scale-110 ${user.isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm tracking-widest">{user.isLiked ? "BẠN ĐÃ THÍCH NGƯỜI NÀY" : "THẢ TIM NGAY"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPopup;
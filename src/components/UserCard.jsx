import { HiHeart, HiOutlineMapPin } from "react-icons/hi2";
import { BsGenderFemale, BsGenderMale, BsGenderAmbiguous } from "react-icons/bs";

export default function UserCard({ user, onLike, onOpenPopup }) {
    const renderGenderIcon = () => {
        if (user.gender === 'Female') return <BsGenderFemale className="text-pink-400" />;
        if (user.gender === 'Male') return <BsGenderMale className="text-blue-400" />;
        return <BsGenderAmbiguous className="text-slate-400" />;
    };

    return (
        <div
            onClick={() => onOpenPopup(user)}
            className="flex flex-col bg-[#0a0a0f] rounded-[3rem] border border-white/5 shadow-2xl hover:border-indigo-500/40 transition-all duration-500 group overflow-hidden hover:-translate-y-2 cursor-pointer"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={user.avatar}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={user.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80"></div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLike(user._id);
                    }}
                    className={`absolute top-6 right-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 backdrop-blur-xl ${user.isLiked
                            ? "bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/40"
                            : "bg-black/30 text-white hover:bg-white hover:text-black"
                        }`}
                >
                    <HiHeart className={`text-xl ${user.isLiked ? "scale-110" : ""}`} />
                </button>
            </div>

            {/* User Info */}
            <div className="p-8 pt-2 flex flex-col gap-5">
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            {user.name.split(' ')[0]} <span className="font-black italic text-white">{user.name.split(' ')[1]}</span>
                        </h3>
                        <div className="flex items-center gap-2">
                            {renderGenderIcon()}
                            <span className="text-lg font-bold text-slate-500">{user.age}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase">
                        <HiOutlineMapPin className="text-sm" /> {user.city}
                    </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed italic line-clamp-2 min-h-[32px]">
                    "{user.bio}"
                </p>
                <button className="w-full py-4 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all duration-300">
                    View Detail
                </button>
            </div>
        </div>
    );
}
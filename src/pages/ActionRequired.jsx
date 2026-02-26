import { useState } from "react";
import { HiOutlineSparkles, HiOutlineCalendarDays, HiOutlineChevronRight, HiOutlineHeart, HiOutlineXMark } from "react-icons/hi2";
import api from "../utils/axios";

export default function ActionRequired({ data, refreshData, onMatchSuccess }) {
  const handleLikeBack = async (toUserId) => {
    try {
      const res = await api.post("/matches/toggle-like", { toUserId });
      if (res.data.isMatch) {
        onMatchSuccess(res.data.matchId);
        refreshData();
      }
    } catch (error) {
      console.error("Lỗi khi Like back:", error);
    }
  };

  const handleReject = async (toUserId) => {
    try {
      await api.post("/matches/reject-like", { fromUserId: toUserId });
      refreshData();
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="max-w-6xl h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-1000">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[50px] rounded-full"></div>
          <div className="relative p-8 bg-[#0a0a0f] border border-white/5 rounded-[3rem] shadow-2xl">
            <HiOutlineSparkles className="text-6xl text-slate-700 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
            Quiet on the front
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] max-w-[250px] leading-relaxed">
            No new interaction requests at the moment.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/home'}
          className="mt-10 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] transition-all"
        >
          Explore More Profiles
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-6xl animate-in fade-in slide-in-from-right-8 duration-1000">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-indigo-500/20 rounded-2xl">
          <HiOutlineSparkles className="text-2xl text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Interactions</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Review who liked you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.map((user) => (
          <div
            key={user._id || user.id}
            className="group relative flex items-center bg-[#0a0a0f] border border-white/5 rounded-[3.5rem] p-4 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl overflow-hidden"
          >
            <div className="relative flex-none w-48 h-48 overflow-hidden rounded-[2.5rem] ml-2">
              <img src={user.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={user.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <div className="flex-1 px-12">
              <div className="flex items-end gap-3 mb-6">
                <h3 className="text-5xl font-black text-white tracking-tighter">{user.name}</h3>
                <span className="text-2xl font-light text-slate-600 mb-1">{user.age}</span>
              </div>
              <p className="text-slate-500 italic text-sm">"{user.bio}"</p>
            </div>
            <div className="flex-none pr-8 pl-12 border-l border-white/5 flex gap-4 items-center">
              <button
                onClick={() => handleReject(user._id)}
                className="p-5 rounded-full bg-white/5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300"
              >
                <HiOutlineXMark className="text-2xl" />
              </button>
              <button
                onClick={() => handleLikeBack(user._id)}
                className="group/btn relative flex items-center justify-center gap-3 bg-white text-black hover:bg-indigo-500 hover:text-white px-10 py-5 rounded-[2rem] transition-all duration-300 shadow-lg"
              >
                <HiOutlineHeart className="text-xl" />
                <span className="text-xs font-black uppercase tracking-widest">Like Back</span>
                <HiOutlineChevronRight className="text-lg group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
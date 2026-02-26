// src/pages/PendingThem.jsx
import { HiOutlineClock, HiOutlinePaperAirplane } from "react-icons/hi2";

export default function PendingThem({ data }) {
  if (!data) return null;

  return (
    <div className="max-w-6xl animate-in fade-in slide-in-from-right-8 duration-1000">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <HiOutlinePaperAirplane className="text-2xl text-indigo-400 -rotate-12" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Pending</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Waiting for their response</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.map((user) => (
          <div
            key={user._id}
            className="group relative flex items-center bg-[#0a0a0f] border border-white/5 rounded-[3.5rem] p-4 hover:border-white/20 transition-all duration-500 shadow-xl"
          >
            <div className="relative flex-none w-40 h-40 overflow-hidden rounded-[2.5rem] ml-2">
              <img
                src={user.avatar}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                alt={user.name}
              />
            </div>

            <div className="flex-1 px-12">
              <div className="flex items-end gap-3 mb-4">
                <h3 className="text-4xl font-black text-white tracking-tighter">
                  {user.name}
                </h3>
                <span className="text-xl font-light text-slate-500 mb-1">
                  {user.age}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <HiOutlineClock className="text-indigo-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Invitation sent — Awaiting reply
                </span>
              </div>
            </div>

            <div className="flex-none pr-12 pl-12 border-l border-white/5 flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1 mb-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">In Review</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
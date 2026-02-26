import { HiOutlineMapPin, HiOutlineClock, HiOutlineChevronRight, HiOutlineCalendarDays } from "react-icons/hi2";

export default function UpcomingDates({ data }) {
  return (
    <div className="max-w-6xl animate-in fade-in slide-in-from-right-8 duration-1000 ml-6 pb-20">
      
      {/* Header phụ đồng bộ với Action & Pending */}
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <HiOutlineCalendarDays className="text-2xl text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Upcoming</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Confirmed Schedule</p>
        </div>
      </div>

      <div className="relative">
        {/* Trục Timeline nét đứt */}
        <div className="absolute left-[21px] top-0 bottom-0 w-[1px] border-l border-dashed border-white/20"></div>

        <div className="space-y-8">
          {data.map((item) => (
            <div key={item.id} className="relative flex items-center group">
              
              {/* Điểm nút Timeline */}
              <div className="absolute left-[16px] w-3 h-3 bg-indigo-500 rounded-full z-10 shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
              
              {/* Cột hiển thị Ngày/Tháng */}
              <div className="w-32 flex-none pl-12">
                <div className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">
                  {item.fullDate.split(' ')[0]} {item.fullDate.split(' ')[1]}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {item.fullDate.split(' ')[2]}
                </div>
              </div>

              {/* Thẻ chính - Pill Shape */}
              <div className="flex-1 ml-6 bg-[#0a0a0f] border border-white/5 rounded-[3rem] p-3 flex items-center hover:border-indigo-500/30 hover:bg-[#11111a] transition-all duration-500 shadow-2xl">
                
                {/* Ảnh đại diện (Full Color) */}
                <div className="w-28 h-28 flex-none overflow-hidden rounded-[2.5rem]">
                  <img 
                    src={item.avatar} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={item.name} 
                  />
                </div>

                {/* Thông tin chi tiết */}
                <div className="flex-1 px-8 flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-black text-white">{item.name}</h3>
                      <div className="flex items-center gap-1.5 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        <HiOutlineClock className="text-indigo-400 text-sm" />
                        <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{item.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                      <HiOutlineMapPin className="text-indigo-500 text-lg" />
                      {item.location}
                    </div>
                  </div>

                  {/* Badge Trạng thái & Nút Action */}
                  <div className="flex items-center gap-6">
                    <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Confirmed</span>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-lg">
                      <HiOutlineChevronRight className="text-xl font-bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
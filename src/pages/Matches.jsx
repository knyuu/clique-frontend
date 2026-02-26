import { useState, useEffect } from "react";
import { HiOutlineCalendar, HiOutlineSparkles, HiOutlineArrowPath } from "react-icons/hi2";
import api from "../utils/axios";
import UpcomingDates from "./UpcomingDates";
import ActionRequired from "./ActionRequired";
import PendingThem from "./PendingThem";

export default function Matches() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      let endpoint = "";
      if (tab === "upcoming") endpoint = "/matches/my-dates";
      if (tab === "action") endpoint = "/matches/action-required";
      if (tab === "pending") endpoint = "/matches/pending";

      const res = await api.get(endpoint);
      setData(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu match:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const menuItems = [
    { id: "upcoming", label: "Upcoming", icon: <HiOutlineCalendar /> },
    { id: "action", label: "Action Required", icon: <HiOutlineSparkles /> },
    { id: "pending", label: "Pending", icon: <HiOutlineArrowPath /> },
  ];

  return (
    <div className="h-full flex bg-[#020205]">
      {/* SIDEBAR (LEFT) */}
      <aside className="w-80 border-r border-white/5 flex flex-col p-10">
        <div className="mb-16">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Matches</h2>
          <p className="text-slate-600 text-[10px] font-black tracking-widest uppercase mt-2">Management</p>
        </div>
        <nav className="flex-1 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all duration-300 ${activeTab === item.id
                  ? "bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)]"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="pt-10 border-t border-white/5 text-[9px] font-bold text-slate-800 tracking-[0.3em] uppercase">
          Private Dashboard v1.0
        </div>
      </aside>
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-20 bg-gradient-to-br from-indigo-950/5 to-transparent">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "upcoming" && <UpcomingDates data={data} />}
            {activeTab === "action" && <ActionRequired data={data} />}
            {activeTab === "pending" && <PendingThem data={data} />}
          </>
        )}
      </main>
    </div>
  );
}
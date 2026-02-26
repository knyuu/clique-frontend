import { useState, useEffect } from "react";
import api from "../utils/axios";
import UserCard from "../components/UserCard";
import UserDetailPopup from "../components/UserDetailPopup";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/home");
        setUsers(res.data);
      } catch (err) {
        console.error("Lỗi kết nối Backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleLike = async (userId) => {
    try {
      const res = await api.post(`/matches/toggle-like`, { toUserId: userId });

      const { isLiked, isMatch, matchId } = res.data;

      setUsers(prev => prev.map(u =>
        u._id === userId ? { ...u, isLiked: isLiked } : u
      ));

      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({ ...prev, isLiked: isLiked }));
      }

      if (isMatch) {
        alert("Tuyệt vời! Hai bạn đã Match. Hãy chọn lịch rảnh để gặp nhau!");
      }

    } catch (err) {
      console.error("Lỗi khi xử lý Like:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center">
      <div className="animate-pulse text-indigo-500 font-bold tracking-widest">ĐANG TÌM KIẾM "ĐỊNH MỆNH"...</div>
    </div>
  );

  return (
    <div className="py-12 px-8 bg-[#020205] min-h-screen animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[1300px] mx-auto">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onLike={handleToggleLike}
            onOpenPopup={(u) => {
              setSelectedUser(u);
              setIsPopupOpen(true);
            }}
          />
        ))}
      </div>
      {isPopupOpen && selectedUser && (
        <UserDetailPopup
          user={selectedUser}
          onClose={() => setIsPopupOpen(false)}
          onLike={handleToggleLike} // Đã khớp tên hàm
        />
      )}
    </div>
  );
}
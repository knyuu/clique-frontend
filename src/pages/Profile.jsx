import { useState } from "react";
import { 
  HiOutlinePencilSquare, HiOutlineCheck, HiOutlineCamera, 
  HiOutlineShieldCheck, HiOutlineUser, HiOutlineMapPin,
  HiOutlineHeart, HiOutlineEnvelope, HiOutlineCake
} from "react-icons/hi2";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Alex Nguyen",
    email: "alex.nguyen@clique.com",
    age: 24,
    gender: "Male",
    genderPreference: "Both",
    city: "Vung Tau City",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
    bio: "Deep tech enthusiast and minimalist designer. Looking for someone who values authenticity over trends.",
    isActivated: true
  });

  const ProfileRow = ({ icon: Icon, label, value, field, isEditable = true, type = "text" }) => (
    <div className="group flex items-center py-6 border-b border-white/5 last:border-0">
      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mr-6 group-hover:bg-indigo-500/10 transition-colors">
        <Icon className="text-xl text-slate-500 group-hover:text-indigo-400" />
      </div>
      <div className="flex-1">
        <span className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{label}</span>
        {isEditing && isEditable ? (
          field === "bio" ? (
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500 mt-2"
              value={user[field]} onChange={(e) => setUser({...user, [field]: e.target.value})}
            />
          ) : field === "genderPreference" || field === "gender" ? (
            <select 
              className="bg-transparent text-white font-bold outline-none border-b border-indigo-500 pb-1"
              value={user[field]} onChange={(e) => setUser({...user, [field]: e.target.value})}
            >
              {field === "gender" ? (
                ['Male', 'Female', 'Other'].map(g => <option key={g} value={g}>{g}</option>)
              ) : (
                ['Male', 'Female', 'Both'].map(p => <option key={p} value={p}>{p}</option>)
              )}
            </select>
          ) : (
            <input 
              type={type} className="bg-transparent text-white font-bold outline-none border-b border-indigo-500 pb-1 w-full"
              value={user[field]} onChange={(e) => setUser({...user, [field]: e.target.value})}
            />
          )
        ) : (
          <p className={`text-sm font-bold ${isEditable ? 'text-white' : 'text-slate-500 italic'}`}>
            {field === "isActivated" ? (user[field] ? "Verified Account" : "Unverified") : value}
          </p>
        )}
      </div>
      {!isEditing && isEditable && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 lg:p-20 flex justify-center animate-in fade-in duration-1000">
      <div className="max-w-4xl w-full">
        
        {/* Header Profile */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-white/5 shadow-2xl">
              <img src={user.avatar} className="w-full h-full object-cover shadow-2xl" alt="Avatar" />
            </div>
            {isEditing && (
              <button className="absolute inset-0 bg-black/60 rounded-[2.5rem] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <HiOutlineCamera className="text-xl text-white" />
              </button>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter mb-2">{user.name}</h1>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Member Since 2024</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${
              isEditing ? "bg-indigo-600 text-white" : "bg-white text-black hover:bg-indigo-500 hover:text-white"
            }`}
          >
            {isEditing ? <div className="flex items-center gap-2"><HiOutlineCheck /> Save Changes</div> : <div className="flex items-center gap-2"><HiOutlinePencilSquare /> Edit Identity</div>}
          </button>
        </div>

        {/* Data Rows Container */}
        <div className="bg-[#0a0a0f] border border-white/5 rounded-[3rem] px-10 py-4 shadow-2xl">
          <ProfileRow icon={HiOutlineUser} label="Full Name" value={user.name} field="name" />
          <ProfileRow icon={HiOutlineEnvelope} label="Email Address" value={user.email} field="email" isEditable={false} />
          <ProfileRow icon={HiOutlineCake} label="Age" value={`${user.age} Years Old`} field="age" type="number" />
          <ProfileRow icon={HiOutlineUser} label="Gender" value={user.gender} field="gender" />
          <ProfileRow icon={HiOutlineHeart} label="Interested In" value={user.genderPreference} field="genderPreference" />
          <ProfileRow icon={HiOutlineMapPin} label="Current City" value={user.city} field="city" />
          <ProfileRow icon={HiOutlineShieldCheck} label="Account Status" field="isActivated" isEditable={false} />
          <ProfileRow icon={HiOutlinePencilSquare} label="Short Biography" value={user.bio} field="bio" />
        </div>

        <p className="text-center mt-12 text-[9px] font-medium text-slate-700 uppercase tracking-[0.5em]">
          Clique Identity Protection • Secured by Mongoose
        </p>
      </div>
    </div>
  );
}
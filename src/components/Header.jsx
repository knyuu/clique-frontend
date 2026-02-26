import { Link, useLocation } from "react-router-dom";
import { HiOutlineSparkles, HiOutlineMagnifyingGlass, HiOutlineUserCircle, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

export default function Header() {
    const location = useLocation();

    const navItems = [
        { name: "HOME", path: "/home" },
        { name: "MATCHES", path: "/matches" }
    ];

    return (
        <header className="flex-none px-12 py-6 flex justify-between items-center border-b border-white/5 bg-[#020205] z-50">
            <Link 
                to="/home" 
                className="flex items-center gap-2 w-1/4 group cursor-pointer"
            >
                <h1 className="text-xl font-black tracking-tighter uppercase italic text-white group-hover:text-indigo-400 transition-colors duration-300">
                    Clique
                </h1>
            </Link>

            <nav className="flex gap-12 items-center justify-center w-2/4">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`relative text-[10px] font-black tracking-[0.3em] transition-all duration-300 ${
                            location.pathname === item.path ? "text-indigo-500" : "text-slate-500 hover:text-white"
                        }`}
                    >
                        {item.name}
                        {location.pathname === item.path && (
                            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></span>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center justify-end gap-6 w-1/4">
                <HiOutlineMagnifyingGlass className="text-xl text-slate-500 hover:text-white cursor-pointer" />
                <HiOutlineAdjustmentsHorizontal className="text-xl text-slate-500 hover:text-white cursor-pointer" />
                <Link to="/profile">
                    <HiOutlineUserCircle
                        className={`text-2xl transition-all duration-300 ${
                            location.pathname === "/profile" ? "text-indigo-500" : "text-slate-500 hover:text-white"
                        }`}
                    />
                </Link>
            </div>
        </header>
    );
}
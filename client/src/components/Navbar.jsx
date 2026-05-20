import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../api/client';

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  // 🔥 Sync login state with token (important for refresh)
  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  // 🔥 Logout function
  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 md:px-16 flex items-center justify-between bg-[#050505]/80 backdrop-blur-md border-b border-white/5 transition-all">
      
      {/* LEFT: LOGO */}
      <div className="flex-shrink-0 relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="Skill Bridge Logo" 
            className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="text-white font-extrabold tracking-widest text-lg hidden sm:block">
            SKILL<span className="text-[#00c3ff]">BRIDGE</span>
          </span>
        </Link>
      </div>

      {/* CENTER: NAV LINKS */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-10 z-10">
        <Link to="/" className="text-gray-300 text-sm hover:text-white">Home</Link>
        <Link to="/explore" className="text-gray-300 text-sm hover:text-white">Explore</Link>
        <Link to="/about" className="text-gray-300 text-sm hover:text-white">About</Link>
        <Link to="/contact" className="text-gray-300 text-sm hover:text-white">Contact</Link>
      </div>

      {/* RIGHT: AUTH */}
      <div className="flex-shrink-0 relative z-10 flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-white font-bold text-sm hover:text-[#00c3ff]">
              Dashboard
            </Link>

            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 font-bold text-white text-xs uppercase tracking-wider bg-[#111] border border-gray-700 rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login"
            className="group relative inline-flex items-center justify-center px-8 py-2.5 font-bold text-white bg-[#0a0a0a] border border-gray-700 rounded-full hover:border-[#00c3ff]"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

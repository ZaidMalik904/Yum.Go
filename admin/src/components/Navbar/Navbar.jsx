import React, { useState, useRef, useEffect } from 'react'
import { assets } from '../../assets/assets'
import {
  Settings, User, LogOut, ChevronDown,
  Menu, X, LayoutDashboard, Package,
  PlusCircle, ListOrdered, Store,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = ({ url, adminData, setToken, setAdminData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false)
    }
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', close)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', close)
    }
  }, [])

  const logout = () => {
    setToken("")
    setAdminData(null)
    localStorage.removeItem("token")
    localStorage.removeItem("adminData")
    navigate("/")
  }

  const mobileLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/orders', label: 'Live Orders', icon: Package },
    { to: '/add', label: 'Add New Item', icon: PlusCircle },
    { to: '/list', label: 'Menu Catalog', icon: ListOrdered },
    { to: '/restaurants', label: 'Vendor Mgmt', icon: Store },
  ]

  return (
    <header className={`sticky top-0 z-[9999] w-full border-b border-slate-100 flex flex-col transition-all duration-300 ease-in-out ${scrolled ? 'bg-white/98 shadow-premium backdrop-blur-[20px]' : 'bg-white'}`}>
      <div className="w-full h-[70px] flex items-center justify-between px-10 md:px-5">

        {/* ════ LEFT: Logo ════ */}
        <NavLink to="/dashboard" className="flex items-center gap-3 no-underline group">
          <div className="w-11 h-11 bg-gradient-to-br from-[#ff6347] to-[#ff4500] rounded-[14px] flex items-center justify-center shadow-[0_8px_20px_rgba(255,99,71,0.3)] shrink-0 transition-transform group-hover:scale-105">
            <img src={assets.logo} alt="logo" className="w-7 h-7 object-contain block border-0" />
          </div>
          <div className="flex flex-col leading-[1.1]">
            <span className="text-xl font-black text-slate-900 tracking-[-0.8px]">
              YumGo<span className="text-primary">.</span>
            </span>
            <span className="text-[9px] font-extrabold text-slate-400 tracking-[2px] uppercase">
              Admin Panel
            </span>
          </div>
        </NavLink>

        {/* ════ RIGHT: Actions ════ */}
        <div className="flex items-center gap-2.5">

          <div className="hidden sm:block w-[1px] h-7 bg-slate-100 mx-2" />

          {/* ── Profile Container ── */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(v => !v)}
              className={`flex items-center gap-2.5 p-1 sm:px-3.5 sm:py-1.5 rounded-[18px] bg-white cursor-pointer transition-all duration-250 border-2 ${showProfile ? 'border-primary shadow-[0_8px_25px_rgba(255,99,71,0.15)]' : 'border-slate-100 hover:border-slate-200 shadow-none'}`}
            >
              <div className="relative shrink-0">
                {adminData?.image ? (
                  <img
                    src={`${url}/images/${adminData.image}`}
                    alt="admin"
                    className="w-[38px] h-[38px] rounded-[14px] object-cover block"
                  />
                ) : (
                  <div className="w-[38px] h-[38px] rounded-[14px] bg-slate-100 flex items-center justify-center">
                    <User size={20} className="text-slate-400" />
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="hidden sm:block text-left leading-[1.1]">
                <p className="text-[13px] font-black text-slate-900 m-0">
                  {adminData?.name?.split(" ")[0]}
                </p>
                <p className="text-[9px] font-extrabold text-slate-400 tracking-[1.5px] uppercase mt-1">
                  {adminData?.role || "Global Admin"}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`hidden sm:block text-slate-400 transition-transform duration-300 ${showProfile ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>

            {showProfile && (
              <div className="absolute top-[calc(100%+14px)] right-0 w-[260px] sm:w-[300px] bg-white rounded-[28px] border border-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.12)] p-2.5 z-[10000] animate-fadeInDown">
                <div className="flex items-center gap-3.5 p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-[20px] mb-2">
                  {adminData?.image ? (
                    <img
                      src={`${url}/images/${adminData.image}`}
                      alt="admin"
                      className="w-[52px] h-[52px] rounded-2xl object-cover border-[2.5px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
                    />
                  ) : (
                    <div className="w-[52px] h-[52px] rounded-2xl bg-slate-100 flex items-center justify-center border-[2.5px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
                      <User size={28} className="text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[15px] font-black text-slate-900 m-0 truncate">{adminData?.name}</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5 mb-2 truncate">{adminData?.email}</p>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Verified
                    </span>
                  </div>
                </div>

                {[
                  { to: '/profile', label: 'My Identity', icon: User },
                  { to: '/settings', label: 'Preferences', icon: Settings },
                ].map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} onClick={() => setShowProfile(false)} className="no-underline">
                    <button className="w-full flex items-center gap-3.5 px-4.5 py-3.25 border-none bg-transparent rounded-2xl cursor-pointer text-sm font-bold text-slate-600 transition-all duration-200 text-left hover:bg-slate-50 hover:text-primary">
                      <Icon size={18} className="opacity-70" />
                      {label}
                    </button>
                  </NavLink>
                ))}

                <div className="border-t-[1.5px] border-slate-100 mx-2.5 my-2" />

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3.5 px-4.5 py-3.25 border-none bg-transparent rounded-2xl cursor-pointer text-sm font-extrabold text-red-500 transition-all duration-200 text-left hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Secure Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(v => !v)}
            className="w-11 h-11 border-2 border-slate-100 rounded-[14px] bg-white cursor-pointer lg:hidden flex items-center justify-center text-slate-900 transition-all duration-200 hover:border-slate-200"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Side Navigation ── */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white p-4 border-b-2 border-slate-100 flex flex-col gap-2 z-[999] animate-slideDown">
          {mobileLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-4 rounded-2xl no-underline font-extrabold text-sm transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                ${isActive ? 'bg-primary text-white shadow-[0_10px_20px_rgba(255,99,71,0.25)]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
              `}
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
          <div className="px-2 mt-3">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-4 px-5 py-4 rounded-2xl border-none bg-red-50 text-red-500 font-black text-sm cursor-pointer hover:bg-red-100"
            >
              <LogOut size={22} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar

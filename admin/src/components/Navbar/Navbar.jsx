import React, { useState, useRef, useEffect } from 'react'
import { assets } from '../../assets/assets'
import {
  Bell, Settings, User, LogOut, ChevronDown,
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
    <header className={`admin-navbar ${scrolled ? 'shadow-premium' : ''}`} style={{
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#fff'
    }}>
      <div className="navbar-container">

        {/* ════ LEFT: Logo ════ */}
        <NavLink
          to="/dashboard"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
        >
          <div
            style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #ff6347 0%, #ff4500 100%)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(255,99,71,0.3)',
              flexShrink: 0,
            }}
          >
            <img src={assets.logo} alt="logo" style={{ width: 28, height: 28, objectFit: 'contain', border: 0, display: 'block' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px' }}>
              YumGo<span style={{ color: '#ff6347' }}>.</span>
            </span>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase' }}>
              Admin Panel
            </span>
          </div>
        </NavLink>

        {/* ════ RIGHT: Actions ════ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Large Screen Only Buttons */}
          <div className="desktop-only" style={{ display: window.innerWidth < 640 ? 'none' : 'flex', gap: 6 }}>
            <button
              style={{
                position: 'relative', width: 44, height: 44, border: 'none', background: 'transparent',
                cursor: 'pointer', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#64748b', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#ff6347' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
            >
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: 12, right: 12, width: 8, height: 8,
                background: '#ff6347', borderRadius: '50%', border: '2px solid white',
              }} />
            </button>
          </div>

          <div className="desktop-only" style={{ width: 1, height: 28, background: '#f1f5f9', margin: '0 8px', display: window.innerWidth < 640 ? 'none' : 'block' }} />

          {/* ── Profile Container ── */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              onClick={() => setShowProfile(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: window.innerWidth < 640 ? '4px' : '6px 14px 6px 6px',
                border: showProfile ? '2px solid #ff6347' : '2px solid #f1f5f9',
                borderRadius: 18, background: '#ffffff', cursor: 'pointer',
                transition: 'all 0.25s', boxShadow: showProfile ? '0 8px 25px rgba(255,99,71,0.15)' : 'none',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {adminData?.image ? (
                  <img
                    src={`${url}/images/${adminData.image}`}
                    alt="admin"
                    style={{ width: 38, height: 38, borderRadius: 14, objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: 38, height: 38, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} style={{ color: '#94a3b8' }} />
                  </div>
                )}
                <span style={{
                  position: 'absolute', bottom: -2, right: -2, width: 12, height: 12,
                  background: '#22c55e', borderRadius: '50%', border: '2px solid white',
                }} />
              </div>
              <div className="desktop-only" style={{ textAlign: 'left', lineHeight: 1.1, display: window.innerWidth < 640 ? 'none' : 'block' }}>
                <p style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  {adminData?.name?.split(" ")[0]}
                </p>
                <p style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', margin: '3px 0 0' }}>
                  {adminData?.role || "Global Admin"}
                </p>
              </div>
              <ChevronDown
                size={16}
                className="desktop-only"
                style={{ color: '#94a3b8', transform: showProfile ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', display: window.innerWidth < 640 ? 'none' : 'block' }}
              />
            </button>

            {showProfile && (
              <div
                className="animate-fadeInDown"
                style={{
                  position: 'absolute', top: 'calc(100% + 14px)', right: 0,
                  width: window.innerWidth < 480 ? 260 : 300, background: '#ffffff', borderRadius: 28,
                  border: '1px solid #f1f5f9', boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
                  padding: 10, zIndex: 10000,
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '16px',
                  background: 'linear-gradient(135deg, rgba(255,99,71,0.06) 0%, rgba(255,99,71,0) 100%)',
                  borderRadius: 20, marginBottom: 8,
                }}>
                  {adminData?.image ? (
                    <img
                      src={`${url}/images/${adminData.image}`}
                      alt="admin"
                      style={{ width: 52, height: 52, borderRadius: 16, objectFit: 'cover', border: '2.5px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                    />
                  ) : (
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
                      <User size={28} style={{ color: '#94a3b8' }} />
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminData?.name}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, margin: '2px 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminData?.email}</p>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 10, fontWeight: 900, color: '#16a34a',
                      background: '#f0fdf4', padding: '4px 10px', borderRadius: 20,
                      textTransform: 'uppercase'
                    }}>
                      <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%' }} />
                      Verified
                    </span>
                  </div>
                </div>

                {[
                  { to: '/profile', label: 'My Identity', icon: User },
                  { to: '/settings', label: 'Preferences', icon: Settings },
                ].map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} onClick={() => setShowProfile(false)} style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                        padding: '13px 18px', border: 'none', background: 'transparent',
                        borderRadius: 16, cursor: 'pointer',
                        fontSize: 14, fontWeight: 700, color: '#475569',
                        transition: 'all 0.2s', textAlign: 'left',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#ff6347' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569' }}
                    >
                      <Icon size={18} style={{ opacity: 0.7 }} />
                      {label}
                    </button>
                  </NavLink>
                ))}

                <div style={{ borderTop: '1.5px solid #f1f5f9', margin: '8px 10px' }} />

                <button
                  onClick={logout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 18px', border: 'none', background: 'transparent',
                    borderRadius: 16, cursor: 'pointer',
                    fontSize: 14, fontWeight: 800, color: '#ef4444',
                    transition: 'all 0.2s', textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={18} />
                  Secure Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(v => !v)}
            style={{
              width: 44, height: 44, border: '2px solid #f1f5f9',
              borderRadius: 14, background: '#fff', cursor: 'pointer',
              display: window.innerWidth < 1024 ? 'flex' : 'none',
              alignItems: 'center', justifyContent: 'center', color: '#0f172a',
              transition: 'all 0.2s'
            }}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Side Navigation ── */}
      {isMenuOpen && (
        <div
          className="animate-slideDown"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: '#ffffff', padding: '16px', borderBottom: '2px solid #f1f5f9',
            display: 'flex', flexDirection: 'column', gap: 8, zIndex: 999
          }}
        >
          {mobileLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to} to={to} onClick={() => setIsMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px', borderRadius: 16, textDecoration: 'none',
                fontWeight: 800, fontSize: 14,
                background: isActive ? '#ff6347' : '#f8fafc',
                color: isActive ? '#ffffff' : '#64748b',
                boxShadow: isActive ? '0 10px 20px rgba(255,99,71,0.25)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              })}
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
          <div style={{ padding: '0 8px', marginTop: 12 }}>
            <button
              onClick={logout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifySelf: 'center', gap: 16,
                padding: '16px 20px', borderRadius: 16, border: 'none',
                background: '#fef2f2', color: '#ef4444', fontWeight: 900, fontSize: 14,
                cursor: 'pointer'
              }}
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

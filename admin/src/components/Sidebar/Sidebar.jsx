import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusCircle, ListOrdered,
  Store, Users, Settings, LifeBuoy, User, ChevronRight
} from 'lucide-react'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/orders', label: 'Live Orders', icon: Package },
  { to: '/add', label: 'Add New Item', icon: PlusCircle },
  { to: '/list', label: 'Menu Catalog', icon: ListOrdered },
  { to: '/add-restaurant', label: 'Add Restaurant', icon: PlusCircle },
  { to: '/restaurants', label: 'Manage Vendors', icon: Store },
  { to: '/users', label: 'Identity DB', icon: Users },
]

const BOTTOM_LINKS = [
  {
    to: '/profile',
    label: 'My Profile',
    icon: User,
    desc: 'Account settings',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    activeBg: 'bg-violet-50',
    activeBorder: 'border-violet-200',
    activeText: 'text-violet-700',
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
    desc: 'App configuration',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    activeBg: 'bg-slate-900',
    activeBorder: 'border-slate-900',
    activeText: 'text-white',
  },
  {
    to: '/support',
    label: 'Help Center',
    icon: LifeBuoy,
    desc: 'Support tickets',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-500',
    activeBg: 'bg-sky-50',
    activeBorder: 'border-sky-200',
    activeText: 'text-sky-700',
  },
]

const Sidebar = () => {
  return (
    <aside className="w-[280px] min-h-screen bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-[70px] h-[calc(100vh-70px)] z-40 transition-all duration-300">
      <div className="flex-1 py-8 px-6 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">

        <div className="mb-4 px-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Main Navigation</p>
        </div>

        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-[14px] transition-all duration-300 group
              ${isActive
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <div className="p-2 rounded-xl transition-all duration-300 group-[.active]:bg-white group-[.active]:shadow-sm group-[.active]:text-primary">
              <Icon size={20} strokeWidth={2.5} />
            </div>
            <span className="tracking-tight">{label}</span>
            <div className="ml-auto opacity-0 group-[.active]:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,99,71,0.5)]"></div>
            </div>
          </NavLink>
        ))}

        {/* ── Divider ── */}
        <div className="my-6 px-1">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* ── Systems & Support Label ── */}
        <div className="px-4 mb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Systems & Support</p>
        </div>

        {/* ── Bottom Links ── */}
        <div className="flex flex-col gap-2">
          {BOTTOM_LINKS.map(({ to, label, icon: Icon, desc, iconBg, iconColor, activeBg, activeBorder, activeText }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border-2 transition-all duration-300 ${isActive
                  ? `${activeBg} ${activeBorder} ${activeText} shadow-md`
                  : 'border-transparent hover:border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon Box */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? 'bg-white/60 shadow-sm' : iconBg
                    }`}>
                    <Icon size={17} strokeWidth={2.5} className={isActive ? activeText : iconColor} />
                  </div>

                  {/* Label + Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black leading-none tracking-tight">{label}</p>
                    <p className={`text-[10px] font-semibold mt-0.5 leading-none truncate transition-colors ${isActive ? 'opacity-60' : 'text-slate-400'
                      }`}>{desc}</p>
                  </div>

                  {/* Chevron */}
                  <ChevronRight
                    size={14}
                    className={`shrink-0 transition-all duration-300 ${isActive ? 'opacity-60' : 'text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5'
                      }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

      </div>

      {/* Version Info */}
      <div className="p-6 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v2.4.0 • Enterprise</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

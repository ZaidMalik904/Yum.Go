import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, PlusCircle, ListOrdered,
  Store, Users, Settings, LifeBuoy, User
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
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/support', label: 'Help Center', icon: LifeBuoy },
]

const Sidebar = () => {
  return (
    <aside className='sidebar'>
      <div className='sidebar-options'>
        {NAV_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-option ${isActive ? 'active' : ''}`
            }
          >
            <div className='indicator'></div>
            <div className='icon-wrap'>
              <Icon />
            </div>
            <p>{label}</p>
          </NavLink>
        ))}

        <hr className='sidebar-separator' />

        <div className='sidebar-bottom'>
          {BOTTOM_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-bottom-option ${isActive ? 'active' : ''}`
              }
            >
              <div className='indicator'></div>
              <Icon />
              <p>{label}</p>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

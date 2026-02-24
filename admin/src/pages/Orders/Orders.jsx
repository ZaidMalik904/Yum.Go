import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import {
  Package, MapPin, Phone, User, ShoppingBag, RefreshCw,
  Clock, Truck, CheckCircle2, ChevronDown, Flame,
  AlertCircle, CreditCard, Hash, UtensilsCrossed
} from 'lucide-react'

/* ─── Status Configuration ─── */
const STATUS_CONFIG = {
  'Food Processing': {
    label: 'In Kitchen',
    icon: Flame,
    dot: '#f97316',
    cardBorder: '#fed7aa',
    cardBg: '#fff7ed',
    badge: 'bg-orange-50 text-orange-600 border-orange-200',
    selectClass: 'text-orange-600 bg-orange-50 border-orange-200',
  },
  'Out For Delivery': {
    label: 'En Route',
    icon: Truck,
    dot: '#3b82f6',
    cardBorder: '#bfdbfe',
    cardBg: '#eff6ff',
    badge: 'bg-blue-50 text-blue-600 border-blue-200',
    selectClass: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  'Delivered': {
    label: 'Delivered',
    icon: CheckCircle2,
    dot: '#22c55e',
    cardBorder: '#bbf7d0',
    cardBg: '#f0fdf4',
    badge: 'bg-green-50 text-green-600 border-green-200',
    selectClass: 'text-green-600 bg-green-50 border-green-200',
  },
}

/* ─── Progress Step Component ─── */
const StatusStep = ({ icon: Icon, label, active, done, color }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500"
      style={{
        background: done || active ? color + '20' : '#f1f5f9',
        border: `2px solid ${done || active ? color : '#e2e8f0'}`,
      }}
    >
      <Icon size={16} style={{ color: done || active ? color : '#cbd5e1' }} />
    </div>
    <span
      className="text-[8px] font-black uppercase tracking-widest leading-none"
      style={{ color: done || active ? color : '#cbd5e1' }}
    >
      {label}
    </span>
  </div>
)

/* ─── Status Timeline ─── */
const StatusTimeline = ({ status }) => {
  const steps = [
    { key: 'Food Processing', icon: Flame, label: 'Kitchen', color: '#f97316' },
    { key: 'Out For Delivery', icon: Truck, label: 'En Route', color: '#3b82f6' },
    { key: 'Delivered', icon: CheckCircle2, label: 'Done', color: '#22c55e' },
  ]
  const currentIdx = steps.findIndex(s => s.key === status)
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <React.Fragment key={step.key}>
          <StatusStep
            icon={step.icon}
            label={step.label}
            active={currentIdx === i}
            done={currentIdx > i}
            color={step.color}
          />
          {i < steps.length - 1 && (
            <div
              className="h-0.5 w-8 mx-1 rounded-full transition-all duration-500"
              style={{
                background: currentIdx > i
                  ? `linear-gradient(to right, ${steps[i].color}, ${steps[i + 1].color})`
                  : '#e2e8f0'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

/* ─── Main Orders Component ─── */
const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState('All')

  const fetchAllOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await axios.get(`${url}/api/order/list`)
      if (res.data.success) setOrders(res.data.data)
      else toast.error('Error fetching orders')
    } catch { toast.error('Network Error') }
    finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [url])

  const statusHandler = async (orderId, status) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, { orderId, status })
      if (res.data.success) {
        await fetchAllOrders(true)
        const cfg = STATUS_CONFIG[status]
        toast.success(`Order moved to "${cfg?.label || status}"`)
      } else toast.error('Error updating status')
    } catch { toast.error('Network Error') }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [fetchAllOrders])

  /* ── Derived Stats ── */
  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'Food Processing').length,
    enRoute: orders.filter(o => o.status === 'Out For Delivery').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    revenue: orders.reduce((a, c) => a + c.amount, 0),
  }

  const displayed = filterStatus === 'All'
    ? [...orders].reverse()
    : [...orders].reverse().filter(o => o.status === filterStatus)

  /* ── Render ── */
  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto animate-fadeIn">

      {/* ══════ Page Header ══════ */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="page-header-icon">
            <ShoppingBag size={26} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Live Dispatch
              </h1>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Live</span>
              </span>
            </div>
            <p className="text-[13px] text-slate-400 font-semibold">
              Real-time logistics control for all partner orders.
            </p>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => fetchAllOrders(true)}
          disabled={refreshing}
          className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-wider hover:bg-primary transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-60 self-start lg:self-center cursor-pointer"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Syncing...' : 'Sync Orders'}
        </button>
      </div>

      {/* ══════ Stats Strip ══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: stats.total, icon: Package, color: '#6366f1', bg: '#eef2ff' },
          { label: 'In Kitchen', value: stats.processing, icon: Flame, color: '#f97316', bg: '#fff7ed' },
          { label: 'En Route', value: stats.enRoute, icon: Truck, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: '#22c55e', bg: '#f0fdf4' },
        ].map((s, i) => (
          <div
            key={i}
            onClick={() => setFilterStatus(s.label === 'Total Orders' ? 'All' : s.label === 'In Kitchen' ? 'Food Processing' : s.label === 'En Route' ? 'Out For Delivery' : 'Delivered')}
            className="bg-white rounded-[28px] border border-slate-100 shadow-premium p-6 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
            style={{
              borderColor: (filterStatus === (s.label === 'Total Orders' ? 'All' : s.label === 'In Kitchen' ? 'Food Processing' : s.label === 'En Route' ? 'Out For Delivery' : 'Delivered')) ? s.color + '60' : undefined,
            }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: s.bg }}>
              <s.icon size={22} style={{ color: s.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{s.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══════ Order Cards ══════ */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 gap-5">
          <div className="spinner" />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">
            Hydrating data stream...
          </p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="bg-white p-24 rounded-[40px] border border-slate-100 shadow-premium text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
            <AlertCircle size={36} className="text-slate-200" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">No Orders Found</h2>
            <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto mt-2">
              {filterStatus === 'All' ? 'Orders will appear here as customers place them.' : `No orders with status "${STATUS_CONFIG[filterStatus]?.label}".`}
            </p>
          </div>
          {filterStatus !== 'All' && (
            <button onClick={() => setFilterStatus('All')} className="text-primary text-xs font-black uppercase tracking-widest hover:underline cursor-pointer">
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {displayed.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Food Processing']
            const StatusIcon = cfg.icon

            return (
              <div
                key={i}
                className="bg-white rounded-[36px] border-2 shadow-premium overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeIn"
                style={{
                  borderColor: cfg.cardBorder,
                  animationDelay: `${i * 0.06}s`
                }}
              >
                {/* Card Top Strip */}
                <div
                  className="px-8 py-4 flex flex-wrap gap-4 items-center justify-between border-b"
                  style={{ background: cfg.cardBg, borderColor: cfg.cardBorder }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: cfg.dot + '20', border: `2px solid ${cfg.dot}` }}
                    >
                      <StatusIcon size={16} style={{ color: cfg.dot }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Order Status</p>
                      <p className="text-[13px] font-black" style={{ color: cfg.dot }}>{cfg.label}</p>
                    </div>
                  </div>

                  {/* Order ID */}
                  <div className="flex items-center gap-2">
                    <Hash size={13} className="text-slate-300" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2.5">
                    <CreditCard size={16} className="text-slate-400" />
                    <span className="text-xl font-black text-slate-900 tracking-tighter">
                      ${order.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-7 md:p-10 flex flex-col lg:flex-row gap-8 lg:items-center">

                  {/* Parcel Icon */}
                  <div
                    className="w-24 h-24 rounded-[28px] flex items-center justify-center shrink-0 relative transition-all duration-300"
                    style={{ background: cfg.cardBg, border: `2px solid ${cfg.cardBorder}` }}
                  >
                    <img src={assets.parcel_icon} alt="parcel" className="w-14 h-14 object-contain" />
                    <div
                      className="absolute -top-3 -right-3 w-9 h-9 rounded-[14px] flex items-center justify-center font-black text-sm text-white shadow-lg"
                      style={{ background: cfg.dot }}
                    >
                      {order.items.length}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    {/* Customer */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <User size={13} style={{ color: cfg.dot }} />
                      <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: cfg.dot }}>
                        Customer
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-5">
                      {order.address.firstName} {order.address.lastName}
                    </h3>

                    {/* Items */}
                    <div className="flex items-center gap-2 mb-3">
                      <UtensilsCrossed size={13} className="text-slate-400" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Items Ordered</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-7">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-4 py-2 rounded-[12px] border text-[11px] font-black text-slate-600 bg-white shadow-sm transition-colors hover:border-slate-200"
                          style={{ borderColor: cfg.cardBorder }}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot }} />
                          {item.name}
                          <span className="font-black" style={{ color: cfg.dot }}>×{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Address & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-slate-50">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <MapPin size={16} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Delivery Address</p>
                          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                            {order.address.street}<br />
                            {order.address.city}, {order.address.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <Phone size={16} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Contact</p>
                          <p className="text-sm font-black text-slate-700 tracking-tight">{order.address.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel: Timeline + Status Selector */}
                  <div className="flex flex-col items-center lg:items-end gap-6 shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">

                    {/* Timeline Progress */}
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center mb-3">Progress</p>
                      <StatusTimeline status={order.status} />
                    </div>

                    {/* Status Selector */}
                    <div className="w-full lg:w-52 relative">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center mb-2">Update Status</p>
                      <div className="relative">
                        <select
                          onChange={e => statusHandler(order._id, e.target.value)}
                          value={order.status}
                          className={`w-full px-5 py-3.5 pr-10 rounded-[18px] text-[11px] font-black uppercase tracking-widest cursor-pointer border-2 transition-all appearance-none text-center shadow-md hover:scale-[1.02] active:scale-95 ${cfg.selectClass}`}
                        >
                          <option value="Food Processing">🔥 In Kitchen</option>
                          <option value="Out For Delivery">🚚 En Route</option>
                          <option value="Delivered">✅ Delivered</option>
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                          style={{ color: cfg.dot }}
                        />
                      </div>
                    </div>

                    {/* Timestamp */}
                    {order.date && (
                      <div className="flex items-center gap-2 opacity-50">
                        <Clock size={11} className="text-slate-400" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders
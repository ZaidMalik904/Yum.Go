import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import { Package, MapPin, Phone, User, ShoppingBag } from 'lucide-react'

const STATUS_COLORS = {
  'Food Processing': { bg: '#fff7ed', color: '#ea580c' },
  'Out For Delivery': { bg: '#eff6ff', color: '#2563eb' },
  'Delivered': { bg: '#f0fdf4', color: '#16a34a' },
}

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 850)

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${url}/api/order/list`)
      if (res.data.success) setOrders(res.data.data)
      else toast.error('Error fetching orders')
    } catch { toast.error('Network Error') }
    finally { setLoading(false) }
  }

  const statusHandler = async (orderId, status) => {
    const res = await axios.post(`${url}/api/order/status`, { orderId, status })
    if (res.data.success) { await fetchAllOrders(); toast.success('Status updated') }
    else toast.error('Error updating status')
  }

  useEffect(() => {
    fetchAllOrders()
    const handleResize = () => setIsSmallScreen(window.innerWidth < 850)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="page-container">

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-icon">
          <ShoppingBag size={26} />
        </div>
        <div>
          <h1>Live Orders</h1>
          <p>Monitor incoming orders and update delivery status.</p>
        </div>
      </div>

      {/* ── Orders List ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>No active orders</h2>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>When customers place orders, they'll appear here in real-time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {orders.slice().reverse().map((order, i) => {
            const sc = STATUS_COLORS[order.status] || { bg: '#f8fafc', color: '#64748b' }
            return (
              <div
                key={i}
                className="card shadow-premium animate-fadeIn"
                style={{
                  display: 'flex', gap: isSmallScreen ? 20 : 32, padding: isSmallScreen ? 20 : 32,
                  flexDirection: isSmallScreen ? 'column' : 'row',
                  alignItems: isSmallScreen ? 'stretch' : 'center',
                  border: '1px solid #f1f5f9'
                }}
              >
                {/* Parcel icon */}
                <div style={{
                  width: isSmallScreen ? 56 : 72, height: isSmallScreen ? 56 : 72,
                  background: '#f8fafc', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, border: '1.5px solid #f1f5f9', alignSelf: isSmallScreen ? 'center' : 'auto'
                }}>
                  <img src={assets.parcel_icon} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                </div>

                {/* Order Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'flex-start', gap: 8, marginBottom: 8 }}>
                    <User size={14} style={{ color: '#ff6347' }} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#ff6347', letterSpacing: 1, textTransform: 'uppercase' }}>Recipient Info</span>
                  </div>
                  <h3 style={{ fontSize: isSmallScreen ? 20 : 22, fontWeight: 900, color: '#0f172a', marginBottom: 16, textAlign: isSmallScreen ? 'center' : 'left' }}>
                    {order.address.firstName} {order.address.lastName}
                  </h3>

                  {/* Items Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
                    {order.items.map((item, idx) => (
                      <span key={idx} style={{ background: '#fff', border: '1.5px solid #f1f5f9', borderRadius: 12, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                        {item.name} <span style={{ color: '#ff6347', fontWeight: 900, marginLeft: 4 }}>×{item.quantity}</span>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: isSmallScreen ? 12 : 32, flexWrap: 'wrap', justifyContent: isSmallScreen ? 'center' : 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <MapPin size={16} style={{ color: '#94a3b8', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600, lineHeight: 1.5, maxWidth: 300 }}>
                        {order.address.street}, {order.address.city}, {order.address.state}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Phone size={16} style={{ color: '#94a3b8' }} />
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 800 }}>{order.address.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Amount + Status */}
                <div style={{
                  display: 'flex', flexDirection: isSmallScreen ? 'row' : 'column', gap: isSmallScreen ? 12 : 20,
                  alignItems: isSmallScreen ? 'center' : 'flex-end',
                  borderTop: isSmallScreen ? '1px solid #f1f5f9' : 'none',
                  paddingTop: isSmallScreen ? 20 : 0,
                  marginTop: isSmallScreen ? 4 : 0,
                  flexShrink: 0,
                }}>
                  <div style={{ textAlign: isSmallScreen ? 'left' : 'right', flex: isSmallScreen ? 1 : 'unset' }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>Order Total</p>
                    <p style={{ fontSize: isSmallScreen ? 24 : 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>${order.amount}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: isSmallScreen ? 160 : 180 }}>
                    <select
                      onChange={e => statusHandler(order._id, e.target.value)}
                      value={order.status}
                      className="admin-input"
                      style={{
                        background: sc.bg, color: sc.color, borderColor: sc.color + '40',
                        width: '100%', padding: '12px 14px', borderRadius: 14, cursor: 'pointer',
                        fontSize: 12, fontWeight: 800, textAlign: 'center'
                      }}
                    >
                      <option value="Food Processing">Processing</option>
                      <option value="Out For Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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
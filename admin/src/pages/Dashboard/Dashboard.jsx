import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    ShoppingBag, TrendingUp, DollarSign, Store, Activity,
    ArrowUpRight, Clock, ChevronRight, Pizza, Zap, AlertCircle
} from 'lucide-react'

const STAT_CARDS = [
    { label: 'Total Revenue', icon: DollarSign, iconBg: '#f0fdf4', iconColor: '#22c55e', trend: '+12.5%', isCurrency: true, key: 'totalSales' },
    { label: 'Orders Placed', icon: ShoppingBag, iconBg: '#eff6ff', iconColor: '#3b82f6', trend: '+8.2%', isCurrency: false, key: 'totalOrders' },
    { label: 'Total Vendors', icon: Store, iconBg: '#fff0ed', iconColor: '#ff6347', trend: '+2 new', isCurrency: false, key: 'totalVendors' },
    { label: 'Active Menu', icon: Activity, iconBg: '#faf5ff', iconColor: '#a855f7', trend: '+14%', isCurrency: false, key: 'totalItems' },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Dashboard({ url }) {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        totalVendors: 0,
        totalItems: 0,
        recentOrders: [],
        monthlySales: new Array(12).fill(0),
        topCategories: {}
    })
    const [loading, setLoading] = useState(true)
    const [hoverMonth, setHoverMonth] = useState(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024)
        window.addEventListener('resize', handleResize)
        fetchStats()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const [oR, vR, iR] = await Promise.all([
                axios.get(`${url}/api/order/list`),
                axios.get(`${url}/api/restaurant/list`),
                axios.get(`${url}/api/food/list`),
            ])
            if (oR.data.success && vR.data.success && iR.data.success) {
                const orders = oR.data.data
                const foods = iR.data.foods

                const monthly = new Array(12).fill(0)
                const categoryCount = {}

                orders.forEach(o => {
                    const date = new Date(o.date)
                    const monthIdx = date.getMonth()
                    monthly[monthIdx] += o.amount

                    o.items.forEach(item => {
                        categoryCount[item.category] = (categoryCount[item.category] || 0) + item.quantity
                    })
                })

                setStats({
                    totalOrders: orders.length,
                    totalSales: orders.reduce((a, c) => a + c.amount, 0),
                    totalVendors: vR.data.data.length,
                    totalItems: foods.length,
                    recentOrders: orders.slice(-5).reverse(),
                    monthlySales: monthly,
                    topCategories: categoryCount
                })
            }
        } catch (e) {
            console.error("Dashboard Fetch Error:", e)
        } finally {
            setLoading(false)
        }
    }

    const maxVal = Math.max(...stats.monthlySales, 100)

    const S = {
        pulseDot: { width: 8, height: 8, borderRadius: '50%', background: '#22c55e', transform: 'scale(1)', animation: 'pulse 2s infinite' },
        btnSync: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: isMobile ? '10px 18px' : '12px 24px', background: 'linear-gradient(135deg, #ff6347, #ff4500)', color: '#fff', border: 'none', borderRadius: 16, fontSize: isMobile ? 12 : 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(255,99,71,0.2)' }
    }

    return (
        <div className="page-container">

            {/* --- Header Section --- */}
            <div className="page-header" style={{ justifyContent: 'space-between' }}>
                <div>
                    <h1>Market Overview</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                        <div style={S.pulseDot}></div>
                        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Analytics engine operational</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end', marginTop: isMobile ? 12 : 0 }}>
                    <div style={{ padding: '10px 16px', background: '#fff', border: '1.6px solid #e2e8f0', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Clock size={16} color="#94a3b8" />
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>
                            {isMobile ? new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) : `Today, ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                        </span>
                    </div>
                    <button style={S.btnSync} onClick={fetchStats}>
                        <TrendingUp size={16} /> {isMobile ? 'Refresh' : 'Live Sync'}
                    </button>
                </div>
            </div>

            {/* --- Stats Quick View --- */}
            <div className="responsive-stat-grid" style={{ marginBottom: 32 }}>
                {STAT_CARDS.map((card, i) => (
                    <div key={i} className="card shadow-premium animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 16, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <card.icon size={22} color={card.iconColor} />
                            </div>
                            <span style={{ padding: '6px 12px', background: '#f0fdf4', color: '#16a34a', borderRadius: 20, fontSize: 10, fontWeight: 900 }}>{card.trend}</span>
                        </div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{card.label}</p>
                        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
                            {card.isCurrency ? '$' : ''}{loading ? '...' : stats[card.key].toLocaleString()}
                        </h2>
                    </div>
                ))}
            </div>

            {/* --- Charts & Activities --- */}
            <div className="responsive-grid-2" style={{ marginBottom: 32 }}>

                {/* Revenue Analytics */}
                <div className="card shadow-premium" style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>Revenue Graph</h2>
                            <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginTop: 4 }}>Historical sales performance</p>
                        </div>
                        <div style={{ padding: '8px 14px', borderRadius: 10, background: '#f8fafc', fontSize: 11, fontWeight: 800, color: '#64748b' }}>LAST 12 MONTHS</div>
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'flex-end', gap: isMobile ? 6 : 12,
                        height: 200, paddingBottom: 28, borderBottom: '1.6px solid #f1f5f9',
                        width: '100%', overflow: 'hidden', paddingLeft: 4, paddingRight: 4
                    }}>
                        {stats.monthlySales.slice(-(isMobile ? 7 : 12)).map((val, i) => {
                            const hRatio = (val / maxVal) * 100;
                            const actualIdx = stats.monthlySales.length - (isMobile ? 7 : 12) + i;
                            return (
                                <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', minWidth: 0 }}>
                                    <div
                                        onMouseEnter={() => setHoverMonth(actualIdx)}
                                        onMouseLeave={() => setHoverMonth(null)}
                                        style={{
                                            width: '100%',
                                            height: `${Math.max(hRatio, 6)}%`,
                                            background: hoverMonth === actualIdx ? '#ff6347' : '#f1f5f9',
                                            borderRadius: '6px 6px 4px 4px',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            cursor: 'pointer',
                                            boxShadow: hoverMonth === actualIdx ? '0 8px 16px rgba(255,99,71,0.2)' : 'none'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute', bottom: -24, fontSize: 10, fontWeight: 800,
                                        color: hoverMonth === actualIdx ? '#ff6347' : '#94a3b8',
                                        transition: '0.2s'
                                    }}>
                                        {MONTHS[actualIdx]}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Recent Entries */}
                <div className="card shadow-premium">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                        <h2 style={{ fontSize: 20, fontWeight: 900 }}>Latest Activity</h2>
                        <button style={{ color: '#ff6347', background: 'none', border: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>Transactions</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {loading ? (
                            <div className="animate-pulse" style={{ height: 100, background: '#f8fafc', borderRadius: 20 }} />
                        ) : stats.recentOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <AlertCircle size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
                                <p style={{ color: '#94a3b8', fontSize: 13 }}>No recent transactions</p>
                            </div>
                        ) : stats.recentOrders.map((order, i) => (
                            <div key={i} style={{ padding: '14px 18px', background: '#f8fafc', borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1.2px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', gap: 14, alignItems: 'center', minWidth: 0 }}>
                                    <div style={{ width: 40, height: 40, background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #f1f5f9' }}>
                                        <Pizza size={18} color="#ff6347" />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.address.firstName} {order.address.lastName}</p>
                                        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{order.items.length} items • Ordered</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: 16, fontWeight: 900, color: '#16a34a' }}>${order.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* --- Category & Insights --- */}
            <div className="responsive-grid-2">
                <div className="card">
                    <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>Popular Categories</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {Object.entries(stats.topCategories).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, qty], i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, fontWeight: 800 }}>
                                    <span style={{ color: '#445163' }}>{name}</span>
                                    <span style={{ color: '#ff6347' }}>{qty} sold</span>
                                </div>
                                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${Math.min((qty / 50) * 100, 100)}%`,
                                        background: `linear-gradient(90deg, #ff6347, ${['#ff4500', '#3b82f6', '#22c55e', '#a855f7'][i % 4]})`,
                                        borderRadius: 10,
                                        transition: 'width 1s ease-out'
                                    }} />
                                </div>
                            </div>
                        ))}
                        {Object.keys(stats.topCategories).length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>No category data available</p>}
                    </div>
                </div>

                <div className="card shadow-premium" style={{ background: '#0f172a', color: '#fff', border: 'none', display: 'flex', flexDirection: 'column', padding: isMobile ? 32 : 40 }}>
                    <div style={{ width: 52, height: 52, background: 'rgba(255, 99, 71, 0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                        <Zap size={24} color="#ff6347" />
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' }}>System Integrity</h2>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32 }}>All core services are performing at peak efficiency. Real-time data sync is active via global relay servers.</p>
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { label: 'Cloud Database', val: '99.9% Uptime', color: '#22c55e' },
                            { label: 'Security Firewall', val: 'Protected', color: '#3b82f6' }
                        ].map((stat, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>{stat.label}</span>
                                <span style={{ fontSize: 11, fontWeight: 900, color: stat.color }}>{stat.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

import React, { useEffect, useState, useCallback } from 'react'
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

    const fetchStats = useCallback(async () => {
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
    }, [url])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024)
        window.addEventListener('resize', handleResize)
        fetchStats()
        return () => window.removeEventListener('resize', handleResize)
    }, [fetchStats])

    const maxVal = Math.max(...stats.monthlySales, 100)


    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fadeIn">

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="page-header-icon">
                        <Activity size={26} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Market Overview</h1>
                        <div className="flex items-center gap-2.5 mt-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="text-[13px] text-slate-400 font-semibold">Analytics engine operational</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-2.5 shadow-sm">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-xs font-black text-slate-600">
                            {isMobile ? new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }) : `Today, ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                        </span>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-br from-[#ff6347] to-[#ff4500] text-white rounded-2xl text-[13px] font-black shadow-[0_8px_20px_rgba(255,99,71,0.2)] hover:scale-105 transition-transform active:scale-95 cursor-pointer"
                    >
                        <TrendingUp size={16} /> {isMobile ? 'Refresh' : 'Live Sync'}
                    </button>
                </div>
            </div>

            {/* --- Stats Quick View --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {STAT_CARDS.map((card, i) => (
                    <div key={i} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-premium hover:shadow-xl transition-all duration-500 animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-110" style={{ background: card.iconBg }}>
                                <card.icon size={22} color={card.iconColor} />
                            </div>
                            <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider">{card.trend}</span>
                        </div>
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[1.5px] mb-1.5">{card.label}</p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                            {card.isCurrency ? '$' : ''}{loading ? '...' : stats[card.key].toLocaleString()}
                        </h2>
                    </div>
                ))}
            </div>

            {/* --- Charts & Activities --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Revenue Analytics */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Revenue Graph</h2>
                            <p className="text-[13px] text-slate-400 font-semibold mt-1">Historical sales performance</p>
                        </div>
                        <div className="px-3.5 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 tracking-widest uppercase">LAST 12 MONTHS</div>
                    </div>
                    <div className="flex items-end gap-3 h-[200px] pb-7 border-b border-slate-100 px-1">
                        {stats.monthlySales.slice(-(isMobile ? 7 : 12)).map((val, i) => {
                            const hRatio = (val / maxVal) * 100;
                            const actualIdx = stats.monthlySales.length - (isMobile ? 7 : 12) + i;
                            return (
                                <div key={i} className="flex-1 relative flex flex-col items-center h-full group">
                                    <div
                                        onMouseEnter={() => setHoverMonth(actualIdx)}
                                        onMouseLeave={() => setHoverMonth(null)}
                                        className="w-full rounded-t-lg rounded-b-md transition-all duration-500 cursor-pointer shadow-sm group-hover:shadow-[0_8px_16px_rgba(255,99,71,0.2)]"
                                        style={{
                                            height: `${Math.max(hRatio, 6)}%`,
                                            backgroundColor: hoverMonth === actualIdx ? '#ff6347' : '#f1f5f9'
                                        }}
                                    />
                                    <span className={`absolute -bottom-6 text-[10px] font-black transition-colors duration-300 ${hoverMonth === actualIdx ? 'text-primary' : 'text-slate-400'}`}>
                                        {MONTHS[actualIdx]}
                                    </span>
                                    {hoverMonth === actualIdx && (
                                        <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded shadow-xl animate-fadeIn whitespace-nowrap z-10">
                                            ${val.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Latest Activity */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Latest Activity</h2>
                        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer">View Transactions</button>
                    </div>
                    <div className="flex flex-col gap-3.5">
                        {loading ? (
                            <div className="animate-pulse h-[300px] bg-slate-50 rounded-[32px] border border-slate-100" />
                        ) : stats.recentOrders.length === 0 ? (
                            <div className="text-center py-16 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                    <AlertCircle size={32} />
                                </div>
                                <p className="text-slate-400 font-bold text-sm tracking-tight">No recent transactions recorded</p>
                            </div>
                        ) : stats.recentOrders.map((order, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-[24px] border border-slate-100 hover:bg-white hover:border-slate-200 transition-all duration-300 group">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                        <Pizza size={20} className="text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-slate-900 truncate tracking-tight">{order.address.firstName} {order.address.lastName}</p>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{order.items.length} items • Ordered</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-green-600 tracking-tighter">${order.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* --- Category & Insights --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Popular Categories</h2>
                    <div className="flex flex-col gap-6">
                        {(() => {
                            const entries = Object.entries(stats.topCategories).sort((a, b) => b[1] - a[1]).slice(0, 4);
                            const maxQty = entries.length > 0 ? entries[0][1] : 1;
                            return entries.map(([name, qty], i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-black text-slate-700 tracking-tight">{name}</span>
                                        <span className="text-xs font-black text-primary uppercase tracking-widest">{qty} sold</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${(qty / maxQty) * 100}%`,
                                                background: `linear-gradient(90deg, #ff6347, ${['#ff4500', '#3b82f6', '#22c55e', '#a855f7'][i % 4]})`
                                            }}
                                        />
                                    </div>
                                </div>
                            ));
                        })()}
                        {Object.keys(stats.topCategories).length === 0 && (
                            <div className="text-center py-10 text-slate-300 font-bold text-sm">No category data synchronization active</div>
                        )}
                    </div>
                </div>

                <div className="bg-[#0f172a] p-10 rounded-[40px] flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6347] opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-[0.05] transition-opacity duration-1000"></div>

                    <div className="w-14 h-14 bg-[#ff6347]/10 rounded-2xl flex items-center justify-center mb-8 animate-pulse">
                        <Zap size={26} className="text-primary" />
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight mb-3">System Integrity</h2>
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-10 max-w-sm">All core services are performing at peak efficiency. Real-time data sync is active via global relay servers.</p>

                    <div className="mt-auto flex flex-col gap-3.5">
                        {[
                            { label: 'Cloud Database', val: '99.9% Uptime', color: 'text-green-400' },
                            { label: 'Security Firewall', val: 'Protected', color: 'text-blue-400' }
                        ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors duration-300">
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{stat.label}</span>
                                <span className={`text-xs font-black ${stat.color} uppercase tracking-tighter`}>{stat.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

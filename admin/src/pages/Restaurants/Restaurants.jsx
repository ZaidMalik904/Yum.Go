import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Store, CheckCircle, XCircle, MapPin, Phone, Mail, Search, Filter, Trash2, Building2 } from 'lucide-react'

const Restaurants = ({ url }) => {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("All") // All, Approved, Pending
    const [showFilter, setShowFilter] = useState(false)

    const fetchRestaurants = useCallback(async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${url}/api/restaurant/list`)
            if (res.data.success) {
                setRestaurants(res.data.data)
            } else {
                toast.error('Error fetching restaurants')
            }
        } catch {
            toast.error('Network Error')
        } finally {
            setLoading(false)
        }
    }, [url])

    const updateStatus = async (id, isApproved) => {
        try {
            const res = await axios.post(`${url}/api/restaurant/update-status`, { id, isApproved })
            if (res.data.success) {
                toast.success(isApproved ? "Vendor Approved!" : "Vendor Status Updated")
                fetchRestaurants()
            } else {
                toast.error(res.data.message)
            }
        } catch {
            toast.error("Failed to update status")
        }
    }

    const removeVendor = async (id) => {
        if (!window.confirm("Are you sure you want to remove this vendor? All their listings will remain but the vendor account will be deleted.")) return;
        try {
            const res = await axios.post(`${url}/api/restaurant/remove`, { id })
            if (res.data.success) {
                toast.success("Vendor Removed Successfully")
                fetchRestaurants()
            } else {
                toast.error(res.data.message)
            }
        } catch {
            toast.error("Error removing vendor")
        }
    }

    useEffect(() => {
        fetchRestaurants()
    }, [fetchRestaurants])

    const filteredData = restaurants.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterType === "All" ||
            (filterType === "Approved" && item.isApproved) ||
            (filterType === "Pending" && !item.isApproved)
        return matchesSearch && matchesFilter
    })

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fadeIn">

            {/* ── Page Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="page-header-icon">
                        <Building2 size={26} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Vendor Management</h1>
                        <p className="text-[13px] text-slate-400 font-semibold mt-1">Review, approve, and manage partner restaurants.</p>
                    </div>
                </div>

                {/* Search + Filter Row */}
                <div className="flex gap-3 w-full lg:max-w-lg">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            placeholder="Search vendor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-input"
                            style={{ paddingLeft: '2.75rem' }}
                        />
                    </div>

                    {/* Filter Button */}
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`h-full flex items-center gap-2 px-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap ${filterType !== 'All'
                                ? 'border-primary bg-primary-light text-primary'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30'
                                }`}
                        >
                            <Filter size={15} />
                            <span>{filterType === 'All' ? 'Status' : filterType}</span>
                        </button>

                        {showFilter && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-[20px] shadow-2xl border border-slate-100 w-48 z-50 p-2 animate-fadeInDown">
                                {['All', 'Approved', 'Pending'].map(status => (
                                    <div
                                        key={status}
                                        onClick={() => { setFilterType(status); setShowFilter(false); }}
                                        className={`px-5 py-2.5 rounded-xl text-[12px] font-black cursor-pointer transition-all ${filterType === status ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {status === 'All' ? 'All Partners' : status}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="spinner" />
                </div>
            ) : filteredData.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 py-20 px-8 text-center shadow-premium">
                    <div className="text-6xl mb-4">🏢</div>
                    <h2 className="text-lg font-black text-slate-900 mb-2">No vendors found</h2>
                    <p className="text-[13px] text-slate-400 font-semibold">{searchTerm ? "Try adjusting your search or filters." : "Wait for vendors to register via the frontend portal."}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map((item, i) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-card transition-all duration-300 flex flex-col hover:shadow-premium hover:-translate-y-1 group animate-fadeIn"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {/* Cover Image Area */}
                            <div className="h-48 relative overflow-hidden">
                                <img
                                    src={`${url}/images/${item.image}`} alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border ${item.isApproved
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}>
                                    {item.isApproved ? '✓ Verified' : '⏳ Action Required'}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-7 flex-1 flex flex-col">
                                <h2 className="text-xl font-black text-slate-900 mb-5 leading-tight">{item.name}</h2>

                                <div className="flex flex-col gap-3.5 mb-8">
                                    {[
                                        { icon: Mail, val: item.email },
                                        { icon: Phone, val: item.phone },
                                        { icon: MapPin, val: item.address },
                                    ].map(({ icon: Icon, val }, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                                                <Icon size={14} className="text-primary" />
                                            </div>
                                            <div className="min-w-0 pt-1">
                                                <p className="text-[13px] text-slate-600 font-black overflow-hidden text-overflow-ellipsis whitespace-nowrap">{val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-auto flex gap-3">
                                    {!item.isApproved ? (
                                        <button
                                            onClick={() => updateStatus(item._id, true)}
                                            className="flex-1 bg-green-500 text-white flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:bg-green-600 shadow-lg shadow-green-500/20 active:scale-95 cursor-pointer"
                                        >
                                            <CheckCircle size={16} />
                                            <span>Approve Partner</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => updateStatus(item._id, false)}
                                            className="flex-1 border-2 border-slate-100 bg-white text-slate-400 flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:bg-slate-50 hover:text-slate-600 active:scale-95 cursor-pointer"
                                        >
                                            <XCircle size={16} />
                                            <span>Suspend Account</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => removeVendor(item._id)}
                                        className="w-12 h-[52px] flex items-center justify-center bg-red-50 text-red-500 rounded-2xl transition-all duration-300 hover:bg-red-500 hover:text-white active:scale-90 cursor-pointer"
                                        title="Remove Vendor"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Restaurants

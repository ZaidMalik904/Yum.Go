import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Store, CheckCircle, XCircle, MapPin, Phone, Mail, Search, Filter, Trash2, Building2 } from 'lucide-react'

const Restaurants = ({ url }) => {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("All") // All, Approved, Pending
    const [showFilter, setShowFilter] = useState(false)

    const fetchRestaurants = async () => {
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
    }

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
    }, [])

    const filteredData = restaurants.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterType === "All" ||
            (filterType === "Approved" && item.isApproved) ||
            (filterType === "Pending" && !item.isApproved)
        return matchesSearch && matchesFilter
    })

    return (
        <div className="page-container">

            {/* ── Page Header ── */}
            <div className="page-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="page-header-icon">
                        <Building2 size={26} style={{ color: '#fff' }} />
                    </div>
                    <div>
                        <h1>Vendor Management</h1>
                        <p>Review, approve, and manage partner restaurants.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', maxWidth: 450, flexWrap: 'wrap' }}>
                    {/* Search Area */}
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            placeholder="Search vendor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-input"
                            style={{ paddingLeft: 42 }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="admin-input"
                            style={{ display: 'flex', alignItems: 'center', gap: 10, background: filterType !== 'All' ? '#fff0ed' : '#f8fafc', borderColor: filterType !== 'All' ? '#ff6347' : '#e2e8f0', cursor: 'pointer', transition: '0.2s', width: 'auto', color: filterType !== 'All' ? '#ff6347' : '#64748b' }}
                        >
                            <Filter size={18} color={filterType !== 'All' ? '#ff6347' : '#94a3b8'} />
                            {filterType === 'All' ? 'Filter Status' : filterType}
                        </button>

                        {showFilter && (
                            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 10, background: '#fff', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', width: 180, zIndex: 100, padding: 8 }}>
                                {['All', 'Approved', 'Pending'].map(status => (
                                    <div
                                        key={status}
                                        onClick={() => { setFilterType(status); setShowFilter(false); }}
                                        style={{ padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: filterType === status ? '#ff6347' : '#64748b', cursor: 'pointer', background: filterType === status ? '#fff0ed' : 'transparent', transition: '0.2s' }}
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
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <div className="spinner" />
                </div>
            ) : filteredData.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9', padding: '80px 32px', textAlign: 'center' }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🏢</div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>No vendors found</h2>
                    <p style={{ fontSize: 13, color: '#94a3b8' }}>{searchTerm ? "Try adjusting your search or filters." : "Wait for vendors to register via the frontend portal."}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                    {filteredData.map(item => (
                        <div
                            key={item._id}
                            style={{
                                background: '#fff', borderRadius: 28, border: '1px solid #f1f5f9', overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)', transition: 'all 0.3s',
                                display: 'flex', flexDirection: 'column'
                            }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'}
                        >
                            {/* Cover Image Area */}
                            <div style={{ height: 180, position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={`${url}/images/${item.image}`} alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute', top: 16, right: 16,
                                    background: item.isApproved ? '#dcfce7' : '#fef9c3',
                                    color: item.isApproved ? '#16a34a' : '#ca8a04',
                                    padding: '6px 14px', borderRadius: 20,
                                    fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    backdropFilter: 'blur(4px)'
                                }}>
                                    {item.isApproved ? '✓ Verified' : '⏳ Action Required'}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h2 style={{ fontSize: 19, fontWeight: 900, color: '#0f172a', marginBottom: 18 }}>{item.name}</h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                                    {[
                                        { icon: Mail, val: item.email, label: 'Email' },
                                        { icon: Phone, val: item.phone, label: 'Phone' },
                                        { icon: MapPin, val: item.address, label: 'Location' },
                                    ].map(({ icon: Icon, val, label }, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                            <div style={{ width: 30, height: 30, background: '#f8fafc', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Icon size={14} style={{ color: '#ff6347' }} />
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: 13, color: '#1e293b', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Actions */}
                                <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                                    {!item.isApproved ? (
                                        <button
                                            onClick={() => updateStatus(item._id, true)}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                                padding: '12px', borderRadius: 16, border: 'none',
                                                fontSize: 13, fontWeight: 800, cursor: 'pointer',
                                                background: '#22c55e', color: '#fff',
                                                boxShadow: '0 6px 16px rgba(34,197,94,0.3)',
                                                fontFamily: 'inherit', transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <CheckCircle size={18} />
                                            Approve Partner
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => updateStatus(item._id, false)}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                                padding: '12px', borderRadius: 16, border: '1.5px solid #e2e8f0',
                                                fontSize: 13, fontWeight: 800, cursor: 'pointer',
                                                background: '#fff', color: '#64748b',
                                                fontFamily: 'inherit', transition: 'all 0.2s'
                                            }}
                                        >
                                            <XCircle size={18} />
                                            Suspend Account
                                        </button>
                                    )}

                                    <button
                                        onClick={() => removeVendor(item._id)}
                                        style={{
                                            width: 50, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            border: 'none', borderRadius: 16, cursor: 'pointer',
                                            background: '#fef2f2', color: '#ef4444',
                                            fontFamily: 'inherit', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
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

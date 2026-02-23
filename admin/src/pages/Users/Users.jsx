import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Users as UsersIcon, UserPlus, Search, Filter,
    MoreVertical, Mail, Phone, Calendar, Shield,
    Trash2, Ban, ChevronLeft, ChevronRight, UserCheck, Edit, X, Camera, Save, Loader2
} from 'lucide-react'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Users = ({ url, token }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')
    const [showFilter, setShowFilter] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [editData, setEditData] = useState({ name: '', email: '', phone: '' })
    const [editImage, setEditImage] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024)
        window.addEventListener('resize', handleResize)
        fetchUsers()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${url}/api/user/list`, { headers: { token } })
            if (res.data.success) {
                setUsers(res.data.data)
            } else {
                toast.error("Error fetching users")
            }
        } catch (error) {
            toast.error("Network Error")
        } finally {
            setLoading(false)
        }
    }

    const toggleBan = async (id, currentStatus) => {
        try {
            const res = await axios.post(`${url}/api/user/update-status`, { id, isBanned: !currentStatus }, { headers: { token } })
            if (res.data.success) {
                toast.success(currentStatus ? "User Unbanned" : "User Banned Successfully")
                fetchUsers()
            }
        } catch (error) {
            toast.error("Failed to update user status")
        }
    }

    const openEditModal = (user) => {
        setSelectedUser(user)
        setEditData({ name: user.name, email: user.email, phone: user.phone || "" })
        setEditImage(false)
        setShowEditModal(true)
    }

    const onUpdateUser = async (e) => {
        e.preventDefault()
        setUpdateLoading(true)
        const formData = new FormData()
        formData.append("id", selectedUser._id)
        formData.append("name", editData.name)
        formData.append("email", editData.email)
        formData.append("phone", editData.phone)
        if (editImage) {
            formData.append("image", editImage)
        }

        try {
            const res = await axios.post(`${url}/api/user/update-user`, formData, { headers: { token } })
            if (res.data.success) {
                toast.success("User profile updated")
                setShowEditModal(false)
                fetchUsers()
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Connection Error: Failed to update user")
        } finally {
            setUpdateLoading(false)
        }
    }

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' ? true :
            filterStatus === 'Banned' ? u.isBanned : !u.isBanned;
        return matchesSearch && matchesStatus;
    })

    const S = {
        th: { fontSize: 10, fontWeight: 900, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase', padding: '18px 24px', background: '#f8fafc', textAlign: 'left', borderBottom: '1.5px solid #f1f5f9' },
        td: { padding: '20px 24px', fontSize: 14, color: '#0f172a', fontWeight: 600, borderBottom: '1.2px solid #f8fafc' },
        badge: (status) => ({
            padding: '5px 12px', borderRadius: 20, fontSize: 10, fontWeight: 900,
            background: status === 'Active' ? '#f0fdf4' : '#fef2f2',
            color: status === 'Active' ? '#16a34a' : '#ef4444',
            border: `1.2px solid ${status === 'Active' ? '#16a34a15' : '#ef444415'}`
        })
    }

    return (
        <div className="page-container">
            {/* Page Header */}
            <div className="page-header" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="page-header-icon">
                        <UsersIcon size={26} color="#fff" />
                    </div>
                    <div>
                        <h1>Identity Database</h1>
                        <p>Managing {users.length} registered global customer accounts.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, position: 'relative', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '100%' : 450, flexWrap: 'wrap', marginTop: isMobile ? 12 : 0 }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                        <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            placeholder="Find by name or email..."
                            className="admin-input"
                            style={{ paddingLeft: 46 }}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="admin-input"
                        style={{ width: 'auto', padding: '12px', border: filterStatus !== 'All' ? '2px solid #ff6347' : '2px solid #e2e8f0', background: filterStatus !== 'All' ? '#fff0ed' : '#fff', cursor: 'pointer', transition: '0.2s' }}
                    >
                        <Filter size={20} color={filterStatus !== 'All' ? '#ff6347' : '#94a3b8'} />
                    </button>

                    {showFilter && (
                        <div className="animate-fadeInDown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, background: '#fff', borderRadius: 20, boxShadow: '0 15px 45px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', width: 220, zIndex: 100, padding: 10 }}>
                            {['All', 'Active', 'Banned'].map(status => (
                                <div
                                    key={status}
                                    onClick={() => { setFilterStatus(status); setShowFilter(false); }}
                                    style={{ padding: '12px 18px', borderRadius: 14, fontSize: 13, fontWeight: 800, color: filterStatus === status ? '#ff6347' : '#64748b', cursor: 'pointer', background: filterStatus === status ? '#fff0ed' : 'transparent', transition: '0.2s' }}
                                >
                                    {status} Accounts
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Table Card */}
            <div className="card" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Customer Profile', 'Contact & Authentication', 'Join Date', 'Permissions', 'Status', ''].map(h => (
                                    <th key={h} style={S.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ padding: 60, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: 60, textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No customer records found.</td></tr>
                            ) : filteredUsers.map((u, i) => (
                                <tr key={i} style={{ transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfcfc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 16, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1.5px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                                                {u.image ? (
                                                    <img
                                                        src={`${url}/images/${u.image}`}
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }}
                                                    />
                                                ) : (
                                                    <UsersIcon size={24} style={{ color: '#94a3b8' }} />
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 15, fontWeight: 900, color: '#0f172a' }}>{u.name}</p>
                                                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, letterSpacing: 1 }}>ID: {u._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Mail size={13} style={{ color: '#94a3b8' }} />
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{u.email}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Phone size={13} style={{ color: '#94a3b8' }} />
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{u.phone || 'NO MOBILE LINKED'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Calendar size={15} style={{ color: '#94a3b8' }} />
                                            <span style={{ fontSize: 13, fontWeight: 750, color: '#64748b' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td style={S.td}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Shield size={16} color="#ff6347" />
                                            <span style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>{u.role || 'Consumer'}</span>
                                        </div>
                                    </td>
                                    <td style={S.td}>
                                        <span style={S.badge(u.isBanned ? 'Banned' : 'Active')}>{u.isBanned ? 'Restricted' : 'Authenticated'}</span>
                                    </td>
                                    <td style={{ ...S.td, textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                            <button
                                                onClick={() => openEditModal(u)}
                                                title="Edit Profile"
                                                style={{ width: 42, height: 42, borderRadius: 12, border: 'none', background: '#f1f5f9', color: '#64748b', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)' }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => toggleBan(u._id, u.isBanned)}
                                                title={u.isBanned ? "Reinstate Account" : "Suspend Account"}
                                                style={{ width: 42, height: 42, borderRadius: 12, border: 'none', background: u.isBanned ? '#f0fdf4' : '#fef2f2', color: u.isBanned ? '#16a34a' : '#ef4444', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)' }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                                            >
                                                {u.isBanned ? <UserCheck size={18} /> : <Ban size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Database Statistics Footer */}
                <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderTop: '1.6px solid #f8fafc' }}>
                    <p style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                        Mapping <span style={{ color: '#0f172a' }}>{filteredUsers.length}</span> / <span style={{ color: '#0f172a' }}>{users.length}</span> Active Identities
                    </p>
                    {users.length > 10 && (
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button style={{ width: 44, height: 44, borderRadius: 14, border: '2px solid #f1f5f9', background: '#fff', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
                            <button style={{ width: 44, height: 44, borderRadius: 14, border: '2px solid #f1f5f9', background: '#fff', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={20} /></button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div className="card shadow-premium animate-scaleIn" style={{
                        width: '95%', maxWidth: 500, padding: 0, overflow: 'hidden', border: 'none',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff0ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Edit size={20} color="#ff6347" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Edit Customer Profile</h2>
                                    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Update identity details for {selectedUser?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEditModal(false)} style={{ background: '#f1f5f9', border: 'none', padding: 8, borderRadius: 10, cursor: 'pointer', color: '#64748b' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={onUpdateUser} style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {/* Profile Picture Upload */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        width: 100, height: 100, borderRadius: '50%', border: '4px solid #fff',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', background: '#f8fafc'
                                    }}>
                                        {editImage ? (
                                            <img src={URL.createObjectURL(editImage)} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : selectedUser?.image ? (
                                            <img src={`${url}/images/${selectedUser.image}`} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                                                <UsersIcon size={40} style={{ color: '#cbd5e1' }} />
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="user-image-edit" style={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        width: 32, height: 32, background: '#ff6347', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', border: '3px solid #fff', color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                                    }}>
                                        <Camera size={14} />
                                    </label>
                                    <input type="file" id="user-image-edit" hidden onChange={e => setEditImage(e.target.files[0])} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <UsersIcon size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                        <input
                                            className="admin-input" style={{ paddingLeft: 48 }}
                                            value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })}
                                            required placeholder="Enter full name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                        <input
                                            type="email" className="admin-input" style={{ paddingLeft: 48 }}
                                            value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })}
                                            required placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>Mobile Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                        <input
                                            className="admin-input" style={{ paddingLeft: 48 }}
                                            value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                            placeholder="Enter mobile number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                <button type="button" onClick={() => setShowEditModal(false)} className="admin-input" style={{ background: '#f8fafc', color: '#64748b', border: '1.5px solid #e2e8f0', flex: 1, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={updateLoading} className="btn-primary" style={{ flex: 1, padding: 14, justifyContent: 'center' }}>
                                    {updateLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            <Save size={18} />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Users

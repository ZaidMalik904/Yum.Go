import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
    Users as UsersIcon, Search, Filter,
    Mail, Phone, Calendar, Shield,
    UserCheck, Ban, Edit, X, Camera, Save, Loader2, AlertCircle
} from 'lucide-react'
import { toast } from 'react-toastify'


const Users = ({ url, token }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('All')
    const [showFilter, setShowFilter] = useState(false)

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [editData, setEditData] = useState({ name: '', email: '', phone: '' })
    const [editImage, setEditImage] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${url}/api/user/list`, { headers: { token } })
            if (res.data.success) {
                setUsers(res.data.data)
            } else {
                toast.error("Error fetching users")
            }
        } catch {
            toast.error("Network Error")
        } finally {
            setLoading(false)
        }
    }, [url, token])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const toggleBan = async (id, currentStatus) => {
        try {
            const res = await axios.post(`${url}/api/user/update-status`, { id, isBanned: !currentStatus }, { headers: { token } })
            if (res.data.success) {
                toast.success(currentStatus ? "User Unbanned" : "User Banned Successfully")
                fetchUsers()
            }
        } catch {
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

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fadeIn">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="page-header-icon">
                        <UsersIcon size={26} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Identity Database</h1>
                        <p className="text-[13px] text-slate-400 font-semibold mt-1">Managing {users.length} registered global customer accounts.</p>
                    </div>
                </div>

                <div className="flex gap-3 w-full lg:max-w-lg">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            placeholder="Find by name or email..."
                            className="admin-input"
                            style={{ paddingLeft: '2.75rem' }}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Button */}
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`h-full flex items-center gap-2 px-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap ${filterStatus !== 'All'
                                ? 'border-primary bg-primary-light text-primary'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30'
                                }`}
                        >
                            <Filter size={15} />
                            <span>{filterStatus === 'All' ? 'Status' : filterStatus}</span>
                        </button>

                        {showFilter && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-slate-100 w-48 z-50 p-2 animate-fadeInDown">
                                {['All', 'Active', 'Banned'].map(status => (
                                    <div
                                        key={status}
                                        onClick={() => { setFilterStatus(status); setShowFilter(false); }}
                                        className={`px-5 py-2.5 rounded-xl text-[12px] font-black cursor-pointer transition-all ${filterStatus === status ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {status === 'All' ? 'All Accounts' : `${status} Accounts`}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[40px] shadow-premium border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                {['Customer Profile', 'Contact Info', 'Join Date', 'Permissions', 'Status', 'Actions'].map((h, i) => (
                                    <th key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 py-5 text-left border-b border-slate-100">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="spinner mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <AlertCircle size={40} className="mx-auto text-slate-100 mb-4" />
                                        <p className="text-slate-400 font-bold text-sm">No customer records found matching criteria.</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.map((u, i) => (
                                <tr key={u._id || i} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div>
                                            <p className="text-base font-black text-slate-900 leading-none">{u.name}</p>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1.5">ID: {u._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <Mail size={12} className="text-slate-400" />
                                                <span className="text-xs font-bold text-slate-600">{u.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={12} className="text-slate-400" />
                                                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{u.phone || 'No Mobile'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2.5">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-[13px] font-black text-slate-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2.5">
                                            <Shield size={14} className="text-primary" />
                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">{u.role || 'Consumer'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${u.isBanned ? 'bg-red-50 text-red-500 border-red-500/10' : 'bg-green-50 text-green-500 border-green-500/10'}`}>
                                            {u.isBanned ? 'Restricted' : 'Authenticated'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            <button
                                                onClick={() => openEditModal(u)}
                                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                                                title="Edit Profile"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => toggleBan(u._id, u.isBanned)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${u.isBanned ? 'bg-green-50 text-green-500 border-green-200' : 'bg-red-50 text-red-500 border-red-200'} hover:scale-105 shadow-sm active:scale-95`}
                                                title={u.isBanned ? "Reinstate Account" : "Suspend Account"}
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

                <div className="px-8 py-6 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        Displaying <span className="text-slate-900">{filteredUsers.length}</span> / <span className="text-slate-900">{users.length}</span> Active Identities
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 bg-white text-slate-300 rounded-xl font-black text-xs uppercase cursor-not-allowed">Previous</button>
                        <button className="px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl font-black text-xs uppercase hover:bg-slate-50 transition-colors">Next</button>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-fadeIn">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary">
                                    <Edit size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 leading-none">Edit Customer Profile</h2>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 line-clamp-1">Update details for {selectedUser?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={onUpdateUser} className="p-10 flex flex-col gap-8">
                            <div className="flex justify-center">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-premium overflow-hidden bg-slate-50 ring-2 ring-slate-100">
                                        {editImage ? (
                                            <img src={URL.createObjectURL(editImage)} alt="profile" className="w-full h-full object-cover" />
                                        ) : selectedUser?.image ? (
                                            <img src={`${url}/images/${selectedUser.image}`} alt="profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                                <UsersIcon size={48} className="text-slate-200" />
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="user-image-edit" className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer border-4 border-white shadow-xl hover:scale-110 hover:bg-primary-dark transition-all">
                                        <Camera size={14} />
                                    </label>
                                    <input type="file" id="user-image-edit" className="hidden" onChange={e => setEditImage(e.target.files[0])} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Full Name</label>
                                    <div className="relative group">
                                        <UsersIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            className="admin-input pl-12 h-14"
                                            value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })}
                                            required placeholder="Full name of customer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email" className="admin-input pl-12 h-14"
                                            value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })}
                                            required placeholder="customer@ident.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Contact Phone</label>
                                    <div className="relative group">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            className="admin-input pl-12 h-14"
                                            value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                            placeholder="Emergency contact or phone"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-8 py-4 rounded-2xl border-2 border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all cursor-pointer">Cancel</button>
                                <button type="submit" disabled={updateLoading} className="flex-1 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-widest hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95">
                                    {updateLoading ? <Loader2 className="animate-spin" size={18} /> : (
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

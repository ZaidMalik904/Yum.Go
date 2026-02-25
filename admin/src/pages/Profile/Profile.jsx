import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { User, Mail, Camera, Save, Loader2, Shield, Phone, CheckCircle2 } from 'lucide-react'

const Profile = ({ url, token, adminData, setAdminData }) => {
    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [data, setData] = useState({
        name: adminData?.name || '',
        email: adminData?.email || '',
        phone: adminData?.phone || ''
    })

    useEffect(() => {
        if (adminData) {
            setData({
                name: adminData.name,
                email: adminData.email,
                phone: adminData.phone || ''
            })
        }
    }, [adminData])

    const onChangeHandler = (event) => {
        const { name, value } = event.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const onUpdate = async (event) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('phone', data.phone)
        if (image) formData.append('image', image)

        try {
            const response = await axios.post(`${url}/api/user/update-profile`, formData, { headers: { token } })
            if (response.data.success) {
                const updatedUser = response.data.user
                setAdminData(updatedUser)
                localStorage.setItem('adminData', JSON.stringify(updatedUser))
                toast.success('Profile updated successfully')
                setSaved(true)
                setTimeout(() => setSaved(false), 2500)
                setImage(false)
            } else {
                toast.error(response.data.message)
            }
        } catch {
            toast.error('Error updating profile')
        } finally {
            setLoading(false)
        }
    }

    const initials = (adminData?.name || 'A').charAt(0).toUpperCase()

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto animate-fadeIn">

            {/* ── Page Header ── */}
            <div className="flex items-center gap-4 mb-10">
                <div className="page-header-icon">
                    <User size={26} />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Admin Profile</h1>
                    <p className="text-[13px] text-slate-400 font-semibold mt-1">Manage your personal information and profile picture.</p>
                </div>
            </div>

            <form onSubmit={onUpdate} className="flex flex-col gap-6">

                {/* ── Avatar Card ── */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium p-8 flex flex-col sm:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-[28px] overflow-hidden border-4 border-white shadow-xl ring-2 ring-slate-100 bg-slate-50">
                            {image ? (
                                <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-cover" />
                            ) : adminData?.image ? (
                                <img src={`${url}/images/${adminData.image}`} alt="profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary-light">
                                    <span className="text-5xl font-black text-primary leading-none">{initials}</span>
                                </div>
                            )}
                        </div>
                        {/* Camera Button */}
                        <label
                            htmlFor="profile-image"
                            className="absolute -bottom-2 -right-2 w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer border-4 border-white text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
                            style={{
                                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                                boxShadow: '0 6px 20px rgba(168, 85, 247, 0.45)'
                            }}
                        >
                            <Camera size={16} />
                        </label>
                        <input type="file" id="profile-image" hidden accept="image/*" onChange={e => setImage(e.target.files[0])} />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1 text-center sm:text-left">
                        <h2 className="text-2xl font-black text-slate-900 leading-none">{adminData?.name || 'Admin'}</h2>
                        <p className="text-sm font-semibold text-slate-400">{adminData?.email}</p>
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                            <div className="w-5 h-5 bg-primary-light rounded-lg flex items-center justify-center">
                                <Shield size={11} className="text-primary" />
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                {adminData?.role || 'Super Admin'}
                            </span>
                        </div>
                        {image && (
                            <p className="text-[11px] font-bold text-amber-500 mt-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                                📷 New photo selected — save to apply
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Form Fields Card ── */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium p-8 flex flex-col gap-6">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Personal Information</h3>

                    {/* Full Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            <input
                                name="name"
                                value={data.name}
                                onChange={onChangeHandler}
                                required
                                placeholder="Your full name"
                                className="admin-input"
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            <input
                                name="email"
                                value={data.email}
                                onChange={onChangeHandler}
                                type="email"
                                required
                                placeholder="admin@yumgo.com"
                                className="admin-input"
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            <input
                                name="phone"
                                value={data.phone}
                                onChange={onChangeHandler}
                                placeholder="+91 00000 00000"
                                className="admin-input"
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Save Button ── */}
                <div className="sticky bottom-4 md:static mt-8 z-20 bg-slate-50/80 backdrop-blur-md p-2 rounded-3xl md:bg-transparent md:backdrop-blur-none md:p-0">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95 ${saved
                            ? 'bg-green-500 text-white shadow-green-200'
                            : 'bg-gradient-to-r from-primary to-[#ff4500] text-white hover:shadow-primary/40'
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : saved ? (
                            <><CheckCircle2 size={22} /> Saved Successfully</>
                        ) : (
                            <><Save size={20} /> Save Changes</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Profile

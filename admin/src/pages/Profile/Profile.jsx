import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { User, Mail, Camera, Save, Loader2, Shield } from 'lucide-react'
import { assets } from '../../assets/assets'

const Profile = ({ url, token, adminData, setAdminData }) => {
    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: adminData?.name || "",
        email: adminData?.email || "",
        phone: adminData?.phone || ""
    })

    useEffect(() => {
        if (adminData) {
            setData({
                name: adminData.name,
                email: adminData.email,
                phone: adminData.phone || ""
            })
        }
    }, [adminData])

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onUpdate = async (event) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("email", data.email)
        formData.append("phone", data.phone)
        if (image) {
            formData.append("image", image)
        }

        try {
            const response = await axios.post(`${url}/api/user/update-profile`, formData, { headers: { token } })
            if (response.data.success) {
                const updatedUser = response.data.user
                setAdminData(updatedUser)
                localStorage.setItem("adminData", JSON.stringify(updatedUser))
                toast.success("Profile updated successfully")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error updating profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-container" style={{ maxWidth: 700, margin: '0 auto' }}>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-icon">
                    <User size={26} />
                </div>
                <div>
                    <h1>Admin Profile</h1>
                    <p>Manage your personal information and profile picture.</p>
                </div>
            </div>

            <div className={`card shadow-premium ${window.innerWidth < 450 ? 'mobile-card-padding' : ''}`}>
                <form onSubmit={onUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    {/* Profile Picture Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: 130, height: 130, borderRadius: '50%', border: '4px solid #fff',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.12)', overflow: 'hidden', background: '#f8fafc'
                            }}>
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : adminData?.image ? (
                                    <img src={`${url}/images/${adminData.image}`} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                                        <User size={60} style={{ color: '#cbd5e1' }} />
                                    </div>
                                )}
                            </div>
                            <label htmlFor="profile-image" style={{
                                position: 'absolute', bottom: 5, right: 5,
                                width: 38, height: 38, background: '#ff6347', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', border: '3.5px solid #fff', color: '#fff', boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
                                transition: 'all 0.2s'
                            }}>
                                <Camera size={18} />
                            </label>
                            <input type="file" id="profile-image" hidden onChange={e => setImage(e.target.files[0])} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>{adminData?.name}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
                                <Shield size={14} style={{ color: '#ff6347' }} />
                                <span style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase' }}>
                                    {adminData?.role || "Super Admin"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
                        <div>
                            <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Full Name</p>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                <input
                                    name="name" value={data.name} onChange={onChangeHandler} required
                                    className="admin-input"
                                    style={{ paddingLeft: 48 }}
                                />
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Email Address</p>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                <input
                                    name="email" value={data.email} onChange={onChangeHandler} type="email" required
                                    className="admin-input"
                                    style={{ paddingLeft: 48 }}
                                />
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Phone Number</p>
                            <div style={{ position: 'relative' }}>
                                <Shield size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} />
                                <input
                                    name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Enter your mobile number"
                                    className="admin-input"
                                    style={{ paddingLeft: 48 }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ padding: 16, justifyContent: 'center', width: '100%', marginTop: 8 }}
                    >
                        {loading ? <Loader2 className='animate-spin' size={20} /> : (
                            <>
                                <Save size={18} />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Profile

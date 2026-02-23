import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Upload, PlusCircle, Building2, Mail, Phone, MapPin, KeyRound, AlignLeft, Loader2 } from 'lucide-react'

const labelStyle = {
    fontSize: 11, fontWeight: 800, color: '#94a3b8',
    letterSpacing: 2, textTransform: 'uppercase',
    display: 'flex', alignItems: 'center', gap: 6,
    marginBottom: 10,
}
const inputStyle = {
    width: '100%', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', borderRadius: 14,
    padding: '13px 18px', fontSize: 14, fontWeight: 600,
    color: '#0f172a', outline: 'none',
    fontFamily: 'inherit', transition: 'all 0.25s',
    boxSizing: 'border-box',
}
const focusStyle = { borderColor: '#ff6347', background: '#fff', boxShadow: '0 0 0 3px rgba(255,99,71,0.1)' }

const AddRestaurant = ({ url }) => {
    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        description: ""
    })

    const onChange = e => setData(p => ({ ...p, [e.target.name]: e.target.value }))

    const onSubmit = async e => {
        e.preventDefault()
        if (!image) { toast.error('Please upload a cover image'); return }
        setLoading(true)

        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('password', data.password)
        formData.append('address', data.address)
        formData.append('phone', data.phone)
        formData.append('description', data.description)
        formData.append('image', image)

        try {
            const res = await axios.post(`${url}/api/restaurant/register`, formData)
            if (res.data.success) {
                setData({ name: '', email: '', password: '', address: '', phone: '', description: '' })
                setImage(false)
                toast.success("Restaurant Onboarded Successfully!")
            } else {
                toast.error(res.data.message)
            }
        } catch {
            toast.error('Error connecting to server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-container" style={{ maxWidth: 860 }}>

            {/* ── Page Header ── */}
            <div className="page-header">
                <div className="page-header-icon">
                    <Building2 size={26} />
                </div>
                <div>
                    <h1>Onboard New Restaurant</h1>
                    <p>Register a new partner vendor and create their profile.</p>
                </div>
            </div>

            {/* ── Form Card ── */}
            <div className="card shadow-premium">
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                    {/* Image Upload */}
                    <div>
                        <p className="admin-label"><Upload size={14} style={{ color: '#ff6347' }} /> Cover Image</p>
                        <label htmlFor="image" style={{ cursor: 'pointer', display: 'inline-block', width: '100%' }}>
                            <div style={{
                                width: '100%', minWidth: 200, height: 180, borderRadius: 20,
                                border: '2px dashed #e2e8f0',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', transition: 'all 0.25s', background: '#f8fafc',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6347'; e.currentTarget.style.background = '#fff0ed' }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc' }}
                            >
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <Upload size={40} style={{ color: '#cbd5e1', marginBottom: 8, strokeWidth: 1.5 }} />
                                        <span style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', letterSpacing: 1 }}>UPLOAD RESTAURANT BANNER</span>
                                    </>
                                )}
                            </div>
                        </label>
                        <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </div>

                    <div className="responsive-grid-2">
                        {/* Business Name */}
                        <div>
                            <p className="admin-label"><Building2 size={13} style={{ color: '#ff6347' }} />Restaurant Name</p>
                            <input
                                className="admin-input" name="name" type="text" value={data.name}
                                placeholder="Ex: The Grand Bistro" required onChange={onChange}
                            />
                        </div>
                        {/* Phone Number */}
                        <div>
                            <p className="admin-label"><Phone size={13} style={{ color: '#ff6347' }} />Contact Phone</p>
                            <input
                                className="admin-input" name="phone" type="text" value={data.phone}
                                placeholder="+1 (555) 000-0000" required onChange={onChange}
                            />
                        </div>
                    </div>

                    <div className="responsive-grid-2">
                        {/* Email */}
                        <div>
                            <p className="admin-label"><Mail size={13} style={{ color: '#ff6347' }} />Business Email</p>
                            <input
                                className="admin-input" name="email" type="email" value={data.email}
                                placeholder="vendor@yumgo.com" required onChange={onChange}
                            />
                        </div>
                        {/* Password */}
                        <div>
                            <p className="admin-label"><KeyRound size={13} style={{ color: '#ff6347' }} />Account Password</p>
                            <input
                                className="admin-input" name="password" type="password" value={data.password}
                                placeholder="••••••••" required onChange={onChange}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <p className="admin-label"><MapPin size={13} style={{ color: '#ff6347' }} />Business Location (Address)</p>
                        <input
                            className="admin-input" name="address" type="text" value={data.address}
                            placeholder="123 Street, City, State, ZIP" required onChange={onChange}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <p className="admin-label"><AlignLeft size={13} style={{ color: '#ff6347' }} />Description & Story</p>
                        <textarea
                            className="admin-input"
                            style={{ minHeight: 110, resize: 'none' }}
                            name="description" value={data.description} rows={4} required onChange={onChange}
                            placeholder="Tell customers about your kitchen, specialties, and goals..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: 18, justifyContent: 'center', fontSize: 13, letterSpacing: 1.2 }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Onboarding"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default AddRestaurant

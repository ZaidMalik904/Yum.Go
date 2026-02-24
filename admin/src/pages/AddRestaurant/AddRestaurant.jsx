import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Upload, PlusCircle, Building2, Mail, Phone, MapPin, KeyRound, AlignLeft, Loader2 } from 'lucide-react'

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
        <div className="p-4 md:p-8 max-w-[1000px] mx-auto animate-fadeIn text-slate-900">

            {/* ── Page Header ── */}
            <div className="flex items-center gap-4 mb-10">
                <div className="page-header-icon">
                    <Building2 size={26} />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Vendor Onboarding</h1>
                    <p className="text-[13px] text-slate-400 font-semibold mt-1">Register a new partner restaurant and configure their profile.</p>
                </div>
            </div>

            {/* ── Form Card ── */}
            <div className="bg-white rounded-[40px] shadow-premium border border-slate-100 p-8 md:p-12">
                <form onSubmit={onSubmit} className="flex flex-col gap-10">

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                            <Upload size={14} className="text-primary" /> Cover Experience (Banner)
                        </p>
                        <label htmlFor="image" className="cursor-pointer block w-full group">
                            <div className="w-full h-48 md:h-64 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 bg-slate-50/50 group-hover:border-primary group-hover:bg-primary-light/30">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                            <Upload size={32} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-[10px] font-black text-slate-400 group-hover:text-primary tracking-widest uppercase">Upload Restaurant Banner</span>
                                            <span className="text-[10px] font-bold text-slate-300 mt-1 block uppercase tracking-tighter">Recommended: 1920x1080</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Business Name */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                                <Building2 size={13} className="text-primary" /> Professional Name
                            </p>
                            <input
                                className="admin-input" name="name" type="text" value={data.name}
                                placeholder="Ex: The Grand Bistro" required onChange={onChange}
                            />
                        </div>
                        {/* Phone Number */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                                <Phone size={13} className="text-primary" /> Contact Protocol
                            </p>
                            <input
                                className="admin-input" name="phone" type="text" value={data.phone}
                                placeholder="+1 (555) 000-0000" required onChange={onChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Email */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                                <Mail size={13} className="text-primary" /> Official Email
                            </p>
                            <input
                                className="admin-input" name="email" type="email" value={data.email}
                                placeholder="vendor@yumgo.com" required onChange={onChange}
                            />
                        </div>
                        {/* Password */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                                <KeyRound size={13} className="text-primary" /> System Password
                            </p>
                            <input
                                className="admin-input" name="password" type="password" value={data.password}
                                placeholder="••••••••" required onChange={onChange}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                            <MapPin size={13} className="text-primary" /> Physical Headquarters
                        </p>
                        <input
                            className="admin-input" name="address" type="text" value={data.address}
                            placeholder="123 Gastronomy Street, Food District, ZIP" required onChange={onChange}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                            <AlignLeft size={13} className="text-primary" /> Culinary Heritage
                        </p>
                        <textarea
                            className="admin-input min-h-[140px] py-5 resize-none"
                            name="description" value={data.description} rows={4} required onChange={onChange}
                            placeholder="Share the vision, flavor profile, and story of this kitchen..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full md:w-auto min-w-[280px] justify-center py-5 shadow-button disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Finalize Onboarding"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddRestaurant

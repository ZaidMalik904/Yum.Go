import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import {
    User, Mail, Phone, Camera, Save, ArrowLeft,
    Shield, Calendar, MapPin, ShoppingBag,
    ChevronRight, LogOut, CheckCircle, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { userData, url, token, fetchUserProfile, setToken, setUserData } = useContext(StoreContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const timeout = setTimeout(() => {
            if (!userData) setFetchError(true);
        }, 10000);

        if (!userData) {
            fetchUserProfile(token);
        } else {
            setFetchError(false);
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || ''
            });
        }

        return () => clearTimeout(timeout);
    }, [userData, token, navigate, fetchUserProfile]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        setToken("");
        setUserData(null);
        navigate("/");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            if (imageFile) {
                data.append('image', imageFile);
            }

            const response = await axios.post(url + '/api/user/update-profile', data, {
                headers: { token }
            });

            if (response.data.success) {
                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                setIsEditing(false);
                setImageFile(null);
                fetchUserProfile(token);
                // Hide message after 3 seconds
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            } else {
                setMessage({ text: response.data.message || 'Update failed', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const profileImageUrl = imagePreview
        ? imagePreview
        : userData?.image
            ? `${url}/images/${userData.image}`
            : null;

    if (!userData && !fetchError) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 border-[6px] border-slate-100 border-t-[tomato] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-[tomato] rounded-full animate-ping"></div>
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Authenticating...</h2>
                    <p className="text-slate-400 text-sm font-bold mt-1">Preparing your personalized dashboard</p>
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-[40px] p-10 text-center shadow-2xl border border-slate-100">
                    <div className="w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                        <Shield size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Session Sync Failed</h2>
                    <p className="text-slate-500 mb-8 font-medium leading-relaxed">We encountered a temporary hiccup while fetching your profile information.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-[tomato] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[tomato]/20 hover:bg-[#ff4500] transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Custom Animations */}
            <style>
                {`
                    @keyframes slideUpFade {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slideUpFade {
                        animation: slideUpFade 0.5s ease-out forwards;
                    }
                `}
            </style>

            {/* --- Top Header Area --- */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-slate-900">
                    {/* Animated background patterns */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,99,71,0.2),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,165,0,0.15),transparent_50%)]"></div>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-between py-10 relative z-10">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                        >
                            <ArrowLeft size={18} />
                            <span className="text-sm font-bold">Back to Home</span>
                        </button>
                        <div className="flex gap-3">
                            <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10 hover:bg-white/20 transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-[tomato] rounded-full border-2 border-slate-900"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Main Dashboard --- */}
            <div className="max-w-[1100px] mx-auto px-6 -mt-[140px] relative z-20">
                <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start">

                    {/* LEFT SIDE: Identity Card */}
                    <div className="animate-slideUpFade">
                        <div className="bg-white rounded-[40px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] overflow-hidden border-[6px] border-white shadow-2xl bg-gradient-to-br from-[#ff6347] to-[#ff4500] group relative">
                                    {profileImageUrl ? (
                                        <img src={profileImageUrl} alt={userData.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black">
                                            {getInitials(userData.name)}
                                        </div>
                                    )}
                                    {isEditing && (
                                        <label className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Camera size={32} className="text-white" />
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-[4px] border-white flex items-center justify-center shadow-lg">
                                    <CheckCircle size={16} className="text-white" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center">{userData.name}</h1>
                            <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-slate-100 rounded-full">
                                <Shield size={14} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                    {userData.role || 'Verified Customer'}
                                </span>
                            </div>

                            <div className="w-full mt-10 grid grid-cols-2 gap-4">
                                <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100/50 text-center">
                                    <ShoppingBag size={20} className="text-[tomato] mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Orders</p>
                                    <p className="text-lg font-black text-slate-800">12</p>
                                </div>
                                <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100/50 text-center">
                                    <Calendar size={20} className="text-blue-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Joined</p>
                                    <p className="text-lg font-black text-slate-800">2026</p>
                                </div>
                            </div>

                            <div className="w-full mt-8 flex flex-col gap-2">
                                <button onClick={() => navigate('/my-orders')} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-[#fff0ed] hover:text-[tomato] rounded-2xl transition-all group">
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag size={18} />
                                        <span className="text-sm font-bold">Track Orders</span>
                                    </div>
                                    <ChevronRight size={16} className="opacity-40 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group opacity-50 cursor-not-allowed">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} />
                                        <span className="text-sm font-bold">Saved Addresses</span>
                                    </div>
                                    <ChevronRight size={16} className="opacity-40" />
                                </button>
                            </div>

                            <button onClick={logout} className="w-full mt-10 flex items-center justify-center gap-3 py-4 text-red-500 font-extrabold hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100">
                                <LogOut size={18} />
                                Sign Out Account
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Profile Settings */}
                    <div className="animate-slideUpFade" style={{ animationDelay: '0.1s' }}>
                        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account Preferences</h2>
                                    <p className="text-slate-400 text-sm font-medium mt-1">Manage your identity and contact information</p>
                                </div>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-3 bg-[tomato] text-white rounded-2xl text-sm font-black shadow-lg shadow-[tomato]/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Edit Details
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setIsEditing(false); setImagePreview(null); }}
                                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black hover:bg-slate-200 transition-all"
                                    >
                                        Discard
                                    </button>
                                )}
                            </div>

                            {message.text && (
                                <div className={`mb-8 p-5 rounded-3xl flex items-center gap-3 border ${message.type === 'success'
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                        : 'bg-red-50 border-red-100 text-red-700'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <Shield size={20} />}
                                    <span className="text-sm font-bold">{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Name Input */}
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[tomato] transition-colors">
                                                <User size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-6 py-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                        ? 'bg-white border-2 border-slate-100 focus:border-[tomato] focus:shadow-lg focus:shadow-[tomato]/5'
                                                        : 'bg-slate-50 border-2 border-transparent text-slate-600'
                                                    }`}
                                                placeholder="e.g. Zaid Malik"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[tomato] transition-colors">
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-6 py-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                        ? 'bg-white border-2 border-slate-100 focus:border-[tomato] focus:shadow-lg focus:shadow-[tomato]/5'
                                                        : 'bg-slate-50 border-2 border-transparent text-slate-600'
                                                    }`}
                                                placeholder="e.g. name@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Input */}
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[tomato] transition-colors">
                                                <Phone size={20} />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-12 pr-6 py-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing
                                                        ? 'bg-white border-2 border-slate-100 focus:border-[tomato] focus:shadow-lg focus:shadow-[tomato]/5'
                                                        : 'bg-slate-50 border-2 border-transparent text-slate-600'
                                                    }`}
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="pt-6 border-t border-slate-50 flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="grow bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Save size={20} /> Deploy Changes</>}
                                        </button>
                                    </div>
                                )}
                            </form>

                            <div className="mt-16 bg-slate-50 p-6 md:p-8 rounded-[32px] border border-slate-100/50">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                                            <Shield size={24} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 leading-tight">Security & Privacy</h4>
                                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Two-factor authentication • Active</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-xs font-black hover:border-[tomato] hover:text-[tomato] transition-all whitespace-nowrap">
                                        Update Security
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

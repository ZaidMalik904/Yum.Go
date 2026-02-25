import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { User, Mail, Phone, Camera, Save, ArrowLeft, Shield, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { userData, url, token, fetchUserProfile } = useContext(StoreContext);
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

        // Set a timeout to detect if profile loading is hanging
        const timeout = setTimeout(() => {
            if (!userData) {
                setFetchError(true);
            }
        }, 10000); // 10 seconds timeout

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

    if (!userData) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                {fetchError ? (
                    <div className="text-center px-6">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Profile Loading Failed</h2>
                        <p className="text-slate-500 mb-6 max-w-xs mx-auto">We couldn't fetch your profile info. Please check your internet or try logging in again.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[tomato] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-[tomato]/20"
                        >
                            Retry Loading
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="w-[60px] h-[60px] border-4 border-slate-200 border-t-[tomato] rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold animate-pulse">Fetching your identity...</p>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
            {/* Hero Banner */}
            <div className="relative h-[200px] md:h-[260px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460]"></div>
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,99,71,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,165,0,0.3) 0%, transparent 50%)'
                }}></div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl transition-all hover:bg-white/20"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-semibold">Back</span>
                </button>
            </div>

            {/* Profile Content */}
            <div className="max-w-[700px] mx-auto px-4 -mt-24 relative z-10 pb-20">
                {/* Profile Card */}
                <div className="bg-white rounded-[28px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Avatar & Name Section */}
                    <div className="flex flex-col items-center pt-0 pb-6 -mt-16">
                        <div className="relative group">
                            <div className="w-[120px] h-[120px] rounded-[28px] overflow-hidden border-4 border-white shadow-2xl shadow-slate-300/50 bg-gradient-to-br from-[#ff6347] to-[#ff4500]">
                                {profileImageUrl ? (
                                    <img
                                        src={profileImageUrl}
                                        alt={userData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black">
                                        {getInitials(userData.name)}
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[tomato] rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-[tomato]/30 hover:scale-110 transition-transform">
                                    <Camera size={18} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <h1 className="text-2xl font-black text-slate-900 mt-5 tracking-tight">{userData.name}</h1>
                        <p className="text-sm text-slate-400 font-medium mt-1">{userData.email}</p>

                        {/* Role Badge */}
                        <div className="flex items-center gap-2 mt-3 px-4 py-1.5 bg-emerald-50 rounded-full">
                            <Shield size={14} className="text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                {userData.role || 'Customer'}
                            </span>
                        </div>
                    </div>

                    {/* Message Banner */}
                    {message.text && (
                        <div className={`mx-6 mb-4 px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                            <span>{message.type === 'success' ? '✅' : '❌'}</span>
                            {message.text}
                        </div>
                    )}

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="px-6 md:px-10 pb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-[tomato] transition-all active:scale-95"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setImageFile(null);
                                        setImagePreview(null);
                                        setFormData({
                                            name: userData.name || '',
                                            email: userData.email || '',
                                            phone: userData.phone || ''
                                        });
                                    }}
                                    className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            {/* Name Field */}
                            <div className="group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-semibold transition-all outline-none ${isEditing
                                            ? 'bg-white border-2 border-slate-200 focus:border-[tomato] text-slate-900'
                                            : 'bg-slate-50 border-2 border-transparent text-slate-600'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-semibold transition-all outline-none ${isEditing
                                            ? 'bg-white border-2 border-slate-200 focus:border-[tomato] text-slate-900'
                                            : 'bg-slate-50 border-2 border-transparent text-slate-600'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder={isEditing ? 'Enter phone number' : 'Not set'}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-semibold transition-all outline-none ${isEditing
                                            ? 'bg-white border-2 border-slate-200 focus:border-[tomato] text-slate-900'
                                            : 'bg-slate-50 border-2 border-transparent text-slate-600'
                                            } placeholder:text-slate-300`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 py-4 bg-gradient-to-r from-[#ff6347] to-[#ff4500] text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-[tomato]/20 transition-all active:scale-[0.98] disabled:opacity-60"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        )}
                    </form>

                    {/* Account Info Footer */}
                    <div className="px-6 md:px-10 py-5 bg-slate-50 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Calendar size={14} />
                            <span className="text-xs font-semibold">
                                Member since {new Date().getFullYear()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

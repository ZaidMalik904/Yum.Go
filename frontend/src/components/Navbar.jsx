import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ShoppingCart, LogOut, User, Menu, X, ChevronDown, Search } from 'lucide-react';
import { assets } from '../assets/assets';

const Navbar = ({ setShowLogin }) => {
    const { token, setToken, menu, setMenu, cartItems, setSearchQuery, userData, setUserData, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [navSearch, setNavSearch] = useState("");
    const profileRef = useRef(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        setNavSearch(e.target.value);
        setSearchQuery(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const display = document.getElementById('restaurant-display');
            if (display) {
                display.scrollIntoView({ behavior: 'smooth' });
            } else {
                navigate('/');
                setTimeout(() => {
                    document.getElementById('restaurant-display')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUserData(null);
        navigate("/");
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const cartCount = Object.values(cartItems || {}).reduce((a, b) => a + b, 0);

    return (
        <header className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-[1440px] mx-auto px-6 md:px-[5vw] h-20 md:h-24 flex justify-between items-center">

                {/* --- Logo Area --- */}
                <Link to='/'
                    className='flex items-center gap-2 no-underline group'
                    onClick={() => setMenu("home")}
                >
                    <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#ff6347] to-[#ff4500] rounded-xl flex items-center justify-center shadow-[0_8px_20px_rgba(255,99,71,0.3)] shrink-0 transition-transform group-hover:scale-105">
                        <img src={assets.logo} alt="logo" className="w-[22px] h-[22px] object-contain block border-0" />
                    </div>
                    <div className="flex flex-col leading-[1.1]">
                        <span className="text-lg font-black text-slate-900 tracking-[-0.8px]">
                            YumGo<span className="text-primary">.</span>
                        </span>
                        <span className="text-[8px] font-extrabold text-slate-400 tracking-[1.5px] uppercase">
                            Marketplace
                        </span>
                    </div>
                </Link>

                {/* --- Navigation Links --- */}
                <nav className="hidden xl:block">
                    <ul className="flex items-center gap-1 list-none p-0 m-0">
                        {[
                            { name: 'Home', id: 'home', path: '/#home' },
                            { name: 'Restaurants', id: 'restaurants', path: '/#restaurant-display' },
                            { name: 'About Us', id: 'about-us', path: '/#about-us' },
                            { name: 'Contact', id: 'contact-us', path: '/#footer' }
                        ].map((item) => (
                            <li key={item.id}>
                                <a
                                    href={item.path}
                                    onClick={() => setMenu(item.id)}
                                    className={`px - 6 py - 3 rounded - 2xl text - sm font - bold transition - all no - underline ${menu === item.id ? "text-[tomato] bg-[#fff0ed]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"} `}
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* --- Search Bar --- */}
                <div className="hidden lg:flex items-center relative flex-1 max-w-[300px] mx-8">
                    <div className="absolute left-4 text-slate-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        value={navSearch}
                        onChange={handleSearch}
                        onKeyDown={handleKeyDown}
                        placeholder="Search dishes or cuisines..."
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-[tomato]/20 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* --- Action Buttons --- */}
                <div className="flex items-center gap-3 md:gap-5">

                    {/* Cart Tool */}
                    <Link to='/cart' className='relative p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-[#fff0ed] hover:text-[tomato] transition-all group'>
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className='absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] bg-[tomato] text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm'>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Area */}
                    {!token ? (
                        <button
                            onClick={() => { setShowLogin(true); setMenu("signin") }}
                            className='bg-[#0f172a] text-white text-sm font-bold px-8 py-3.5 rounded-2xl hover:bg-[tomato] hover:shadow-xl hover:shadow-[tomato]/20 transition-all active:scale-95 hidden md:block'
                        >
                            Sign In
                        </button>
                    ) : (
                        <div className='relative' ref={profileRef}>
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className={`flex items - center gap - 3 p - 1.5 pr - 4 rounded - 2xl border - 2 transition - all ${showProfile ? 'border-[tomato] bg-white shadow-lg' : 'border-transparent bg-slate-50 hover:border-slate-200'} `}
                            >
                                <div className='w-10 h-10 rounded-xl shadow-sm flex items-center justify-center overflow-hidden shrink-0'>
                                    {userData?.image ? (
                                        <img src={`${url} /images/${userData.image} `} alt={userData.name} className='w-full h-full object-cover' />
                                    ) : (
                                        <div className='w-full h-full bg-gradient-to-br from-[#ff6347] to-[#ff4500] flex items-center justify-center text-white text-xs font-black'>
                                            {getInitials(userData?.name)}
                                        </div>
                                    )}
                                </div>
                                <div className='hidden sm:flex flex-col items-start leading-[1.2]'>
                                    <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Welcome</span>
                                    <span className='text-xs font-black text-slate-900 truncate max-w-[100px]'>{userData?.name?.split(' ')[0] || 'User'}</span>
                                </div>
                                <ChevronDown size={14} className={`text - slate - 400 transition - transform duration - 300 ${showProfile ? 'rotate-180' : ''} `} />
                            </button>

                            {/* Dropdown Menu - EXACTLY LIKE ADMIN STYLE */}
                            {showProfile && (
                                <div className='absolute right-0 top-[calc(100%+12px)] w-64 bg-white rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-slate-100 p-2.5 z-[200] animate-fadeInDown'>
                                    {/* Profile Summary Header */}
                                    <div className='flex items-center gap-3.5 p-4 bg-gradient-to-br from-[tomato]/5 to-transparent rounded-[20px] mb-2'>
                                        <div className='w-12 h-12 rounded-2xl overflow-hidden shadow-sm flex-shrink-0'>
                                            {userData?.image ? (
                                                <img src={`${url} /images/${userData.image} `} alt={userData.name} className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='w-full h-full bg-gradient-to-br from-[#ff6347] to-[#ff4500] flex items-center justify-center text-white text-sm font-black'>
                                                    {getInitials(userData?.name)}
                                                </div>
                                            )}
                                        </div>
                                        <div className='min-w-0'>
                                            <p className='text-sm font-black text-slate-900 truncate m-0'>{userData?.name || 'User'}</p>
                                            <p className='text-[11px] text-slate-400 font-semibold truncate mt-0.5'>{userData?.email || ''}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <button onClick={() => { navigate('/profile'); setShowProfile(false); }} className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 text-[13px] font-bold text-left transition-colors'>
                                            <User size={18} className='text-[tomato]' />
                                            My Identity
                                        </button>
                                        <button onClick={() => { navigate('/my-orders'); setShowProfile(false); }} className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 text-[13px] font-bold text-left transition-colors'>
                                            <ShoppingCart size={18} className='text-blue-500' />
                                            Order History
                                        </button>
                                    </div>

                                    <div className='h-px bg-slate-100 my-2 mx-3'></div>

                                    <button onClick={logout} className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 text-red-500 text-[13px] font-extrabold text-left transition-colors'>
                                        <LogOut size={18} />
                                        Secure Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-900 focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* --- Mobile Nav Overlay --- */}
            <div className={`lg:hidden fixed inset - 0 bg - white z - [110] transition - transform duration - 500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} `}>
                <div className='p-8 pt-24 h-full flex flex-col gap-10'>
                    <div className='flex flex-col gap-8'>
                        {[
                            { name: 'Home', id: 'home', path: '/#home' },
                            { name: 'Featured Restaurants', id: 'restaurants', path: '/#restaurant-display' },
                            { name: 'Our Story', id: 'about-us', path: '/#about-us' },
                            { name: 'Contact Us', id: 'contact-us', path: '/#footer' }
                        ].map((item) => (
                            <a
                                key={item.id}
                                href={item.path}
                                onClick={() => { setMenu(item.id); setIsMenuOpen(false); }}
                                className={`text - 3xl font - black no - underline tracking - tighter ${menu === item.id ? "text-[tomato]" : "text-slate-900"} `}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <div className='mt-auto flex flex-col gap-4'>
                        {!token ? (
                            <button
                                onClick={() => { setShowLogin(true); setMenu("signin"); setIsMenuOpen(false); }}
                                className='w-full py-5 bg-[tomato] text-white font-black rounded-3xl text-lg shadow-xl shadow-[tomato]/20'
                            >
                                Get Started
                            </button>
                        ) : (
                            <div className='flex flex-col gap-4'>
                                {/* Mobile User Info */}
                                <div className='flex items-center gap-4 pb-6 mb-2 border-b border-slate-100'>
                                    <div className='w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0'>
                                        {userData?.image ? (
                                            <img src={`${url} /images/${userData.image} `} alt={userData.name} className='w-full h-full object-cover' />
                                        ) : (
                                            <div className='w-full h-full bg-gradient-to-br from-[#ff6347] to-[#ff4500] flex items-center justify-center text-white text-lg font-black'>
                                                {getInitials(userData?.name)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className='text-lg font-black text-slate-900'>{userData?.name || 'User'}</p>
                                        <p className='text-xs text-slate-400 font-medium'>{userData?.email || ''}</p>
                                    </div>
                                </div>
                                <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} className='flex items-center gap-4 text-slate-900 text-2xl font-black no-underline'><User size={28} className='text-[tomato]' /> My Profile</button>
                                <button onClick={() => { navigate('/my-orders'); setIsMenuOpen(false); }} className='flex items-center gap-4 text-slate-900 text-2xl font-black no-underline'><ShoppingCart size={28} className='text-blue-500' /> Live Orders</button>
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className='flex items-center gap-4 text-slate-400 text-xl font-bold'><LogOut size={24} /> Log Out</button>
                            </div>
                        )}
                        <p className='text-center text-slate-300 text-xs font-bold uppercase tracking-widest pt-8 border-t'>© 2026 YumGo Delivery</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

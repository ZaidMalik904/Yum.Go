import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ShoppingCart, LogOut, User, Menu, X, ChevronDown, Search } from 'lucide-react';
import { assets } from '../assets/assets';

const Navbar = ({ setShowLogin }) => {
    const { getTotalCartAmount, token, setToken, menu, setMenu, cartItems, setSearchQuery } = useContext(StoreContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navSearch, setNavSearch] = useState("");

    const handleSearch = (e) => {
        setNavSearch(e.target.value);
        setSearchQuery(e.target.value);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    const cartCount = Object.values(cartItems || {}).reduce((a, b) => a + b, 0);

    return (
        <header className="sticky top-0 z-[100] bg-white border-b border-slate-100">
            <div className="max-w-[1440px] mx-auto px-6 md:px-[5vw] h-20 md:h-24 flex justify-between items-center">

                {/* --- Logo Area --- */}
                <Link to='/'
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                    onClick={() => setMenu("home")}
                >
                    <div
                        style={{
                            width: 38, height: 38,
                            background: 'linear-gradient(135deg, #ff6347 0%, #ff4500 100%)',
                            borderRadius: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 20px rgba(255,99,71,0.3)',
                            flexShrink: 0,
                        }}
                    >
                        <img src={assets.logo} alt="logo" style={{ width: 22, height: 22, objectFit: 'contain', border: 0, display: 'block' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px' }}>
                            YumGo<span style={{ color: '#ff6347' }}>.</span>
                        </span>
                        <span style={{ fontSize: 8, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase' }}>
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
                                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all no-underline ${menu === item.id ? "text-[tomato] bg-[#fff0ed]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
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
                        <div className='relative group hidden md:block'>
                            <button className='flex items-center gap-3 p-2 pr-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all'>
                                <div className='w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[tomato]'>
                                    <User size={20} />
                                </div>
                                <div className='flex flex-col items-start'>
                                    <span className='text-[10px] text-slate-400 font-bold uppercase tracking-widest'>Profile</span>
                                    <ChevronDown size={14} className='text-slate-600 transition-transform group-hover:rotate-180' />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <div className='absolute right-0 top-full mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0'>
                                <button onClick={() => navigate('/my-orders')} className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 text-slate-600 text-sm font-bold text-left'>
                                    <ShoppingCart size={18} className='text-blue-500' />
                                    My Orders
                                </button>
                                <div className='h-px bg-slate-100 my-1 mx-4'></div>
                                <button onClick={logout} className='w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#fff0ed] text-slate-600 hover:text-[tomato] text-sm font-bold text-left'>
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
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
            <div className={`lg:hidden fixed inset-0 bg-white z-[110] transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                                className={`text-3xl font-black no-underline tracking-tighter ${menu === item.id ? "text-[tomato]" : "text-slate-900"}`}
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

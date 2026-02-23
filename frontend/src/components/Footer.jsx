import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
    return (
        <footer className='bg-[#fcfdfd] border-t border-slate-100 pt-20 pb-10 px-6 md:px-[5vw]' id='footer'>
            <div className='max-w-[1440px] mx-auto'>

                {/* --- Main Grid --- */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16'>

                    {/* Brand Description */}
                    <div className='flex flex-col gap-6'>
                        <Link to='/' className='flex items-center gap-3 no-underline'>
                            <div className='w-10 h-10 bg-[tomato] rounded-xl flex items-center justify-center shadow-lg shadow-[tomato]/20 p-2'>
                                <img src={assets.logo} alt="logo" className="w-full h-full object-contain" />
                            </div>
                            <span className='text-2xl font-black text-[#0f172a] tracking-tighter'>
                                YumGo<span className='text-[tomato]'>.</span>
                            </span>
                        </Link>
                        <p className='text-slate-500 text-sm leading-relaxed font-medium'>
                            Our mission is to bridge the gap between world-class culinary talent and food lovers across the city. Experience the next generation of food delivery.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex justify-center items-center hover:bg-[tomato] hover:text-white transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Menu */}
                    <div className='flex flex-col gap-6'>
                        <h4 className='text-[#0f172a] font-black text-sm uppercase tracking-widest'>Navigation</h4>
                        <ul className='flex flex-col gap-4 list-none p-0 m-0'>
                            <li><a href="/#home" className='text-slate-500 hover:text-[tomato] no-underline text-sm font-bold transition-colors'>Home</a></li>
                            <li><a href="/#restaurant-display" className='text-slate-500 hover:text-[tomato] no-underline text-sm font-bold transition-colors'>Restaurants</a></li>
                            <li><a href="/#about-us" className='text-slate-500 hover:text-[tomato] no-underline text-sm font-bold transition-colors'>About YumGo</a></li>
                            <li><Link to='/privacy' className='text-slate-500 hover:text-[tomato] no-underline text-sm font-bold transition-colors'>Privacy Policy</Link></li>
                            <li><Link to='/support' className='text-slate-500 hover:text-[tomato] no-underline text-sm font-bold transition-colors'>Support Center</Link></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div className='flex flex-col gap-6'>
                        <h4 className='text-[#0f172a] font-black text-sm uppercase tracking-widest'>Contact Support</h4>
                        <ul className='flex flex-col gap-4 list-none p-0 m-0'>
                            <li className='flex items-center gap-3 text-slate-500 text-sm font-bold'>
                                <Phone size={16} className='text-[tomato]' />
                                +91 9876543210
                            </li>
                            <li className='flex items-center gap-3 text-slate-500 text-sm font-bold'>
                                <Mail size={16} className='text-[tomato]' />
                                YumGoCustomer@gmail.com
                            </li>
                            <li className='flex items-start gap-3 text-slate-500 text-sm font-bold'>
                                <MapPin size={16} className='text-[tomato] flex-shrink-0' />
                                Sector 75, Noida, UP India
                            </li>
                        </ul>
                    </div>

                    {/* App Links (Visual only for project) */}
                    <div className='flex flex-col gap-6'>
                        <h4 className='text-[#0f172a] font-black text-sm uppercase tracking-widest'>Experience Mobile</h4>
                        <p className='text-slate-400 text-xs font-medium'>Get the full YumGo experience on your mobile device.</p>
                        <div className='flex flex-col gap-3'>
                            <div className='bg-[#0f172a] p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors'>
                                <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white'>
                                    <ExternalLink size={16} />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-white font-black text-xs leading-none'>Download on</span>
                                    <span className='text-slate-400 text-[10px] font-bold'>App Store</span>
                                </div>
                            </div>
                            <div className='bg-[#0f172a] p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors'>
                                <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white'>
                                    <ExternalLink size={16} />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-white font-black text-xs leading-none'>Get it on</span>
                                    <span className='text-slate-400 text-[10px] font-bold'>Google Play</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Bar --- */}
                <div className='pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6'>
                    <p className='text-slate-400 text-xs font-bold uppercase tracking-[0.1em] m-0'>
                        © 2026 YumGo.com - All Rights Reserved.
                    </p>
                    <div className='flex items-center gap-6'>
                        <span className='text-slate-300 font-bold text-[10px] uppercase'>BCA Final Project</span>
                        <div className='h-4 w-[1px] bg-slate-100 hidden sm:block'></div>
                        <span className='text-slate-300 font-bold text-[10px] uppercase tracking-widest'>v2.0 Stable</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useContext, useState } from 'react'
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react'
import { StoreContext } from '../context/StoreContext'

const Header = () => {
    const { setSearchQuery } = useContext(StoreContext);
    const [headerSearch, setHeaderSearch] = useState("");

    const handleSearch = (e) => {
        setHeaderSearch(e.target.value);
        setSearchQuery(e.target.value);
    }

    return (
        <div className='header relative h-[60vh] md:h-[42vw] my-6 md:my-10 mx-4 md:mx-[5vw] rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl group' id='home'>
            {/* --- Premium Background Layer --- */}
            <div className='absolute inset-0 transition-transform duration-[10s] group-hover:scale-110'>
                <img
                    src="/header_img.png"
                    alt="Hero Background"
                    className='w-full h-full object-cover'
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/40 to-transparent"></div>
            </div>

            {/* --- Hero Content --- */}
            <div className="header-contents absolute inset-0 flex flex-col items-center md:items-start justify-center gap-5 md:gap-6 px-6 md:px-[6vw] text-center md:text-left z-10 animate-fadeIn">

                {/* Trust Badge */}
                <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 animate-slideDown'>
                    <Star size={12} className='text-yellow-400' fill='currentColor' />
                    <span className='text-white/90 text-[9px] md:text-xs font-black uppercase tracking-[0.15em]'>India's Premier Food Logistics</span>
                </div>

                <h1 className='font-black text-white text-3xl md:text-[5.5vw] font-outfit leading-[1.1] md:leading-[0.95] tracking-tighter drop-shadow-2xl'>
                    Culinary Excellence <br className='hidden md:block' />
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-[tomato] to-[#ff4500]'>At Your Doorstep.</span>
                </h1>

                <p className='text-white/80 text-xs md:text-[1.3vw] font-medium max-w-[500px] leading-relaxed drop-shadow-lg opacity-0 animate-fadeIn' style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                    Access an exclusive directory of Michelin-standard restaurants. Precision preparation, lightning-fast delivery.
                </p>

                <div className='flex flex-col sm:flex-row items-center gap-4 mt-2 w-full max-w-[600px] opacity-0 animate-fadeIn' style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                    <div className='relative flex-1 w-full'>
                        <div className='absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-[tomato]'>
                            <ArrowRight size={18} />
                        </div>
                        <input
                            type="text"
                            value={headerSearch}
                            onChange={handleSearch}
                            placeholder='Search a dish...'
                            className='w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-[20px] md:rounded-[24px] py-4 md:py-5 px-12 md:px-14 outline-none focus:ring-2 focus:ring-[tomato]/30 transition-all font-medium placeholder:text-white/40 text-sm'
                        />
                        <button
                            className='absolute right-2 top-1/2 -translate-y-1/2 bg-[tomato] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-[15px] md:rounded-[18px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#ff4500] transition-colors'
                            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                        >
                            Find
                        </button>
                    </div>
                </div>

                <div className='flex items-center -space-x-3'>
                    {[1, 2, 3, 4].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/100?u=header${i}`} className='w-10 h-10 rounded-full border-2 border-[#0f172a] shadow-lg' alt="User" />
                    ))}
                    <div className='pl-6 text-white/70'>
                        <p className='text-xs font-black m-0'>5.0 Rating</p>
                        <p className='text-[10px] uppercase font-bold tracking-widest'>From 20k+ Users</p>
                    </div>
                </div>

                {/* --- Bottom Feature Tags --- */}
                <div className='flex flex-wrap items-center gap-8 mt-4 pt-8 border-t border-white/10 opacity-0 animate-fadeIn' style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                    <div className='flex items-center gap-3 text-white/60'>
                        <ShieldCheck size={20} className='text-[tomato]' />
                        <span className='text-[10px] font-black uppercase tracking-widest'>Verified Vendors</span>
                    </div>
                    <div className='flex items-center gap-3 text-white/60'>
                        <Zap size={20} className='text-yellow-400' />
                        <span className='text-[10px] font-black uppercase tracking-widest'>Contactless Logistics</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header

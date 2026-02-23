import React from 'react'
import { CheckCircle2, Award, Users, Globe, Target, Heart } from 'lucide-react'

const AboutUs = () => {
    return (
        <div className='about-us py-24 px-[5vw] bg-white' id='about-us'>
            {/* --- Section Header --- */}
            <div className='flex flex-col items-center text-center mb-20'>
                <div className='flex items-center gap-2 mb-4'>
                    <span className='w-12 h-[2px] bg-[tomato]'></span>
                    <span className='text-[tomato] font-black text-xs uppercase tracking-[0.3em]'>Our Philosophy</span>
                    <span className='w-12 h-[2px] bg-[tomato]'></span>
                </div>
                <h2 className='text-[#0f172a] font-black text-4xl md:text-6xl tracking-tighter leading-tight max-w-3xl'>
                    Redefining the Future of <br className='hidden md:block' /> <span className='italic font-light text-slate-400'>Culinary Convenience.</span>
                </h2>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>

                {/* --- Left Block: Value Proposition --- */}
                <div className='flex flex-col gap-10 animate-fadeIn'>
                    <div className='flex flex-col gap-4'>
                        <h3 className='text-2xl font-black text-[#0f172a] flex items-center gap-3'>
                            <Target className='text-[tomato]' size={28} />
                            The Marketplace Mission
                        </h3>
                        <p className='text-slate-500 text-lg leading-relaxed font-medium'>
                            At <span className='text-[#0f172a] font-black italic underline decoration-[tomato] decoration-4 underline-offset-4'>YumGo.</span>, we don't just deliver food; we bridge the gap between world-class kitchens and your dining table. Our platform is engineered to empower local vendors while providing consumers with an uncompromised service standard.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        {[
                            { icon: Award, title: "Quality First", desc: "Every partner is manually vetted for hygiene and taste standards." },
                            { icon: Users, title: "Unified Community", desc: "Supporting 500+ local businesses through digital transformation." },
                            { icon: Globe, title: "City-Wide Reach", desc: "Expanding fast across 12 major hubs with localized logistics." },
                            { icon: Heart, title: "User Centric", desc: "24/7 support dedicated to resolving every query within 15 minutes." }
                        ].map((feature, i) => (
                            <div key={i} className='p-6 rounded-[32px] bg-[#fcfdfe] border border-slate-100 hover:border-[tomato]/20 hover:shadow-xl hover:shadow-[tomato]/5 transition-all duration-300 group'>
                                <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-[tomato] transition-colors'>
                                    <feature.icon size={22} className='text-[tomato] group-hover:text-white transition-colors' />
                                </div>
                                <h4 className='font-black text-[#0f172a] text-sm uppercase tracking-wider mb-2'>{feature.title}</h4>
                                <p className='text-xs text-slate-400 leading-relaxed font-bold'>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Right Block: Visual & Stats --- */}
                <div className='relative overflow-hidden lg:overflow-visible'>
                    <div className='absolute -top-10 -right-10 w-64 h-64 bg-[tomato]/5 rounded-full blur-3xl -z-10'></div>
                    <div className='absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10'></div>

                    <div className='relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-white'>
                        <img
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                            alt="Marketplace Operations"
                            className='w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent'></div>

                        {/* Interactive Floating Stat */}
                        <div className='absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/20 flex justify-between items-center about-visual-stats'>
                            <div className='flex flex-col'>
                                <span className='text-white font-black text-4xl leading-none tracking-tighter'>98.2%</span>
                                <span className='text-[tomato] text-[10px] font-black uppercase tracking-[0.2em] mt-2'>On-Time Logistics</span>
                            </div>
                            <div className='h-12 w-px bg-white/20'></div>
                            <div className='flex flex-col items-end'>
                                <span className='text-white font-black text-4xl leading-none tracking-tighter'>4.9/5</span>
                                <span className='text-[tomato] text-[10px] font-black uppercase tracking-[0.2em] mt-2'>Customer Satisfaction</span>
                            </div>
                        </div>
                    </div>

                    {/* Verified Certificate Badge */}
                    <div className='absolute -top-6 -right-6 bg-white p-5 rounded-full shadow-2xl animate-pulse'>
                        <div className='bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white'>
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Core Values Bar --- */}
            <div className='mt-24 pt-16 border-t border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-10 opacity-60'>
                {["Premium Ingredient Sourcing", "Eco-Conscious Logistics", "Certified Partner Network", "Precision Real-Time Analytics"].map((v, i) => (
                    <div key={i} className='flex items-center gap-3 justify-center text-center'>
                        <div className='w-1.5 h-1.5 rounded-full bg-[tomato] flex-shrink-0'></div>
                        <span className='font-black text-[10px] text-[#0f172a] uppercase tracking-[0.2em]'>{v}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AboutUs

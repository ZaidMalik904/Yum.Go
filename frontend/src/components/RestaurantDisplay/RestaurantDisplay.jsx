import React, { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Star, ArrowRight, ShieldCheck, Zap, UtensilsCrossed } from 'lucide-react'

const COLLECTIONS = [
    { name: "Gourmet Dining", icon: "💎", desc: "Top-rated premium experiences", color: "#6366f1" },
    { name: "Express Delivery", icon: "🚀", desc: "Under 30 mins delivery", color: "#f59e0b" },
    { name: "Healthy Eats", icon: "🥗", desc: "Organic & nutritious meals", color: "#10b981" },
    { name: "Global Flavors", icon: "🌍", desc: "Authentic international cuisines", color: "#ec4899" }
];



const RestaurantCard = ({ item, url, navigate }) => {
    const isApproved = item.isApproved === true;
    return (
        <div
            onClick={() => isApproved ? navigate(`/restaurant/${item._id}`) : null}
            className={`group relative bg-white rounded-[32px] overflow-hidden transition-all duration-500 shadow-premium hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] ${isApproved ? 'hover:-translate-y-3 cursor-pointer' : 'opacity-80 grayscale cursor-not-allowed'} animate-fadeInScale`}
        >
            {/* Image Core */}
            <div className='relative h-[240px] overflow-hidden'>
                <img
                    className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                    src={url + "/images/" + item.image}
                    alt={item.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/f8fafc/ff6347?text=" + item.name;
                    }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent opacity-60'></div>

                {/* Status Badges */}
                <div className='absolute top-5 left-5 flex flex-col gap-2'>
                    {item.rating >= 4.5 && (
                        <div className='bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg'>
                            <UtensilsCrossed size={12} className='text-[tomato]' />
                            <span className='font-black text-[10px] text-slate-800 uppercase tracking-widest'>Michelin Standard</span>
                        </div>
                    )}
                    <div className='bg-[#0f172a]/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg'>
                        <Zap size={12} className='text-[#fbbf24]' />
                        <span className='font-black text-[10px] text-white uppercase tracking-widest'>Fast Track</span>
                    </div>
                </div>

                <div className='absolute bottom-5 right-5 bg-white px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-xl'>
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span className='font-black text-slate-900 text-sm'>{item.rating || "4.5"}</span>
                </div>
            </div>

            {/* Info Block */}
            <div className='p-7'>
                <div className='flex flex-col gap-2 mb-4'>
                    <div className='flex items-center gap-2'>
                        <ShieldCheck size={14} className='text-blue-500' />
                        <span className='text-blue-600/80 text-[10px] font-black uppercase tracking-widest'>Verified Boutique</span>
                    </div>
                    <h3 className='text-2xl font-black text-[#0f172a] tracking-tight group-hover:text-[tomato] transition-colors'>
                        {item.name}
                    </h3>
                    <p className='text-slate-400 text-sm font-medium line-clamp-2 h-10 leading-relaxed'>
                        {item.description || "Indulge in a curated selection of gourmet flavors, prepared with the freshest local ingredients."}
                    </p>
                </div>

                <div className='flex items-center justify-between pt-5 border-t border-slate-50'>
                    <div className='flex flex-col'>
                        <span className='text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1'>Location</span>
                        <div className='flex items-center gap-1.5'>
                            <MapPin size={12} className='text-[tomato]' />
                            <span className='text-xs font-bold text-slate-600 truncate max-w-[120px]'>{item.address.split(',')[0]}</span>
                        </div>
                    </div>
                    <div className='flex flex-col items-end'>
                        <span className='text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1'>Est. Time</span>
                        <div className='flex items-center gap-1.5'>
                            <Clock size={12} className='text-slate-400' />
                            <span className='text-xs font-black text-slate-800'>25-35 MIN</span>
                        </div>
                    </div>
                </div>

                <button className='w-full mt-6 py-4 bg-slate-50 group-hover:bg-[tomato] rounded-2xl flex items-center justify-center gap-2 transition-all duration-300'>
                    <span className='text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white'>View Executive Menu</span>
                    <ArrowRight size={14} className='text-slate-300 group-hover:text-white transform group-hover:translate-x-1 transition-transform' />
                </button>
            </div>
        </div>
    );
};

const RestaurantDisplay = () => {
    const { restaurant_list, food_list, url, searchQuery } = useContext(StoreContext);
    const [selectedCollection, setSelectedCollection] = useState("All");
    const navigate = useNavigate();

    if (!restaurant_list || restaurant_list.length === 0) {
        return (
            <div className='restaurant-display px-[5vw] py-10' id='restaurant-display'>
                <div className='flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200 shadow-sm'>
                    <div className='w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6'>🍽️</div>
                    <h2 className='text-2xl font-black text-slate-800 tracking-tight'>Establishing Connection...</h2>
                    <p className='text-slate-500 mt-2 text-center max-w-sm font-medium'>We're syncing with our gourmet partners. The finest cuisines in the city will be visible shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='restaurant-display px-[5vw] py-16 bg-[#fcfdfe]' id='restaurant-display'>

            {/* --- Professional Header Section --- */}
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12'>
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-2'>
                        <span className='w-8 h-[2px] bg-[tomato]'></span>
                        <span className='text-[tomato] font-black text-xs uppercase tracking-[0.2em]'>Premium Marketplace</span>
                    </div>
                    <h2 className='text-[#0f172a] font-black text-3xl md:text-6xl tracking-tighter leading-[0.9]'>
                        Discover Your <br /> <span className='text-transparent bg-clip-text bg-gradient-to-r from-[tomato] to-[#ff4500]'>Next Favorite.</span>
                    </h2>
                    <p className='text-slate-400 font-medium text-sm md:text-lg max-w-md mt-2'>
                        Curated collection of the city's most prestigious culinary destinations.
                    </p>
                </div>

                <div className='flex gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar'>
                    {COLLECTIONS.map((c, i) => (
                        <div
                            key={i}
                            className={`min-w-[180px] p-5 rounded-[28px] border-2 transition-all duration-300 cursor-pointer group ${selectedCollection === c.name ? 'border-[tomato] bg-white shadow-xl shadow-[tomato]/5' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'}`}
                            onClick={() => setSelectedCollection(c.name === selectedCollection ? "All" : c.name)}
                        >
                            <div className='text-2xl mb-3 transform group-hover:scale-110 transition-transform'>{c.icon}</div>
                            <h4 className='font-black text-slate-800 text-sm mb-1'>{c.name}</h4>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>{c.desc}</p>
                        </div>
                    ))}
                </div>
            </div>



            {/* --- Restaurant Grid --- */}
            <div className='restaurant-display-list min-h-[400px]'>
                {(() => {
                    const filteredItems = restaurant_list.filter(item => {
                        // Search Filtering
                        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;



                        // Comprehensive Collection Filtering
                        if (selectedCollection !== "All") {
                            if (selectedCollection === "Gourmet Dining" && (item.rating || 0) < 4.5) return false;
                            if (selectedCollection === "Express Delivery" && (item.rating || 0) < 4.0) return false;
                        }

                        return true;
                    });

                    if (filteredItems.length === 0) {
                        return (
                            <div className='flex flex-col items-center justify-center py-20 w-full col-span-full opacity-0 animate-fadeIn'>
                                <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner'>🔍</div>
                                <h3 className='text-3xl font-black text-slate-800 tracking-tight'>No Results for "{searchQuery || selectedCollection}"</h3>
                                <p className='text-slate-400 mt-3 text-center max-w-sm font-medium'>
                                    We couldn't find any culinary partners matching your criteria. Try adjusting your search query or exploring different categories.
                                </p>
                                <button
                                    onClick={() => { setSelectedCollection("All"); setSearchQuery(""); }}
                                    className='mt-8 text-[tomato] font-black uppercase text-xs tracking-widest hover:underline'
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )
                    }

                    return (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12'>
                            {filteredItems.map((item, index) => (
                                <RestaurantCard key={index} item={item} url={url} navigate={navigate} />
                            ))}
                        </div>
                    )
                })()}
            </div>

            {/* --- Stats Footer --- */}
            <div className='mt-20 p-10 bg-[#0f172a] rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl stats-footer'>
                <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl'></div>
                <div className='z-10'>
                    <h3 className='text-white font-black text-3xl mb-2'>Join our gourmet community?</h3>
                    <p className='text-slate-400 font-medium'>Over 5,000+ daily orders processed across 12 cities.</p>
                </div>
                <div className='flex gap-8 z-10'>
                    <div className='flex flex-col items-center'>
                        <span className='text-white font-black text-4xl mb-1'>50+</span>
                        <span className='text-[#ff6347] text-[10px] font-black uppercase tracking-widest'>Vendors</span>
                    </div>
                    <div className='w-px h-12 bg-white/10'></div>
                    <div className='flex flex-col items-center'>
                        <span className='text-white font-black text-4xl mb-1'>1.2k</span>
                        <span className='text-[#ff6347] text-[10px] font-black uppercase tracking-widest'>Loyal Users</span>
                    </div>
                    <div className='w-px h-12 bg-white/10'></div>
                    <div className='flex flex-col items-center'>
                        <span className='text-white font-black text-4xl mb-1'>24/7</span>
                        <span className='text-[#ff6347] text-[10px] font-black uppercase tracking-widest'>Support</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantDisplay

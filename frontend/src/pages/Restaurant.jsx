import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'
import FoodItem from '../components/FoodItem'
import { assets } from '../assets/assets'
import { MapPin, Phone, Mail, ChevronLeft } from 'lucide-react'

const Restaurant = ({ setShowLogin }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { restaurant_list, food_list, url, searchQuery } = useContext(StoreContext);
    const [restaurant, setRestaurant] = useState(null);
    const [category, setCategory] = useState("All");
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (restaurant_list.length > 0) {
            const found = restaurant_list.find(r => r._id === id);
            if (found) {
                setRestaurant(found);
            }
        }
    }, [id, restaurant_list]);

    if (!restaurant) {
        return (
            <div className='min-h-[60vh] flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[tomato]'></div>
            </div>
        );
    }


    const restaurantFoods = food_list.filter(food =>
        food.restaurantId === id &&
        (category === "All" || food.category === category) &&
        (!searchQuery || food.name.toLowerCase().includes(searchQuery.toLowerCase()) || food.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Get unique categories for this restaurant
    const restaurantCategories = ["All", ...new Set(food_list.filter(f => f.restaurantId === id).map(f => f.category))];

    const displayFoods = expanded ? restaurantFoods : restaurantFoods.slice(0, 4);

    return (
        <div className='restaurant-profile animate-fadeIn bg-[#fcfdfe] relative overflow-hidden'>
            {/* Decorative Background Elements */}
            <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-[tomato]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10'></div>
            <div className='absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4 -z-10'></div>

            {/* Hero Section */}
            <div className='relative h-[350px] md:h-[500px] w-full'>
                {/* Float Action Button: Back to Home */}
                <button
                    onClick={() => navigate(-1)}
                    className='absolute top-8 left-[5vw] z-50 flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-widest hover:bg-[tomato] hover:border-[tomato] transition-all duration-300 shadow-2xl active:scale-95 group'
                >
                    <ChevronLeft size={16} className='group-hover:-translate-x-1 transition-transform' />
                    Return to Portal
                </button>

                <img
                    src={url + "/images/" + restaurant.image}
                    alt={restaurant.name}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/1200x600/262626/ffffff?text=" + restaurant.name;
                    }}
                />
                {/* Professional Layered Gradients */}
                <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0f172a] opacity-90'></div>
                <div className='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0f172a] to-transparent'></div>

                <div className='absolute bottom-0 left-0 right-0 px-[5vw] pb-12 text-white'>
                    <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
                        <div>
                            <div className='flex items-center gap-3 mb-2'>
                                <span className='bg-[tomato] text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider'>Selected Partner</span>
                                <div className='flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1 rounded-lg text-xs font-bold'>
                                    <span>★</span> {restaurant.rating || "4.5"}
                                </div>
                            </div>
                            <h1 className='text-4xl md:text-6xl font-black tracking-tight'>{restaurant.name}</h1>
                            <p className='text-gray-300 mt-3 max-w-2xl text-lg font-medium'>{restaurant.description || "Indulge in the finest flavours and premium dining experience."}</p>
                        </div>
                        {/* --- Logistics Intelligence Panel --- */}
                        <div className='flex flex-col gap-5 bg-[#0f172a]/40 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10 min-w-[320px] shadow-2xl'>
                            <div className='flex items-center gap-4 transition-all hover:translate-x-1'>
                                <div className='w-10 h-10 bg-[tomato] rounded-xl flex items-center justify-center shadow-lg shadow-[tomato]/20'>
                                    <MapPin size={18} className='text-white' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[10px] text-white/40 font-black uppercase tracking-widest'>Primary Hub</span>
                                    <span className='text-sm font-bold text-white/90 truncate max-w-[200px]'>{restaurant.address}</span>
                                </div>
                            </div>

                            <div className='flex items-center gap-4 transition-all hover:translate-x-1'>
                                <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10'>
                                    <Phone size={18} className='text-yellow-400' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[10px] text-white/40 font-black uppercase tracking-widest'>Direct Interface</span>
                                    <span className='text-sm font-bold text-white/90'>{restaurant.phone}</span>
                                </div>
                            </div>

                            <div className='flex items-center gap-4 transition-all hover:translate-x-1'>
                                <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10'>
                                    <Mail size={18} className='text-blue-400' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[10px] text-white/40 font-black uppercase tracking-widest'>Support Protocol</span>
                                    <span className='text-sm font-bold text-white/90 truncate max-w-[200px]'>{restaurant.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className='px-[5vw] py-16 bg-[#fcfcfc]'>
                <div className='flex flex-col md:flex-row justify-between items-center mb-12 gap-8'>
                    <div>
                        <h2 className='text-3xl md:text-4xl font-black text-[#262626] tracking-tight'>Available Menu</h2>
                        <div className='w-20 h-1.5 bg-[tomato] rounded-full mt-2'></div>
                    </div>

                    {/* Category Filter */}
                    <div className='flex gap-4 overflow-x-auto no-scrollbar py-2 max-w-full'>
                        {restaurantCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setCategory(cat); setExpanded(false); }}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${category === cat ? 'bg-[tomato] text-white shadow-lg shadow-[tomato]/30 scale-105' : 'bg-white text-gray-500 border border-gray-100 hover:border-[tomato]/30 hover:scale-105'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {restaurantFoods.length === 0 ? (
                    <div className='py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100'>
                        <p className='text-xl font-bold text-gray-400 font-["Outfit"]'>Restocking our pantry. Stay tuned!</p>
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12 animate-fadeIn'>
                            {displayFoods.map((item, index) => (
                                <FoodItem
                                    key={index}
                                    id={item._id}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    image={item.image}
                                    setShowLogin={setShowLogin}
                                />
                            ))}
                        </div>

                        {restaurantFoods.length > 4 && (
                            <div className='flex justify-center mt-16'>
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className='group flex items-center gap-3 bg-[#0f172a] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[tomato] transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95'
                                >
                                    {expanded ? "Show Less Selection" : `Explore ${restaurantFoods.length - 4} More Delicacies`}
                                    <div className={`transition-transform duration-300 ${expanded ? 'rotate-180' : 'group-hover:translate-y-1'}`}>
                                        ▼
                                    </div>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Why Choose Us Section */}
            <div className='px-[5vw] py-20 bg-white border-t border-gray-50'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 text-center'>
                    <div className='p-8 rounded-[32px] bg-gray-50 hover:bg-[#fff0ed] transition-colors duration-500 group'>
                        <div className='text-4xl mb-4 group-hover:scale-110 transition-transform'>🚀</div>
                        <h3 className='text-xl font-black text-[#262626] mb-3'>Fast Delivery</h3>
                        <p className='text-gray-500 text-sm font-medium'>We ensure your food arrives hot and fresh in under 30 minutes.</p>
                    </div>
                    <div className='p-8 rounded-[32px] bg-gray-50 hover:bg-[#fff0ed] transition-colors duration-500 group'>
                        <div className='text-4xl mb-4 group-hover:scale-110 transition-transform'>🥗</div>
                        <h3 className='text-xl font-black text-[#262626] mb-3'>Quality Ingredients</h3>
                        <p className='text-gray-500 text-sm font-medium'>Only the freshest organic ingredients sourced from local partners.</p>
                    </div>
                    <div className='p-8 rounded-[32px] bg-gray-50 hover:bg-[#fff0ed] transition-colors duration-500 group'>
                        <div className='text-4xl mb-4 group-hover:scale-110 transition-transform'>🛡️</div>
                        <h3 className='text-xl font-black text-[#262626] mb-3'>Secure Packing</h3>
                        <p className='text-gray-500 text-sm font-medium'>Our eco-friendly packaging keeps your food safe and presentable.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Restaurant

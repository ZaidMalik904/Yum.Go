import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'
import { Plus, Minus, ShoppingBag, Star } from 'lucide-react'

const FoodItem = ({ id, name, price, description, image, setShowLogin }) => {

    const { cartItems, addToCart, removeFromCart, token, url } = useContext(StoreContext);

    const handleAddToCart = (id) => {
        if (!token) {
            setShowLogin(true);
        } else {
            addToCart(id);
        }
    }

    const handleRate = async () => {
        if (!token) return setShowLogin(true);
        const rating = prompt("Enter rating (1-5):", "5");
        const comment = prompt("Enter your comment:", "Delicious!");

        if (rating && comment) {
            try {
                const response = await axios.post(url + "/api/review/add", {
                    foodId: id,
                    userId: "auto", // Backend auth middleware will fix this, but passing placeholder
                    rating: Number(rating),
                    comment: comment
                }, { headers: { token } });

                if (response.data.success) {
                    alert("Thank you for your rating!");
                }
            } catch (error) {
                console.error("Review error:", error);
            }
        }
    }

    return (
        <div className='food-item group w-full m-auto rounded-[32px] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 animate-fadeIn'>
            <div className="food-item-img-container relative h-[220px] overflow-hidden rounded-[32px] m-2">
                <img
                    className='food-item-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                    src={url + "/images/" + image}
                    alt={name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/f8fafc/ff6347?text=" + name;
                    }}
                />

                {/* Visual Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                <div
                    onClick={handleRate}
                    className='absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm cursor-pointer hover:bg-[tomato] hover:text-white transition-all group/star'
                >
                    <Star size={10} className='fill-[#fbbf24] stroke-[#fbbf24] group-hover/star:fill-white group-hover/star:stroke-white' />
                    <span className='font-black text-[9px] text-slate-800 group-hover/star:text-white'>4.8</span>
                </div>

                {!cartItems[id] ? (
                    <button
                        onClick={() => handleAddToCart(id)}
                        className='absolute bottom-4 right-4 bg-white hover:bg-[tomato] text-[tomato] hover:text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 active:scale-90 group/btn'
                    >
                        <Plus size={20} className='transform group-hover/btn:rotate-90 transition-transform duration-300' />
                    </button>
                ) : (
                    <div className='absolute bottom-4 right-4 flex items-center gap-3 p-1.5 rounded-2xl bg-white shadow-2xl border border-slate-50'>
                        <button
                            onClick={() => removeFromCart(id)}
                            className='w-8 h-8 flex items-center justify-center text-[tomato] hover:bg-[#fff0ed] rounded-xl transition-colors'
                        >
                            <Minus size={16} />
                        </button>
                        <span className='font-black text-slate-800 text-sm w-4 text-center'>{cartItems[id]}</span>
                        <button
                            onClick={() => handleAddToCart(id)}
                            className='w-8 h-8 flex items-center justify-center text-[#16a34a] hover:bg-[#f0fdf4] rounded-xl transition-colors'
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="food-item-info p-6 pt-2">
                <div className="flex flex-col gap-1 mb-3">
                    <p className='text-[10px] font-black text-slate-300 uppercase tracking-widest'>Executive Collection</p>
                    <h3 className='text-lg font-black text-[#0f172a] leading-tight truncate group-hover:text-[tomato] transition-colors'>{name}</h3>
                </div>

                <p className="food-item-desc text-slate-400 text-xs font-medium line-clamp-2 h-8 leading-relaxed mb-4 italic">
                    {description}
                </p>

                <div className='flex items-center justify-between mt-auto'>
                    <div className='flex flex-col'>
                        <span className='text-[10px] font-black text-slate-300 uppercase tracking-widest'>Price</span>
                        <p className="text-[tomato] text-xl font-black tracking-tighter">${price}</p>
                    </div>
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50 p-2 rounded-xl'>
                        <ShoppingBag size={14} className='text-slate-300' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodItem

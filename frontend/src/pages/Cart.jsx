import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = ({ setShowLogin }) => {
    const { cartItems, food_list, addToCart, removeFromCart, getTotalCartAmount, token, url, applyPromoCode, discount } = useContext(StoreContext);
    const [promoInput, setPromoInput] = React.useState("");
    const navigate = useNavigate();

    const handleApplyPromo = () => {
        const success = applyPromoCode(promoInput);
        if (success) {
            alert("Promo code applied successfully!");
        } else {
            alert("Invalid promo code. Try SAVE20 or SAVE50");
        }
    }

    const handleCheckout = () => {
        if (!token) {
            setShowLogin(true);
        } else {
            navigate('/place-order');
        }
    }

    const cartHasItems = Object.values(cartItems).some(count => count > 0);

    return (
        <div className='cart py-16 md:py-24 px-[5vw] bg-[#fcfdfd] min-h-screen'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-8 md:mb-12'>
                <div className='w-12 h-12 md:w-14 md:h-14 bg-[tomato] rounded-2xl flex items-center justify-center shadow-lg shadow-[tomato]/20'>
                    <ShoppingBag className='text-white' size={24} />
                </div>
                <div>
                    <h1 className='text-3xl md:text-5xl font-black text-[#0f172a] tracking-tighter'>Shopping Cart</h1>
                    <p className='text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-xs mt-1'>Review your selection</p>
                </div>
            </div>

            {!cartHasItems ? (
                <div className='bg-white rounded-[40px] border-2 border-dashed border-slate-100 py-32 flex flex-col items-center justify-center text-center animate-fadeIn'>
                    <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8'>
                        <ShoppingBag size={48} className='text-slate-200' />
                    </div>
                    <h2 className='text-2xl font-black text-[#0f172a]'>Your cart is empty</h2>
                    <p className='text-slate-400 font-medium mt-2 mb-10'>Looks like you haven't added any delicacies yet.</p>
                    <Link to="/#restaurant-display">
                        <button className='bg-[#0f172a] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[tomato] transition-all duration-300 shadow-xl shadow-slate-200'>
                            Explore Restaurants
                        </button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
                    {/* Cart Items List */}
                    <div className='lg:col-span-2 flex flex-col gap-6'>
                        {food_list.map((item, index) => {
                            if (cartItems[item._id] > 0) {
                                return (
                                    <div key={index} className='bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[tomato]/10 transition-all duration-300 group animate-fadeIn'>
                                        <div className='flex flex-col sm:flex-row items-center gap-6'>
                                            <div className='w-32 h-32 bg-slate-50 rounded-3xl overflow-hidden flex-shrink-0 border border-slate-50'>
                                                <img src={url + "/images/" + item.image} alt={item.name} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                                            </div>

                                            <div className='flex-1 flex flex-col gap-2 text-center sm:text-left'>
                                                <span className='text-[tomato] font-black text-[10px] uppercase tracking-[0.2em]'>{item.category}</span>
                                                <h3 className='text-xl font-black text-[#0f172a]'>{item.name}</h3>
                                                <p className='text-slate-400 text-sm font-medium line-clamp-1'>Precision crafted culinary masterpiece.</p>
                                                <div className='flex items-center justify-center sm:justify-start gap-4 mt-2'>
                                                    <span className='text-2xl font-black text-[#0f172a]'>${item.price}</span>
                                                    <div className='h-4 w-px bg-slate-100'></div>
                                                    <span className='text-slate-400 font-bold text-sm'>Subtotal: <span className='text-[#0f172a]'>${item.price * cartItems[item._id]}</span></span>
                                                </div>
                                            </div>

                                            <div className='flex flex-col items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100'>
                                                <div className='flex items-center gap-4'>
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-[tomato] hover:shadow-md transition-all'
                                                    >
                                                        <Minus size={18} />
                                                    </button>
                                                    <span className='font-black text-lg text-[#0f172a] w-6 text-center'>{cartItems[item._id]}</span>
                                                    <button
                                                        onClick={() => addToCart(item._id)}
                                                        className='w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-[tomato] hover:shadow-md transition-all'
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className='text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-[tomato] transition-colors'
                                                >
                                                    Remove Item
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>

                    {/* Summary Card */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl sticky top-32'>
                            <h2 className='text-2xl font-black text-[#0f172a] mb-8 flex items-center gap-3'>
                                Order Summary
                            </h2>

                            <div className='flex flex-col gap-5 mb-8'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-slate-400 font-bold text-sm uppercase tracking-widest'>Subtotal</span>
                                    <span className='text-[#0f172a] font-black'>${getTotalCartAmount()}</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-slate-400 font-bold text-sm uppercase tracking-widest'>Logistics Fee</span>
                                    <span className='text-[#0f172a] font-black'>${getTotalCartAmount() === 0 ? 0 : 2}</span>
                                </div>
                                {discount > 0 && (
                                    <div className='flex justify-between items-center'>
                                        <span className='text-green-500 font-bold text-sm uppercase tracking-widest'>Discount</span>
                                        <span className='text-green-500 font-black'>-${discount}</span>
                                    </div>
                                )}
                                <div className='h-px bg-slate-50 my-2'></div>
                                <div className='flex justify-between items-end'>
                                    <div>
                                        <span className='text-slate-400 font-black text-[10px] uppercase tracking-widest block mb-1'>Grand Total</span>
                                        <span className='text-4xl font-black text-[#0f172a] tracking-tighter'>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</span>
                                    </div>
                                    <div className='text-right'>
                                        <span className='text-green-500 font-black text-[10px] uppercase tracking-widest block mb-1'>Secure Payment</span>
                                        <div className='flex gap-1 justify-end grayscale opacity-30'>
                                            <CreditCard size={14} />
                                            <CreditCard size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className='w-full group bg-[tomato] text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[tomato]/20 hover:bg-[#ff4500] hover:shadow-[tomato]/40 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95'
                            >
                                Secure Checkout
                                <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                            </button>

                            {/* Promo Code Section */}
                            <div className='mt-10 pt-10 border-t border-slate-50'>
                                <p className='text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4 text-center'>Promotional Code</p>
                                <div className='flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-[tomato]/30 transition-colors'>
                                    <input
                                        type="text"
                                        value={promoInput}
                                        onChange={(e) => setPromoInput(e.target.value)}
                                        placeholder='Enter code'
                                        className='bg-transparent border-none outline-none flex-1 px-4 text-sm font-bold text-[#0f172a] placeholder:text-slate-300 uppercase'
                                    />
                                    <button
                                        onClick={handleApplyPromo}
                                        className='bg-[#0f172a] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[tomato] transition-colors'
                                    >
                                        Apply
                                    </button>
                                </div>
                                <p className='text-[9px] text-slate-400 mt-3 font-medium text-center italic'>Try SAVE20 for $20 off or SAVE50 for $50 off</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart

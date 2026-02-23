import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/StoreContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { MapPin, Truck, ShieldCheck, ArrowRight, ShoppingBag, CreditCard } from 'lucide-react';

const PlaceOrder = () => {

    const { getTotalCartAmount, token, url, food_list, cartItems } = useContext(StoreContext);
    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: ""
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo['quantity'] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        })
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + 2,
        }
        try {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Something went wrong. Please check if your backend is running.");
        }
    }

    useEffect(() => {
        if (!token) {
            navigate('/cart');
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token])

    return (
        <div className='checkout-logistics py-16 md:py-24 px-[5vw] bg-[#fcfdfd] min-h-screen'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-10 md:mb-16'>
                <div className='w-12 h-12 md:w-14 md:h-14 bg-[#0f172a] rounded-2xl flex items-center justify-center shadow-lg'>
                    <ShieldCheck className='text-[tomato]' size={24} />
                </div>
                <div>
                    <h1 className='text-3xl md:text-5xl font-black text-[#0f172a] tracking-tighter'>Checkout Logistics</h1>
                    <p className='text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-xs mt-1'>Finalize your delivery details</p>
                </div>
            </div>

            <form onSubmit={placeOrder} className='flex flex-col lg:flex-row items-start gap-12 lg:gap-20 max-w-[1440px] mx-auto'>

                {/* --- Left Column: Delivery Intelligence --- */}
                <div className="flex-[2] w-full">
                    <div className='bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl'>
                        <h2 className='text-2xl font-black text-[#0f172a] mb-10 flex items-center gap-4'>
                            <MapPin className='text-[tomato]' size={24} />
                            Delivery Coordinates
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>First Name</label>
                                    <input name='firstName' onChange={onChangeHandler} value={data.firstName} required type="text" placeholder='Zaid' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Last Name</label>
                                    <input name='lastName' onChange={onChangeHandler} value={data.lastName} required type="text" placeholder='Malik' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Email Interface</label>
                                <input name='email' onChange={onChangeHandler} value={data.email} required type="email" placeholder='zaid@enterprise.com' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Primary Street Address</label>
                                <input name='street' onChange={onChangeHandler} value={data.street} required type="text" placeholder='Sector 75, Noida' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>City</label>
                                    <input name='city' onChange={onChangeHandler} value={data.city} required type="text" placeholder='Delhi' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>State / Region</label>
                                    <input name='state' onChange={onChangeHandler} value={data.state} required type="text" placeholder='UP' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Zip Protocol</label>
                                    <input name='zipCode' onChange={onChangeHandler} value={data.zipCode} required type="text" placeholder='201301' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Country</label>
                                    <input name='country' onChange={onChangeHandler} value={data.country} required type="text" placeholder='India' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Phone Authentication</label>
                                <input name='phone' onChange={onChangeHandler} value={data.phone} required type="text" placeholder='+91 999 000 0000' className='w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-[#0f172a]' />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Financial Summary --- */}
                <div className="flex-1 w-full lg:sticky lg:top-32">
                    <div className='bg-white p-8 rounded-[40px] border border-slate-100 shadow-2xl'>
                        <h2 className='text-2xl font-black text-[#0f172a] mb-10 flex items-center gap-4'>
                            <CreditCard className='text-[tomato]' size={24} />
                            Transaction Summary
                        </h2>

                        <div className='flex flex-col gap-6 mb-10'>
                            <div className='flex justify-between items-center'>
                                <span className='text-slate-400 font-bold text-xs uppercase tracking-widest'>Gourmet Selection</span>
                                <span className='text-[#0f172a] font-black'>${getTotalCartAmount()}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-slate-400 font-bold text-xs uppercase tracking-widest'>Priority Logistics</span>
                                <span className='text-[#0f172a] font-black'>$2.00</span>
                            </div>
                            <div className='h-px bg-slate-50'></div>
                            <div className='flex justify-between items-end'>
                                <div>
                                    <span className='text-slate-400 font-black text-[10px] uppercase tracking-widest block mb-1'>Net Liability</span>
                                    <span className='text-4xl font-black text-[#0f172a] tracking-tighter'>${getTotalCartAmount() + 2}</span>
                                </div>
                                <div className='flex flex-col items-end gap-1'>
                                    <div className='flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100'>
                                        <div className='w-1.5 h-1.5 rounded-full bg-green-500'></div>
                                        <span className='text-green-600 font-black text-[9px] uppercase tracking-widest'>SSL Active</span>
                                    </div>
                                    <span className='text-slate-300 font-bold text-[9px] uppercase tracking-widest mr-1'>Encrypted</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type='submit'
                            className='w-full group bg-[#0f172a] text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200 hover:bg-[tomato] hover:shadow-[tomato]/30 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 mb-6'
                        >
                            Authorize & Pay
                            <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                        </button>

                        <div className='flex flex-col gap-4 pt-6 border-t border-slate-50'>
                            <div className='flex items-center gap-4 text-slate-400'>
                                <Truck size={20} className='text-[tomato] flex-shrink-0' />
                                <span className='text-xs font-bold leading-relaxed'>Precision delivery timeline active. Standard window 25-45 minutes.</span>
                            </div>
                            <div className='flex items-center gap-4 text-slate-400'>
                                <ShieldCheck size={20} className='text-blue-500 flex-shrink-0' />
                                <span className='text-xs font-bold leading-relaxed'>All transactions protected by the YumGo Global Security Protocol.</span>
                            </div>
                        </div>
                    </div>

                    <Link to="/cart" className='flex items-center justify-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mt-8 hover:text-[tomato] transition-colors no-underline'>
                        <ArrowRight size={14} className='rotate-180' />
                        Return to Shopping Cart
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default PlaceOrder

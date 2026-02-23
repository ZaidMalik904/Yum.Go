import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { assets } from '../../assets/assets';
import { Package, Clock, Truck, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log("DEBUG: Fetching orders for token:", token ? token.substring(0, 10) + "..." : "NONE");
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            console.log("DEBUG: Orders Response Stringified:", JSON.stringify(response.data));
            if (response.data.success) {
                setData(response.data.data || []);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])

    const statusSteps = [
        { status: "Order Placed", icon: Clock, label: "Confirmed" },
        { status: "Food Processing", icon: Package, label: "Cooking" },
        { status: "Out For Delivery", icon: Truck, label: "On the way" },
        { status: "Delivered", icon: CheckCircle, label: "Delivered" }
    ];

    const getStatusIndex = (status) => {
        return statusSteps.findIndex(step => step.status === status);
    }

    return (
        <div className='my-orders my-[50px] pt-[80px] px-[5vw] max-w-[1400px] mx-auto animate-fadeIn'>
            <div className='flex items-center gap-4 mb-10'>
                <div className='w-12 h-12 bg-[tomato] rounded-2xl flex items-center justify-center shadow-lg'>
                    <Package className='text-white' size={24} />
                </div>
                <div>
                    <h2 className='text-3xl md:text-5xl font-black font-["Outfit"] text-[#262626] tracking-tight leading-none'>My Orders</h2>
                    <p className='text-gray-500 font-medium mt-1 text-sm'>Track your delicious journeys.</p>
                </div>
            </div>

            <div className='flex flex-col gap-6'>
                {loading ? (
                    <div className='py-32 flex flex-col items-center justify-center gap-4'>
                        <div className='w-12 h-12 border-4 border-gray-100 border-t-[tomato] rounded-full animate-spin'></div>
                        <p className='text-gray-400 font-bold uppercase tracking-widest text-xs'>Synchronizing delicious data...</p>
                    </div>
                ) : data.length > 0 ? (
                    data.map((order, index) => {
                        const currentIdx = getStatusIndex(order.status);
                        const isExpanded = expandedOrder === order._id;

                        return (
                            <div key={index}
                                className={`bg-white rounded-[32px] border ${isExpanded ? 'border-[tomato] shadow-2xl' : 'border-gray-100 shadow-xl'} overflow-hidden transition-all duration-500`}>

                                {/* Order Summary Header */}
                                <div className='flex flex-col lg:flex-row items-center gap-6 p-6 lg:p-8'>
                                    <div className='w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0'>
                                        <img className='w-14 object-contain' src={assets.parcel_icon} alt="" />
                                    </div>

                                    <div className='flex-1 text-center lg:text-left'>
                                        <div className='flex flex-wrap justify-center lg:justify-start gap-2 mb-3'>
                                            {order.items?.map((item, idx) => (
                                                <span key={idx} className='bg-[#fff4f2] text-[tomato] px-3 py-1 rounded-full text-xs font-bold border border-[tomato]/10'>
                                                    {item.name} <span className='text-[#262626] opacity-60'>x{item.quantity}</span>
                                                </span>
                                            ))}
                                        </div>
                                        <div className='flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6'>
                                            <p className='text-2xl font-black text-[#262626] font-["Outfit"]'>${order.amount?.toFixed(2) || "0.00"}</p>
                                            <div className='flex items-center justify-center lg:justify-start gap-2 text-gray-400 text-sm font-medium'>
                                                <Clock size={14} />
                                                <span>{new Date(order.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto'>
                                        <div className='flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100'>
                                            <span className={`w-3 h-3 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-[tomato] animate-pulse'}`}></span>
                                            <b className='text-sm font-black text-[#262626] uppercase tracking-wider'>{order.status}</b>
                                        </div>

                                        <button
                                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 w-full sm:w-auto
                                                ${isExpanded ? 'bg-[tomato] text-white shadow-lg shadow-[tomato]/30' : 'bg-[#262626] text-white hover:bg-[tomato] active:scale-95 shadow-lg'}`}
                                        >
                                            {isExpanded ? 'Hide Tracking' : 'Track Status'}
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Tracking Timeline (Expanded) */}
                                {isExpanded && (
                                    <div className='p-8 lg:p-12 bg-gray-50/50 border-t border-gray-100 animate-slideDown'>
                                        <div className='relative flex flex-col md:flex-row justify-between items-center max-w-[900px] mx-auto gap-8'>

                                            {/* Background Progress Line */}
                                            <div className='absolute hidden md:block top-6 left-0 right-0 h-1.5 bg-gray-200 rounded-full'>
                                                <div
                                                    className='h-full bg-[tomato] rounded-full transition-all duration-1000 ease-out'
                                                    style={{ width: `${(currentIdx / (statusSteps.length - 1)) * 100}%` }}
                                                />
                                            </div>

                                            {statusSteps.map((step, i) => {
                                                const isActive = i <= currentIdx;
                                                const isComplete = i < currentIdx;
                                                const Icon = step.icon;

                                                return (
                                                    <div key={i} className='relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto'>
                                                        {/* Vertical line for mobile */}
                                                        {i !== statusSteps.length - 1 && (
                                                            <div className='absolute md:hidden left-6 top-10 w-0.5 h-10 bg-gray-200'>
                                                                <div className={`w-full bg-[tomato] transition-all duration-1000 ${isActive ? 'h-full' : 'h-0'}`}></div>
                                                            </div>
                                                        )}

                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 
                                                            ${isActive ? 'bg-[tomato] text-white shadow-xl shadow-[tomato]/30 scale-110' : 'bg-white text-gray-300 border border-gray-100'}`}>
                                                            <Icon size={20} />
                                                        </div>
                                                        <div className='text-left md:text-center'>
                                                            <p className={`text-sm font-black whitespace-nowrap ${isActive ? 'text-[#262626]' : 'text-gray-300'}`}>{step.label}</p>
                                                            {isActive && (
                                                                <p className='text-[10px] text-[tomato] font-bold uppercase tracking-wider mt-0.5'>
                                                                    {i === currentIdx ? 'In Progress' : 'Completed'}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Additional Info Box */}
                                        <div className='mt-12 bg-white rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6'>
                                            <div className='flex items-center gap-4'>
                                                <div className='w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center'>
                                                    <span className='text-3xl'>🏠</span>
                                                </div>
                                                <div>
                                                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Ship to</p>
                                                    <p className='text-sm font-black text-[#262626]'>{order.address.street}, {order.address.city}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={fetchOrders}
                                                className='flex items-center gap-2 text-[tomato] font-bold text-sm hover:underline cursor-pointer'
                                            >
                                                <Clock size={16} /> Refresh Real-time Status
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className='py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100'>
                        <div className='text-6xl mb-6'>🥡</div>
                        <h2 className='text-2xl font-bold text-gray-700'>No orders yet</h2>
                        <p className='text-gray-400 mt-2 font-medium'>Start your food journey by adding items to your cart!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOrders
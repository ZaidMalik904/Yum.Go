import React, { useState, useContext, useEffect, useRef } from 'react'
import { StoreContext } from '../context/StoreContext'
import { LifeBuoy, Send, MessageSquare, ShieldCheck, Clock, User, ChevronRight, X, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Support = () => {
    const { url, token } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("new"); // "new" or "history"
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [responseMsg, setResponseMsg] = useState("");
    const chatEndRef = useRef(null);

    const [formData, setFormData] = useState({
        subject: "",
        message: ""
    });

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [activeTicket]);

    useEffect(() => {
        if (token && activeTab === "history") {
            fetchUserTickets();
        }
    }, [token, activeTab, fetchUserTickets]);

    // Poll for updates if a ticket is open
    useEffect(() => {
        let interval;
        if (activeTicket && activeTicket.status !== 'Resolved') {
            console.log(`[CHAT-POLL] Checking for new messages on ticket: ${activeTicket._id}`);
            interval = setInterval(async () => {
                try {
                    const res = await axios.get(url + `/api/support/ticket/${activeTicket._id}`, { headers: { token } });
                    if (res.data.success && res.data.data) {
                        // Only update if response count changed
                        const newCount = res.data.data.responses?.length || 0;
                        const oldCount = activeTicket.responses?.length || 0;
                        if (newCount !== oldCount) {
                            setActiveTicket(res.data.data);
                        }
                    }
                } catch (e) {
                    console.error("[CHAT-POLL] Error:", e);
                }
            }, 3000); // 3 seconds for snappy feels
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeTicket, url, token]);

    const fetchUserTickets = React.useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.post(url + "/api/support/user-tickets", {}, { headers: { token } });
            if (response.data.success) {
                setTickets(response.data.data);
            }
        } catch {
            toast.error("Error fetching tickets");
        } finally {
            setLoading(false);
        }
    }, [url, token])

    const onFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmitTicket = async (e) => {
        e.preventDefault();
        console.log("[FRONTEND] Form submitted");

        if (!token) {
            console.log("[FRONTEND] No token found in context");
            toast.error("Please login to submit a ticket");
            return;
        }

        setLoading(true);
        const payload = {
            subject: formData.subject,
            message: formData.message
        };
        console.log("[FRONTEND] Sending Ticket to:", url + "/api/support/create");
        console.log("[FRONTEND] Payload:", payload);
        console.log("[FRONTEND] Token used:", token.slice(0, 10) + "...");

        try {
            const response = await axios.post(url + "/api/support/create", payload, { headers: { token } });
            console.log("[FRONTEND] Server Response:", response.data);

            if (response.data.success) {
                toast.success("Support Ticket Submitted!");
                setFormData({ subject: "", message: "" });
                setActiveTab("history");
                fetchUserTickets();
            } else {
                console.error("[FRONTEND] Backend returned failure:", response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("[FRONTEND] Axios Error:", error);
            toast.error("Failed to connect to server. Check your internet or server console.");
        } finally {
            setLoading(false);
        }
    }

    const sendUserResponse = async () => {
        if (!responseMsg.trim() || !activeTicket) return;
        const msg = responseMsg;
        setResponseMsg("");

        try {
            const res = await axios.post(url + "/api/support/response", {
                id: activeTicket._id,
                response: { sender: 'user', text: msg }
            }, { headers: { token } });

            if (res.data.success) {
                // Immediate local update for snappy feel
                const updated = { ...activeTicket };
                updated.responses = [...(updated.responses || []), { sender: 'user', text: msg, time: new Date() }];
                setActiveTicket(updated);
            }
        } catch {
            toast.error("Failed to send");
            setResponseMsg(msg);
        }
    }

    return (
        <div className='support-page py-10 md:py-24 px-4 md:px-[5vw] bg-[#fcfdfe] min-h-screen'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 md:w-14 md:h-14 bg-[tomato] rounded-2xl flex items-center justify-center shadow-lg shadow-[tomato]/20'>
                        <LifeBuoy className='text-white' size={24} />
                    </div>
                    <div>
                        <h1 className='text-3xl md:text-5xl font-black text-[#0f172a] tracking-tight md:tracking-tighter'>Strategic Support</h1>
                        <p className='text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-1'>Logistics & Intelligence Center</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className='flex p-1.5 bg-slate-100 rounded-2xl w-full md:w-fit'>
                    <button
                        onClick={() => setActiveTab("new")}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === "new" ? "bg-white text-[tomato] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        New Ticket
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === "history" ? "bg-white text-[tomato] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        History {tickets.length > 0 && `(${tickets.length})`}
                    </button>
                </div>
            </div>

            <div className='max-w-[1440px] mx-auto'>
                {activeTab === "new" ? (
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24'>
                        {/* Info Section */}
                        <div className='flex flex-col gap-8 md:gap-12'>
                            <div className='p-8 md:p-10 bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-xl'>
                                <h2 className='text-xl md:text-2xl font-black text-[#0f172a] mb-4 md:mb-6 flex items-center gap-3'>
                                    <ShieldCheck className='text-[tomato]' size={24} />
                                    Security First
                                </h2>
                                <p className='text-slate-500 font-medium leading-relaxed text-sm md:text-base'>
                                    Our support interface uses end-to-end logistics tracking. Your concerns are directly routed to our senior analysts for immediate tactical resolution.
                                </p>
                            </div>
                            <div className='grid grid-cols-2 gap-4 md:gap-6'>
                                <div className='p-5 md:p-6 bg-slate-50 rounded-[28px] md:rounded-[32px] border border-slate-100'>
                                    <Clock className='text-[tomato] mb-3 md:mb-4' size={20} />
                                    <h4 className='font-black text-[9px] md:text-xs uppercase tracking-widest text-slate-800 mb-1 md:mb-2'>Fast Response</h4>
                                    <p className='text-[8px] md:text-[10px] text-slate-400 font-bold'>Average: 14 mins</p>
                                </div>
                                <div className='p-5 md:p-6 bg-slate-50 rounded-[28px] md:rounded-[32px] border border-slate-100'>
                                    <User className='text-[tomato] mb-3 md:mb-4' size={20} />
                                    <h4 className='font-black text-[9px] md:text-xs uppercase tracking-widest text-slate-800 mb-1 md:mb-2'>Expert Analysts</h4>
                                    <p className='text-[8px] md:text-[10px] text-slate-400 font-bold'>Certified support</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className='bg-white p-6 md:p-12 rounded-[32px] md:rounded-[50px] border border-slate-50 shadow-2xl'>
                            <h3 className='text-xl md:text-2xl font-black text-[#0f172a] mb-8 md:mb-10'>Submit New Query</h3>
                            <form onSubmit={onSubmitTicket} className='flex flex-col gap-5 md:gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Subject</label>
                                    <input
                                        name='subject'
                                        onChange={onFormChange}
                                        value={formData.subject}
                                        required
                                        placeholder='e.g., Order Delayed'
                                        className='w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-xl md:rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-slate-800 text-sm'
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Context</label>
                                    <textarea
                                        name='message'
                                        onChange={onFormChange}
                                        value={formData.message}
                                        required
                                        rows={4}
                                        placeholder='Describe your issue...'
                                        className='w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-xl md:rounded-2xl outline-none focus:border-[tomato] focus:bg-white transition-all font-bold text-slate-800 text-sm resize-none'
                                    />
                                </div>
                                <button
                                    type='submit'
                                    disabled={loading}
                                    className='w-full bg-[#0f172a] text-white py-4 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.15em] text-[10px] md:text-[11px] hover:bg-[tomato] transition-all duration-500 shadow-xl active:scale-95 flex justify-center items-center gap-3'
                                >
                                    {loading ? "Processing..." : "Dispatch Strategic Message"}
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
                        {/* History List */}
                        <div className='lg:col-span-1 flex flex-col gap-3 md:gap-4 max-h-[40vh] lg:max-h-[70vh] overflow-y-auto no-scrollbar pr-1'>
                            {tickets.length === 0 ? (
                                <div className='p-8 md:p-12 text-center bg-white rounded-[32px] md:rounded-[40px] border-2 border-dashed border-slate-100'>
                                    <AlertCircle className='mx-auto text-slate-200 mb-3 md:mb-4' size={40} />
                                    <p className='text-slate-400 font-bold text-sm'>No tactical history found.</p>
                                </div>
                            ) : tickets.map((t) => (
                                <div
                                    key={t._id}
                                    onClick={() => setActiveTicket(t)}
                                    className={`p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-2 cursor-pointer transition-all ${activeTicket?._id === t._id ? "border-[tomato] bg-white shadow-lg scale-[1.01]" : "border-slate-50 bg-white hover:border-slate-200 shadow-sm"}`}
                                >
                                    <div className='flex justify-between items-start mb-2 md:mb-3'>
                                        <span className='text-[8px] md:text-[9px] font-black uppercase text-[tomato] tracking-wider bg-[#fff4f2] px-2 py-0.5 rounded-lg'>Ticket #{t._id.slice(-6).toUpperCase()}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${t.status === 'Resolved' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
                                    </div>
                                    <h4 className='font-black text-slate-800 text-xs md:text-sm mb-1 md:mb-2 truncate'>{t.subject}</h4>
                                    <div className='flex items-center justify-between mt-3 md:mt-4 border-t border-slate-50 pt-2 md:pt-3'>
                                        <span className='text-[8px] md:text-[10px] text-slate-400 font-bold uppercase'>{new Date(t.createdAt).toLocaleDateString()}</span>
                                        <ChevronRight size={14} className='text-slate-300' />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Window */}
                        <div className='lg:col-span-2 flex flex-col bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-2xl h-[55vh] md:h-[70vh] overflow-hidden'>
                            {!activeTicket ? (
                                <div className='flex-1 flex flex-col items-center justify-center text-slate-300 gap-4 p-8 text-center'>
                                    <MessageSquare size={48} className='opacity-20' />
                                    <p className='font-black uppercase tracking-[0.15em] text-[10px] md:text-xs'>Select a conversation to begin resolution</p>
                                </div>
                            ) : (
                                <>
                                    {/* Chat Header */}
                                    <div className='p-4 md:p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50'>
                                        <div className='flex items-center gap-3 md:gap-4'>
                                            <div className='w-8 h-8 md:w-10 md:h-10 bg-[tomato] rounded-xl flex items-center justify-center font-black text-white text-[10px] md:text-xs'>
                                                {activeTicket.userName[0]}
                                            </div>
                                            <div>
                                                <h4 className='font-black text-slate-800 text-xs md:text-sm truncate max-w-[150px] md:max-w-none'>{activeTicket.subject}</h4>
                                                <span className='text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest'>{activeTicket.status}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveTicket(null)} className='p-2 hover:bg-slate-200 rounded-lg transition-all'>
                                            <X size={16} className='text-slate-400' />
                                        </button>
                                    </div>

                                    {/* Messages Area */}
                                    <div className='flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 md:gap-6 no-scrollbar'>
                                        {/* User's Original Message */}
                                        <div className='flex flex-col gap-1.5 max-w-[90%] md:max-w-[85%] self-start'>
                                            <div className='bg-slate-100 p-3 md:p-4 rounded-xl md:rounded-2xl rounded-tl-none'>
                                                <p className='text-[8px] md:text-xs font-black text-[tomato] uppercase tracking-widest mb-1'>Original Inquiry</p>
                                                <p className='text-xs md:text-sm text-slate-800 font-semibold leading-relaxed'>{activeTicket.message}</p>
                                            </div>
                                            <span className='text-[8px] text-slate-400 font-bold ml-1 uppercase'>{new Date(activeTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>

                                        {/* Replies */}
                                        {activeTicket.responses?.map((res, i) => (
                                            <div key={i} className={`flex flex-col gap-1.5 max-w-[90%] md:max-w-[85%] ${res.sender === 'admin' ? 'self-end' : 'self-start'}`}>
                                                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${res.sender === 'admin' ? 'bg-[#0f172a] text-white rounded-tr-none shadow-lg' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                                                    <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${res.sender === 'admin' ? 'text-white/40' : 'text-[tomato]'}`}>
                                                        {res.sender === 'admin' ? 'Command Center' : 'Your Follow-up'}
                                                    </p>
                                                    <p className='text-xs md:text-sm font-semibold leading-relaxed'>{res.text}</p>
                                                </div>
                                                <span className={`text-[8px] text-slate-400 font-bold uppercase ${res.sender === 'admin' ? 'mr-1 self-end' : 'ml-1'}`}>
                                                    {new Date(res.time || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Chat Input */}
                                    {activeTicket.status !== 'Resolved' ? (
                                        <div className='p-4 md:p-6 bg-white border-t border-slate-50 flex gap-3 md:gap-4'>
                                            <input
                                                value={responseMsg}
                                                onChange={(e) => setResponseMsg(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && sendUserResponse()}
                                                placeholder='Strategy follow-up...'
                                                className='flex-1 bg-slate-50 border-2 border-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 text-xs md:text-sm font-bold outline-none focus:border-[tomato] focus:bg-white transition-all'
                                            />
                                            <button
                                                onClick={sendUserResponse}
                                                className='w-10 h-10 md:w-12 md:h-12 bg-[#0f172a] text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-[tomato] transition-all shadow-lg active:scale-90 flex-shrink-0'
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='p-4 bg-green-50 text-center'>
                                            <p className='text-[8px] md:text-xs font-black text-green-600 uppercase tracking-[0.2em]'>Mission Resolved — Intelligence Closed</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Support

import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
    LifeBuoy, MessageSquare, PhoneCall, FileText, Search,
    ChevronRight, ArrowUpRight, CheckCircle2, AlertCircle,
    Send, User, Clock, Filter, X
} from 'lucide-react'

const Support = ({ url, token }) => {
    const [tickets, setTickets] = useState([])
    const [activeTicket, setActiveTicket] = useState(null)
    const [responseMsg, setResponseMsg] = useState("")
    const [showFilter, setShowFilter] = useState(false)
    const [filterStatus, setFilterStatus] = useState('All')
    const activeTicketIdRef = useRef(null)
    const chatEndRef = useRef(null)

    const scrollToBottom = useCallback(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [])

    const fetchTickets = useCallback(async (currentActiveId = null) => {
        try {
            const res = await axios.get(`${url}/api/support/list`, { headers: { token } })
            if (res.data.success) {
                setTickets(res.data.data)

                const targetId = currentActiveId || activeTicketIdRef.current
                if (targetId) {
                    const fresh = res.data.data.find(t => t._id === targetId);
                    if (fresh) setActiveTicket(fresh);
                }
            } else {
                if (res.data.message === "Not Authorized Login again") {
                    toast.error("Session expired. Please login again.");
                }
            }
        } catch (error) { console.error("Support fetch error:", error) }
    }, [url, token])

    useEffect(() => {
        if (activeTicket) scrollToBottom();
    }, [activeTicket?.responses?.length, activeTicket, scrollToBottom])

    useEffect(() => {
        activeTicketIdRef.current = activeTicket?._id
    }, [activeTicket?._id])

    useEffect(() => {
        const init = async () => { await fetchTickets() }
        init()
        const poller = setInterval(() => {
            fetchTickets(activeTicketIdRef.current)
        }, 10000);
        return () => {
            clearInterval(poller)
        }
    }, [fetchTickets])

    const sendResponse = async () => {
        if (!responseMsg.trim() || !activeTicket) return;
        const msg = responseMsg;
        setResponseMsg("");

        try {
            const res = await axios.post(`${url}/api/support/response`, {
                id: activeTicket._id,
                response: { sender: 'admin', text: msg }
            }, { headers: { token } })

            if (res.data.success) {
                const updated = { ...activeTicket };
                updated.responses = [...(updated.responses || []), { sender: 'admin', text: msg, time: new Date() }];
                setActiveTicket(updated);
            }
        } catch {
            toast.error("Failed to reply");
            setResponseMsg(msg);
        }
    }

    const filtered = tickets.filter(t => filterStatus === 'All' ? true : t.status === filterStatus)

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fadeIn">

            {/* Header Section */}
            <div className="flex items-center gap-4 mb-10">
                <div className="page-header-icon">
                    <LifeBuoy size={26} />
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Support Portal</h1>
                    <p className="text-[13px] text-slate-400 font-semibold mt-1">Customer inquiries and tactical resolution center.</p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.8fr] gap-8 min-h-[700px]">

                {/* Left Pane: Ticket Explorer */}
                <div className="flex flex-col gap-6">
                    <div className="flex gap-3 relative">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                placeholder="Search Ticket ID..."
                                className="admin-input"
                                style={{ paddingLeft: '2.75rem' }}
                            />
                        </div>
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`h-full flex items-center gap-2 px-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap ${filterStatus !== 'All'
                                    ? 'border-primary bg-primary-light text-primary'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30'
                                    }`}
                            >
                                <Filter size={15} />
                                <span className="hidden sm:inline">{filterStatus === 'All' ? 'Filter' : filterStatus}</span>
                            </button>

                            {showFilter && (
                                <div className="absolute top-full right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-slate-100 w-48 z-50 p-2 animate-fadeInDown">
                                    {['All', 'Open', 'Priority', 'Resolved'].map(status => (
                                        <div
                                            key={status}
                                            onClick={() => { setFilterStatus(status); setShowFilter(false); }}
                                            className={`px-5 py-2.5 rounded-xl text-[12px] font-black cursor-pointer transition-all ${filterStatus === status ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            {status === 'All' ? 'All Tickets' : `${status} Tickets`}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto no-scrollbar pr-1">
                        {filtered.length === 0 ? (
                            <div className="bg-white p-16 rounded-[40px] border border-slate-100 shadow-premium text-center">
                                <AlertCircle size={40} className="mx-auto text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold text-sm tracking-tight">No matching inquiries found.</p>
                            </div>
                        ) : filtered.map(t => (
                            <div
                                key={t._id}
                                onClick={() => setActiveTicket(t)}
                                className={`bg-white p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 shadow-premium ${activeTicket?._id === t._id ? 'border-primary scale-[1.01]' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary-light px-2.5 py-1 rounded-lg">ID: {t._id.slice(-6).toUpperCase()}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${t.status === 'Priority' ? 'bg-red-50 text-red-500' : t.status === 'Open' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>{t.status}</span>
                                </div>
                                <h3 className="text-base font-black text-slate-900 leading-tight tracking-tight mb-5">{t.subject}</h3>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">{t.userName ? t.userName[0] : '?'}</div>
                                        <span className="text-xs font-black text-slate-500 truncate max-w-[100px]">{t.userName ? t.userName.split(' ')[0] : 'Customer'}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(t.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane: Intel Hub (Chat) */}
                <div className="relative">
                    {!activeTicket ? (
                        <div className="bg-white h-full rounded-[48px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center animate-fadeIn">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-50">
                                <MessageSquare size={32} className="text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-700 tracking-tight">Intelligence Hub</h2>
                            <p className="text-sm text-slate-400 font-semibold max-w-[280px] mt-2">Select a tactical inquiry from the ledger to begin communication.</p>
                        </div>
                    ) : (
                        <div className="bg-white h-full rounded-[48px] shadow-premium border border-slate-100 flex flex-col overflow-hidden animate-fadeIn">
                            {/* Chat Header */}
                            <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                <div className="flex items-center gap-4 z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-black text-lg shadow-[0_8px_16px_rgba(255,100,70,0.3)]">{activeTicket.userName ? activeTicket.userName[0] : '?'}</div>
                                    <div>
                                        <p className="font-black text-lg tracking-tight leading-none">{activeTicket.userName || 'Customer'}</p>
                                        <div className="flex items-center gap-2.5 mt-2">
                                            <span className="text-[10px] font-black text-slate-400 tracking-wider">#{activeTicket._id.slice(-6).toUpperCase()}</span>
                                            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{activeTicket.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveTicket(null)}
                                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group z-10"
                                >
                                    <X size={20} className="text-slate-400 group-hover:text-white" />
                                </button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 p-8 overflow-y-auto no-scrollbar flex flex-col gap-6 bg-slate-50/30">
                                <div className="self-start max-w-[85%] bg-white p-6 rounded-[32px] rounded-tl-none border border-slate-100 shadow-sm relative group">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 block">Initial Inquiry</p>
                                    <p className="text-sm font-semibold text-slate-700 leading-relaxed italic">&quot;{activeTicket.message}&quot;</p>
                                    <span className="text-[9px] font-black text-slate-300 uppercase mt-4 block">{new Date(activeTicket.createdAt).toLocaleString()}</span>
                                </div>

                                {activeTicket.responses?.map((res, i) => (
                                    <div
                                        key={i}
                                        className={`max-w-[85%] p-5 rounded-[28px] ${res.sender === 'admin' ? 'self-end bg-slate-900 text-white rounded-tr-none shadow-xl' : 'self-start bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'}`}
                                    >
                                        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${res.sender === 'admin' ? 'text-white/40' : 'text-primary'}`}>{res.sender === 'admin' ? 'Command Center' : 'User Reply'}</p>
                                        <p className="text-sm font-semibold leading-relaxed">{res.text}</p>
                                        <span className={`text-[8px] font-black uppercase mt-3 block ${res.sender === 'admin' ? 'text-white/30 text-right' : 'text-slate-300'}`}>
                                            {new Date(res.time || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-8 bg-white border-t border-slate-50 flex gap-4">
                                <div className="relative flex-1 group">
                                    <input
                                        placeholder="Type strategy response..."
                                        className="admin-input h-14 bg-slate-50 border-transparent focus:bg-white focus:border-primary pr-12"
                                        value={responseMsg}
                                        onChange={(e) => setResponseMsg(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendResponse()}
                                    />
                                    <MessageSquare size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                                </div>
                                <button
                                    onClick={sendResponse}
                                    className="w-14 h-14 bg-slate-900 text-white rounded-[20px] flex items-center justify-center hover:bg-primary transition-all duration-300 shadow-lg active:scale-90"
                                >
                                    <Send size={22} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Support

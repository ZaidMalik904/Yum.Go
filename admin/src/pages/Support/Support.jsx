import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
    LifeBuoy, MessageSquare, PhoneCall, FileText, Search,
    ChevronRight, ArrowUpRight, CheckCircle2, AlertCircle,
    Send, User, Clock, Filter, X
} from 'lucide-react'

const STYLES = {
    statusBadge: (status) => ({
        padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
        background: status === 'Priority' ? '#fef2f2' : status === 'Open' ? '#eff6ff' : '#f0fdf4',
        color: status === 'Priority' ? '#ef4444' : status === 'Open' ? '#3b82f6' : '#16a34a',
    })
}

const Support = ({ url, token }) => {
    const [tickets, setTickets] = useState([])
    const [activeTicket, setActiveTicket] = useState(null)
    const [responseMsg, setResponseMsg] = useState("")
    const [showFilter, setShowFilter] = useState(false)
    const [filterStatus, setFilterStatus] = useState('All')
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
    const activeTicketIdRef = useRef(null)
    const chatEndRef = useRef(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (activeTicket) scrollToBottom();
    }, [activeTicket?.responses?.length])

    useEffect(() => {
        activeTicketIdRef.current = activeTicket?._id
    }, [activeTicket?._id])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024)
        window.addEventListener('resize', handleResize)
        fetchTickets()
        const poller = setInterval(() => {
            fetchTickets(activeTicketIdRef.current)
        }, 10000);
        return () => {
            window.removeEventListener('resize', handleResize)
            clearInterval(poller)
        }
    }, [token]) // Only depend on token

    const fetchTickets = async (currentActiveId = null) => {
        try {
            const res = await axios.get(`${url}/api/support/list`, { headers: { token } })
            if (res.data.success) {
                setTickets(res.data.data)

                // Update active ticket data if one is selected
                const targetId = currentActiveId || activeTicket?._id
                if (targetId) {
                    const fresh = res.data.data.find(t => t._id === targetId);
                    if (fresh) setActiveTicket(fresh);
                }
            } else {
                console.log("Support fetch error:", res.data.message);
                if (res.data.message === "Not Authorized Login again") {
                    toast.error("Session expired. Please login again.");
                }
            }
        } catch (e) { console.error(e) }
    }

    const sendResponse = async () => {
        if (!responseMsg.trim() || !activeTicket) return;
        const msg = responseMsg;
        setResponseMsg(""); // Clear input early

        try {
            const res = await axios.post(`${url}/api/support/response`, {
                id: activeTicket._id,
                response: { sender: 'admin', text: msg }
            }, { headers: { token } })

            if (res.data.success) {
                // Instantly update active ticket for better UX
                const updated = { ...activeTicket };
                updated.responses = [...(updated.responses || []), { sender: 'admin', text: msg, time: new Date() }];
                setActiveTicket(updated);
            }
        } catch (e) {
            toast.error("Failed to reply");
            setResponseMsg(msg); // Restore input on error
        }
    }

    const filtered = tickets.filter(t => filterStatus === 'All' ? true : t.status === filterStatus)

    return (
        <div className="page-container">

            {/* 1. Header Section */}
            <div className="page-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="page-header-icon">
                        <LifeBuoy size={26} />
                    </div>
                    <div>
                        <h1>Support Portal</h1>
                        <p>Customer inquiries and tactical resolution center.</p>
                    </div>
                </div>
                {!isMobile && (
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button style={{ padding: '10px 20px', borderRadius: 14, background: '#fff', border: '1.6px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: '#64748b' }}>Technical Docs</button>
                        <button className="btn-primary" style={{ padding: '10px 20px' }}>Emergency Line</button>
                    </div>
                )}
            </div>

            {/* 2. Main Content Grid */}
            <div className="responsive-grid-2" style={{ alignItems: 'start' }}>

                {/* --- Left Column: Ticket List --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ display: 'flex', gap: 16, position: 'relative' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input placeholder="Search Ticket ID..." className="admin-input" style={{ paddingLeft: 46 }} />
                        </div>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="admin-input"
                            style={{ width: 'auto', padding: '12px', border: filterStatus !== 'All' ? '2px solid #ff6347' : '2px solid #e2e8f0', background: filterStatus !== 'All' ? '#fff0ed' : '#fff', cursor: 'pointer', transition: '0.2s' }}
                        >
                            <Filter size={18} color={filterStatus !== 'All' ? '#ff6347' : '#94a3b8'} />
                        </button>

                        {showFilter && (
                            <div className="animate-fadeInDown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, background: '#fff', borderRadius: 20, boxShadow: '0 15px 45px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', width: 200, zIndex: 100, padding: 10 }}>
                                {['All', 'Open', 'Priority', 'Resolved'].map(status => (
                                    <div
                                        key={status}
                                        onClick={() => { setFilterStatus(status); setShowFilter(false); }}
                                        style={{ padding: '12px 18px', borderRadius: 14, fontSize: 13, fontWeight: 800, color: filterStatus === status ? '#ff6347' : '#475569', cursor: 'pointer', background: filterStatus === status ? '#fff0ed' : 'transparent', transition: '0.2s' }}
                                    >
                                        {status} Tickets
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <p style={{ color: '#94a3b8', fontSize: 14 }}>No tickets found matching current criteria.</p>
                            </div>
                        ) : filtered.map(t => (
                            <div
                                key={t._id}
                                onClick={() => setActiveTicket(t)}
                                className="card shadow-premium"
                                style={{ padding: 24, cursor: 'pointer', border: activeTicket?._id === t._id ? '2.5px solid #ff6347' : '1.5px solid #f1f5f9', transform: activeTicket?._id === t._id ? 'translateX(4px)' : 'none' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <span style={{ fontSize: 11, fontWeight: 900, color: '#ff6347', letterSpacing: 1 }}>ID: {t._id.slice(-6).toUpperCase()}</span>
                                    <span style={STYLES.statusBadge(t.status)}>{t.status}</span>
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', lineHeight: 1.4 }}>{t.subject}</h3>
                                <p style={{ fontSize: 13, color: '#64748b', marginTop: 10, lineHeight: 1.6 }}>{t.message.slice(0, 100)}{t.message.length > 100 ? '...' : ''}</p>
                                <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1.2px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={14} color="#94a3b8" />
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: '#445163' }}>{t.userName}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                                        <Clock size={13} />
                                        <span style={{ fontSize: 11, fontWeight: 700 }}>{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Right Column: Intelligence & Rules --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card shadow-premium" style={{ padding: 32, background: '#0f172a', color: '#fff', border: 'none' }}>
                        <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <ArrowUpRight size={20} color="#ff6347" /> Performance Insight
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 20 }}>
                                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 900, letterSpacing: 1.5 }}>UNRESOLVED</p>
                                <p style={{ fontSize: 32, fontWeight: 900, marginTop: 6 }}>{tickets.filter(x => x.status !== 'Resolved').length}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 20 }}>
                                <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 900, letterSpacing: 1.5 }}>CLOSED</p>
                                <p style={{ fontSize: 32, fontWeight: 900, marginTop: 6 }}>{tickets.filter(x => x.status === 'Resolved').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>Protocol Guidelines</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {["Maintain < 15min response time", "Use formal corporate tone", "Escalate if recurring issue"].map((rule, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={14} color="#22c55e" />
                                    </div>
                                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 700 }}>{rule}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Live Chat Response Layer */}
            {activeTicket && (
                <div
                    className="animate-fadeIn"
                    style={{
                        position: 'fixed', bottom: isMobile ? 0 : 30, right: isMobile ? 0 : 30,
                        width: isMobile ? '100%' : 420,
                        height: isMobile ? '100%' : 560,
                        background: '#fff', borderRadius: isMobile ? 0 : 32, boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
                        display: 'flex', flexDirection: 'column', zIndex: 10001, overflow: 'hidden', border: isMobile ? 'none' : '1px solid #f1f5f9'
                    }}>
                    {/* Chat Header */}
                    <div style={{ padding: '24px', background: '#0f172a', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#ff6347', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18 }}>{activeTicket.userName[0]}</div>
                            <div>
                                <p style={{ fontWeight: 900, fontSize: 16, margin: 0 }}>{activeTicket.userName}</p>
                                <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, margin: '2px 0 0' }}>Ticket #{activeTicket._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveTicket(null)}
                            style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Messages Area */}
                    <div style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ alignSelf: 'flex-start', background: '#fff', padding: 18, borderRadius: '20px 20px 20px 4px', border: '1.2px solid #e2e8f0', maxWidth: '85%', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <p style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' }}>Issue Context</p>
                            <p style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.6, fontWeight: 600 }}>{activeTicket.message}</p>
                        </div>

                        {activeTicket.responses?.map((res, i) => (
                            <div key={i} style={{
                                alignSelf: res.sender === 'admin' ? 'flex-end' : 'flex-start',
                                background: res.sender === 'admin' ? '#ff6347' : '#fff',
                                color: res.sender === 'admin' ? '#fff' : '#1e293b',
                                padding: 16,
                                borderRadius: res.sender === 'admin' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                maxWidth: '85%',
                                border: res.sender === 'admin' ? 'none' : '1.2px solid #e2e8f0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                            }}>
                                <p style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 600 }}>{res.text}</p>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div style={{ padding: 24, background: '#fff', borderTop: '1.5px solid #f1f5f9', display: 'flex', gap: 16 }}>
                        <input
                            placeholder="Draft response..."
                            className="admin-input"
                            value={responseMsg}
                            onChange={(e) => setResponseMsg(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendResponse()}
                            style={{ flex: 1, height: 52 }}
                        />
                        <button
                            onClick={sendResponse}
                            className="btn-primary"
                            style={{ width: 52, height: 52, padding: 0, borderRadius: 16, justifyContent: 'center' }}
                        >
                            <Send size={22} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Support

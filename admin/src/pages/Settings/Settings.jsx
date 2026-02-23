import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Settings as SettingsIcon, Globe, Lock, Bell, Eye, EyeOff, Save,
    Database, Server, Shield, Trash2, Smartphone
} from 'lucide-react'
import { toast } from 'react-toastify'

// --- STYLING OBJECTS (Keeping code clean) ---
const STYLES = {
    card: { background: '#fff', borderRadius: 28, padding: 32, border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
    label: { fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 10, display: 'block', textTransform: 'uppercase' },
    input: { width: '100%', padding: '14px 20px', borderRadius: 16, border: '1.5px solid #e2e8f0', fontSize: 14, fontWeight: 600, outline: 'none', background: '#f8fafc' },
    sectionTitle: { fontSize: 18, fontWeight: 900, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }
}

const Settings = ({ url, token }) => {
    // --- STATE MANAGEMENT ---
    const [loading, setLoading] = useState(false)
    const [showKey, setShowKey] = useState(false)
    const [config, setConfig] = useState({
        siteName: 'YumGo.com',
        adminEmail: 'admin@yumgo.com',
        currency: 'USD',
        maintenance: false,
        orderNotifications: true,
        stripePublicKey: 'pk_test_51Pq...',
        deliveryRadius: 15
    })

    // --- API CALLS ---
    const fetchConfig = async () => {
        try {
            const res = await axios.get(`${url}/api/config/get`, { headers: { token } })
            if (res.data.success && Object.keys(res.data.data).length > 0) {
                setConfig(prev => ({ ...prev, ...res.data.data }))
            }
        } catch (error) {
            console.error("Error fetching config", error)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const promises = Object.entries(config).map(([key, value]) =>
                axios.post(`${url}/api/config/update`, { key, value }, { headers: { token } })
            )
            await Promise.all(promises)
            toast.success('Settings Saved Successfully!')
        } catch (error) {
            toast.error('Failed to update Settings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchConfig() }, [])

    // --- HELPER COMPONENTS ---
    const ToggleSwitch = ({ label, desc, val, configKey, icon: Icon }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 20, background: '#f8fafc', border: '1.5px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color="#ff6347" />
                </div>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{label}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{desc}</p>
                </div>
            </div>
            <div
                onClick={() => setConfig({ ...config, [configKey]: !val })}
                style={{ width: 44, height: 24, background: val ? '#ff6347' : '#cbd5e1', borderRadius: 20, cursor: 'pointer', position: 'relative', transition: '0.3s' }}
            >
                <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: val ? 23 : 3, transition: '0.3s' }} />
            </div>
        </div>
    )

    return (
        <div className="page-container">
            {/* 1. Header Section */}
            <div className="page-header">
                <div className="page-header-icon">
                    <SettingsIcon size={26} />
                </div>
                <div>
                    <h1>Settings Center</h1>
                    <p>Control your website global settings and security keys from here.</p>
                </div>
            </div>

            {/* 2. Settings Grid (Main Content) */}
            <div className="responsive-grid-2">

                {/* --- Site Identity Section --- */}
                <div className="card shadow-premium">
                    <h2 style={STYLES.sectionTitle}><Globe size={20} color="#ff6347" /> Website General</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div>
                            <label style={STYLES.label}>Platform Name</label>
                            <input className="admin-input" value={config.siteName} onChange={e => setConfig({ ...config, siteName: e.target.value })} />
                        </div>
                        <div className="responsive-grid-2" style={{ gap: 16 }}>
                            <div>
                                <label style={STYLES.label}>Currency</label>
                                <input className="admin-input" value={config.currency} onChange={e => setConfig({ ...config, currency: e.target.value })} />
                            </div>
                            <div>
                                <label style={STYLES.label}>Delivery Radius (KM)</label>
                                <input type="number" className="admin-input" value={config.deliveryRadius} onChange={e => setConfig({ ...config, deliveryRadius: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Security & API Section --- */}
                <div className="card shadow-premium">
                    <h2 style={STYLES.sectionTitle}><Lock size={20} color="#ff6347" /> API & Keys</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div>
                            <label style={STYLES.label}>Stripe API Key</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showKey ? 'text' : 'password'}
                                    className="admin-input"
                                    style={{ paddingRight: 50 }}
                                    value={config.stripePublicKey}
                                    readOnly
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div style={{ padding: '14px 18px', borderRadius: 16, background: '#fff8ed', border: '1px solid #ffecce', display: 'flex', gap: 12, alignItems: 'center' }}>
                            <Shield size={18} color="#92400e" />
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>All API keys are encrypted at rest.</p>
                        </div>
                    </div>
                </div>

                {/* --- Status & Alerts Section --- */}
                <div className="card shadow-premium">
                    <h2 style={STYLES.sectionTitle}><Bell size={20} color="#ff6347" /> Platform Status</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <ToggleSwitch
                            label="New Order Alerts"
                            desc="Get notified for every sale"
                            val={config.orderNotifications}
                            configKey="orderNotifications"
                            icon={Bell}
                        />
                        <ToggleSwitch
                            label="Maintenance Mode"
                            desc="Stop site requests temporarily"
                            val={config.maintenance}
                            configKey="maintenance"
                            icon={Server}
                        />
                    </div>
                </div>

                {/* --- Extra Tools Section --- */}
                <div className="card shadow-premium" style={{ background: '#0f172a', border: 'none' }}>
                    <h2 style={{ ...STYLES.sectionTitle, color: '#fff' }}><Database size={20} color="#ff6347" /> Admin Tools</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <button className="admin-input" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', textAlign: 'left', cursor: 'pointer' }}>
                            View System Logs
                        </button>
                        <button className="admin-input" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', textAlign: 'left', cursor: 'pointer' }}>
                            Purge Records
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Action Footer (Save Button) */}
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary"
                    style={{ padding: '18px 48px', fontSize: 15, width: window.innerWidth < 640 ? '100%' : 'auto', justifyContent: 'center' }}
                >
                    {loading ? 'Saving...' : <><Save size={20} style={{ marginRight: 10 }} /> Save Platform Settings</>}
                </button>
            </div>
        </div>
    )
}

export default Settings

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
    Settings as SettingsIcon, Globe, Lock, Bell,
    Eye, EyeOff, Save, Database, Server, Shield,
    Loader2, CheckCircle2, Terminal, Trash2
} from 'lucide-react'
import { toast } from 'react-toastify'

/* ── Reusable Field Label ── */
const FieldLabel = ({ children }) => (
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{children}</p>
)

/* ── Section Card ── */
const SectionCard = ({ icon: Icon, iconColor, title, children }) => (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${iconColor}18` }}>
                <Icon size={19} style={{ color: iconColor }} />
            </div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        {children}
    </div>
)

/* ── Toggle Switch ── */
const ToggleSwitch = ({ label, desc, val, onToggle, icon: Icon }) => (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                <Icon size={15} className="text-primary" />
            </div>
            <div>
                <p className="text-[13px] font-black text-slate-900 leading-none">{label}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{desc}</p>
            </div>
        </div>
        <button
            type="button"
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full border-2 transition-all duration-300 shrink-0 cursor-pointer ${val ? 'bg-primary border-primary' : 'bg-slate-200 border-slate-200'
                }`}
        >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${val ? 'left-5' : 'left-0.5'
                }`} />
        </button>
    </div>
)

const Settings = ({ url, token }) => {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showKey, setShowKey] = useState(false)
    const [config, setConfig] = useState({
        siteName: 'YumGo.com',
        adminEmail: 'admin@yumgo.com',
        currency: 'INR',
        maintenance: false,
        orderNotifications: true,
        stripePublicKey: 'pk_test_51Pq...',
        deliveryRadius: 15
    })

    const fetchConfig = useCallback(async () => {
        try {
            const res = await axios.get(`${url}/api/config/get`, { headers: { token } })
            if (res.data.success && Object.keys(res.data.data).length > 0) {
                setConfig(prev => ({ ...prev, ...res.data.data }))
            }
        } catch (error) {
            console.error('Error fetching config', error)
        }
    }, [url, token])

    const handleSave = async () => {
        setLoading(true)
        try {
            const promises = Object.entries(config).map(([key, value]) =>
                axios.post(`${url}/api/config/update`, { key, value }, { headers: { token } })
            )
            await Promise.all(promises)
            toast.success('Settings saved successfully!')
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch {
            toast.error('Failed to update settings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchConfig() }, [fetchConfig])

    const set = (key, val) => setConfig(prev => ({ ...prev, [key]: val }))

    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto animate-fadeIn">

            {/* ── Page Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="page-header-icon">
                        <SettingsIcon size={26} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Settings Center</h1>
                        <p className="text-[13px] text-slate-400 font-semibold mt-1">Control global platform configuration and security.</p>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`flex items-center gap-2.5 px-7 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 whitespace-nowrap ${saved
                            ? 'bg-green-500 text-white shadow-green-200'
                            : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                        }`}
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : saved ? (
                        <><CheckCircle2 size={18} /> Saved!</>
                    ) : (
                        <><Save size={18} /> Save Settings</>
                    )}
                </button>
            </div>

            {/* ── Cards Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ─ Website General ─ */}
                <SectionCard icon={Globe} iconColor="#3b82f6" title="Website General">
                    <div className="flex flex-col gap-5">
                        <div>
                            <FieldLabel>Platform Name</FieldLabel>
                            <input
                                className="admin-input"
                                value={config.siteName}
                                onChange={e => set('siteName', e.target.value)}
                                placeholder="YumGo.com"
                            />
                        </div>
                        <div>
                            <FieldLabel>Admin Email</FieldLabel>
                            <input
                                className="admin-input"
                                type="email"
                                value={config.adminEmail}
                                onChange={e => set('adminEmail', e.target.value)}
                                placeholder="admin@yumgo.com"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FieldLabel>Currency</FieldLabel>
                                <input
                                    className="admin-input"
                                    value={config.currency}
                                    onChange={e => set('currency', e.target.value)}
                                    placeholder="INR"
                                />
                            </div>
                            <div>
                                <FieldLabel>Delivery Radius (KM)</FieldLabel>
                                <input
                                    type="number"
                                    className="admin-input"
                                    value={config.deliveryRadius}
                                    onChange={e => set('deliveryRadius', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ─ API & Keys ─ */}
                <SectionCard icon={Lock} iconColor="#8b5cf6" title="API & Security Keys">
                    <div className="flex flex-col gap-5">
                        <div>
                            <FieldLabel>Stripe Public Key</FieldLabel>
                            <div className="relative">
                                <input
                                    type={showKey ? 'text' : 'password'}
                                    className="admin-input"
                                    style={{ paddingRight: '3rem' }}
                                    value={config.stripePublicKey}
                                    readOnly
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                >
                                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        {/* Security Note */}
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                <Shield size={13} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-[12px] font-black text-amber-700">Encrypted at Rest</p>
                                <p className="text-[11px] font-semibold text-amber-500 mt-0.5">All API keys are stored with AES-256 encryption.</p>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* ─ Platform Status ─ */}
                <SectionCard icon={Bell} iconColor="#f97316" title="Platform Status">
                    <div className="flex flex-col gap-3">
                        <ToggleSwitch
                            label="New Order Alerts"
                            desc="Get notified for every incoming sale"
                            val={config.orderNotifications}
                            onToggle={() => set('orderNotifications', !config.orderNotifications)}
                            icon={Bell}
                        />
                        <ToggleSwitch
                            label="Maintenance Mode"
                            desc="Temporarily pauses all site requests"
                            val={config.maintenance}
                            onToggle={() => set('maintenance', !config.maintenance)}
                            icon={Server}
                        />
                    </div>
                </SectionCard>

                {/* ─ Admin Tools ─ */}
                <div className="bg-slate-900 rounded-[32px] border border-slate-800 p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                            <Database size={19} className="text-primary" />
                        </div>
                        <h2 className="text-base font-black text-white tracking-tight">Admin Tools</h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-[13px] font-black hover:bg-white/10 transition-all cursor-pointer text-left">
                            <Terminal size={16} className="text-slate-400" />
                            View System Logs
                        </button>
                        <button className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-black hover:bg-red-500/20 transition-all cursor-pointer text-left">
                            <Trash2 size={16} />
                            Purge Cache & Records
                        </button>
                    </div>

                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        ⚠️ Destructive actions are irreversible. Proceed with caution.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Settings

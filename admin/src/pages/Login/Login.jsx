import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { assets } from '../../assets/assets'

const Login = ({ url, setToken, setAdminData }) => {
    const [currState, setCurrState] = useState("Login")
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()
        setLoading(true)
        let newUrl = url
        if (currState === "Login") {
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }

        try {
            const response = await axios.post(newUrl, { ...data, role: "admin" })
            if (response.data.success) {
                setToken(response.data.token)
                setAdminData(response.data.user)
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("adminData", JSON.stringify(response.data.user))
                toast.success(currState === "Login" ? "Welcome back, Admin!" : "Account created successfully")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error connecting to server")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            fontFamily: "'Outfit', sans-serif",
            padding: 20
        }}>
            <div className="card shadow-premium" style={{
                width: '100%',
                maxWidth: 440,
                padding: window.innerWidth < 450 ? '32px 24px' : 48,
                animation: 'fadeIn 0.5s ease',
                border: '1px solid #f1f5f9'
            }}>
                {/* Logo Section */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 64, height: 64,
                        background: 'linear-gradient(135deg, #ff6347 0%, #ff4500 100%)',
                        borderRadius: 20, margin: '0 auto 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 12px 30px rgba(255,99,71,0.3)'
                    }}>
                        <img src={assets.logo} alt="logo" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px' }}>
                        YumGo Admin
                    </h1>
                    <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginTop: 6 }}>
                        {currState === "Login" ? "Sign in to manage your empire" : "Create a new admin account"}
                    </p>
                </div>

                <form onSubmit={onLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {currState === "Sign Up" && (
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                name='name'
                                onChange={onChangeHandler}
                                value={data.name}
                                type="text"
                                placeholder='Full Name'
                                required
                                className="admin-input"
                                style={{ paddingLeft: 48 }}
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            name='email'
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder='Email Address'
                            required
                            className="admin-input"
                            style={{ paddingLeft: 48 }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            name='password'
                            onChange={onChangeHandler}
                            value={data.password}
                            type="password"
                            placeholder='Password'
                            required
                            className="admin-input"
                            style={{ paddingLeft: 48 }}
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: 16, justifyContent: 'center', marginTop: 12, fontSize: 15 }}
                    >
                        {loading ? <Loader2 className='animate-spin' size={22} /> : (
                            <>
                                {currState === "Login" ? "Sign In" : "Register Now"}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>
                        {currState === "Login" ? "Need a new account?" : "Already have an account?"}
                        <span
                            onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")}
                            style={{ color: '#ff6347', marginLeft: 8, cursor: 'pointer', textDecoration: 'none', borderBottom: '1.5px solid #ff6347' }}
                        >
                            {currState === "Login" ? "Register here" : "Login here"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login

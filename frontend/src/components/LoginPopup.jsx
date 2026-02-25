import React, { useContext, useState } from 'react'
import { StoreContext } from '../context/StoreContext'
import { X } from 'lucide-react'
import axios from 'axios'

const LoginPopup = ({ setShowLogin }) => {

    const { url, setToken, setUserData } = useContext(StoreContext)

    const [currState, setCurrState] = useState("Login")
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
        event.preventDefault();
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }
        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            if (response.data.user) {
                setUserData(response.data.user);
                localStorage.setItem("userData", JSON.stringify(response.data.user));
            }
            setShowLogin(false);
        }
        else {
            alert(response.data.message);
        }
    }

    return (
        <div className='login-popup fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm grid place-items-center animate-fadeIn'>
            <form onSubmit={onLogin} className="login-popup-container bg-white flex flex-col gap-6 p-8 rounded-[32px] w-[min(90vw,400px)] shadow-2xl animate-slideUp">
                <div className="login-popup-title flex flex-col gap-2">
                    <div className='flex justify-between items-center'>
                        <h2 className='text-3xl font-bold text-[#262626]'>{currState}</h2>
                        <X onClick={() => setShowLogin(false)} className='cursor-pointer text-gray-400 hover:text-black transition-colors' />
                    </div>
                    <p className='text-[tomato] font-semibold text-sm'>Please login to place your order</p>
                </div>

                <div className="login-popup-inputs flex flex-col gap-4">
                    {currState === "Login" ? <></> : (
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase ml-1'>Full Name</label>
                            <input name='name' onChange={onChangeHandler} value={data.name} className='outline-none border-2 border-gray-100 p-3 rounded-2xl focus:border-[tomato] transition-all' type="text" placeholder='Zaid Malik' required />
                        </div>
                    )}
                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-gray-400 uppercase ml-1'>Email Address</label>
                        <input name='email' onChange={onChangeHandler} value={data.email} className='outline-none border-2 border-gray-100 p-3 rounded-2xl focus:border-[tomato] transition-all' type="email" placeholder='name@example.com' required />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-gray-400 uppercase ml-1'>Password</label>
                        <input name='password' onChange={onChangeHandler} value={data.password} className='outline-none border-2 border-gray-100 p-3 rounded-2xl focus:border-[tomato] transition-all' type="password" placeholder='••••••••' required />
                    </div>
                </div>

                <button type='submit' className='bg-[tomato] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#e45b41] transition-all shadow-lg active:scale-95'>
                    {currState === "Sign Up" ? "Create Account" : "Login to Order"}
                </button>

                <div className="login-popup-condition flex items-start gap-3">
                    <input className='mt-1 accent-[tomato]' type="checkbox" required />
                    <p className='text-xs text-gray-500 leading-tight'>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>

                <div className='border-t border-gray-100 pt-4 text-center'>
                    {currState === "Login"
                        ? <p className='text-sm text-gray-600'>New to YumGo.? <span onClick={() => setCurrState("Sign Up")} className='text-[tomato] font-bold cursor-pointer hover:underline'>Create account</span></p>
                        : <p className='text-sm text-gray-600'>Already have an account? <span onClick={() => setCurrState("Login")} className='text-[tomato] font-bold cursor-pointer hover:underline'>Login here</span></p>
                    }
                </div>
            </form>
        </div>
    )
}

export default LoginPopup

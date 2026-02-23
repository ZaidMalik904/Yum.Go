import React, { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Restaurants from './pages/Restaurants/Restaurants'
import Profile from './pages/Profile/Profile'
import Login from './pages/Login/Login'
import AddRestaurant from './pages/AddRestaurant/AddRestaurant'
import Settings from './pages/Settings/Settings'
import Support from './pages/Support/Support'
import Users from './pages/Users/Users'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const url = "https://yum-go.onrender.com"
  const [token, setToken] = useState(localStorage.getItem("token") || "")
  const [adminData, setAdminData] = useState(JSON.parse(localStorage.getItem("adminData")) || null)

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("adminData")
    }
  }, [token])

  if (!token) {
    return (
      <>
        <ToastContainer theme="light" />
        <Login url={url} setToken={setToken} setAdminData={setAdminData} />
      </>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          border: '1px solid #f1f5f9',
        }}
      />

      <Navbar url={url} adminData={adminData} setToken={setToken} setAdminData={setAdminData} />

      <div className="app-content-wrapper">
        <Sidebar />
        <main className="admin-main">
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard url={url} />} />
              <Route path="/add" element={<Add url={url} />} />
              <Route path="/add-restaurant" element={<AddRestaurant url={url} />} />
              <Route path="/list" element={<List url={url} />} />
              <Route path="/orders" element={<Orders url={url} />} />
              <Route path="/restaurants" element={<Restaurants url={url} />} />
              <Route path="/users" element={<Users url={url} token={token} />} />
              <Route path="/settings" element={<Settings url={url} token={token} />} />
              <Route path="/support" element={<Support url={url} token={token} />} />
              <Route path="/profile" element={<Profile url={url} token={token} adminData={adminData} setAdminData={setAdminData} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App

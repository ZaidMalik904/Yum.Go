import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Footer from './components/Footer'
import LoginPopup from './components/LoginPopup'



import FloatingCart from './components/FloatingCart'
import ScrollToTop from './components/ScrollToTop'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Restaurant from './pages/Restaurant'
import Support from './pages/Support'
import Profile from './pages/Profile/Profile'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app w-full overflow-x-hidden pt-20 md:pt-24'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home setShowLogin={setShowLogin} />} />
          <Route path='/cart' element={<Cart setShowLogin={setShowLogin} />} />
          <Route path='/place-order' element={<PlaceOrder />} />

          <Route path='/restaurant/:id' element={<Restaurant setShowLogin={setShowLogin} />} />


          <Route path='/verify' element={<Verify />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/support' element={<Support />} />
        </Routes>
        <Footer />
      </div>
      <FloatingCart />
      <ScrollToTop />
    </>

  )
}

export default App

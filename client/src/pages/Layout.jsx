


import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { X, Menu } from 'lucide-react'
import { assets } from '../assets/assets'
import Sidebar from '../components/Sidebar'  
import { SignIn,useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user} =useUser()

  return user ? (
    <div className='flex flex-col h-screen'>

      {/* ✅ Navbar */}
      <nav className='w-full px-8 h-14 flex items-center justify-between border-b border-gray-200 bg-white'>
        {/* Logo */}
        <img
          src={assets.logo}
          alt="QuickAI Logo"
          className='h-8 cursor-pointer'
          onClick={() => navigate('/')}
        />

        {/* Menu Icon (for small screens) */}
        {sidebar ? (
          <X
            onClick={() => setSidebar(false)}
            className='w-6 h-6 text-gray-600 sm:hidden cursor-pointer'
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className='w-6 h-6 text-gray-600 sm:hidden cursor-pointer'
          />
        )}
      </nav>

      <div className='flex flex-1 w-full'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className='flex-1 bg-[#F4F7FB] overflow-y-auto p-4'>
          <Outlet />
        </div>
      </div>
    </div>
  ):
  <div className='flex-items-center justify-center h-screen'>
    <SignIn />


  </div>
}

export default Layout

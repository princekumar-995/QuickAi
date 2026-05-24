import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { X, Menu } from 'lucide-react'
import { assets } from '../assets/assets'
import Sidebar from '../components/Sidebar'  
import { SignIn, useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050508] text-white relative overflow-hidden">
        {/* Glow Orb */}
        <div className="absolute w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] animate-pulse"></div>
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase animate-pulse">Quick.ai is loading...</span>
        </div>
      </div>
    );
  }

  return user ? (
    <div className='flex flex-col h-screen bg-[#050508] text-white overflow-hidden'>

      {/* ✅ Navbar Mobile Top Bar */}
      <nav className='w-full px-4 sm:px-8 h-16 flex items-center justify-between bg-[#050508]/80 backdrop-blur-md border-b border-white/10 z-50 sticky top-0 md:hidden'>
        <img
          src={assets.logo}
          alt="QuickAI Logo"
          className='max-h-8 cursor-pointer filter brightness-125'
          onClick={() => navigate('/')}
        />
        {sidebar ? (
          <X onClick={() => setSidebar(false)} className='w-6 h-6 text-white cursor-pointer' />
        ) : (
          <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-white cursor-pointer' />
        )}
      </nav>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {sidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebar(false)}
          />
        )}
      </AnimatePresence>

      <div className='flex flex-1 w-full h-[calc(100vh-4rem)] md:h-screen relative bg-[#050508]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

        <div className='flex-1 overflow-y-auto bg-black/20 relative'>
          {/* Main content wrapper */}
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen bg-[#050508] text-white relative overflow-hidden'>
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 scale-95 md:scale-100 shadow-[0_0_50px_rgba(168,85,247,0.15)] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-2">
        <SignIn />
      </div>
    </div>
  )
}

export default Layout

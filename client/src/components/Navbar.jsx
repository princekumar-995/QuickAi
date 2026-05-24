import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X, MessageSquare, Cpu } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from './Chatbot';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const scrollToFeatures = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('features');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById('features');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-[#050508]/70 backdrop-blur-md border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-2 cursor-pointer group' onClick={() => navigate('/')}>
            <img src={assets.logo} alt="logo" className='h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105 filter brightness-125' />
          </div>

          {/* Desktop Nav Items */}
          <div className='hidden md:flex items-center gap-8'>
            <a 
              href="#features" 
              onClick={scrollToFeatures}
              className='text-sm font-medium text-gray-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all'
            >
              Features
            </a>
            
            <span 
              onClick={() => navigate('/ai/blogs')} 
              className={`text-sm font-medium transition-all cursor-pointer relative ${
                isActive('/ai/blogs') ? 'text-purple-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              Create Blog
              {isActive('/ai/blogs') && (
                <motion.span layoutId="activeUnderline" className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
              )}
            </span>

            <span 
              onClick={() => navigate('/ai/codeflow')} 
              className={`text-sm font-medium transition-all cursor-pointer relative ${
                isActive('/ai/codeflow') ? 'text-purple-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              CodeFlow
              {isActive('/ai/codeflow') && (
                <motion.span layoutId="activeUnderline" className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
              )}
            </span>

            <span 
              onClick={() => navigate('/ai/about')} 
              className={`text-sm font-medium transition-all cursor-pointer relative ${
                isActive('/ai/about') ? 'text-purple-400 font-bold' : 'text-gray-300 hover:text-white'
              }`}
            >
              About Us
              {isActive('/ai/about') && (
                <motion.span layoutId="activeUnderline" className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
              )}
            </span>

            {/* AI Assistant Navigation Toggle Link */}
            {user && (
              <span 
                onClick={() => setChatOpen(true)} 
                className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              >
                <MessageSquare className="w-4 h-4 animate-pulse" />
                AI Assistant
              </span>
            )}

            {user ? (
              <div className="flex items-center gap-5 border-l border-white/10 pl-5">
                <button 
                  onClick={() => navigate('/ai/dashboard')} 
                  className={`text-sm font-medium transition-all ${
                    isActive('/ai/dashboard') ? 'text-purple-400 font-bold' : 'text-gray-300 hover:text-purple-300'
                  }`}
                >
                  Dashboard
                </button>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openSignIn()}
                className='flex items-center gap-2 rounded-full text-sm font-medium cursor-pointer bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all border border-white/10'
              >
                Get started <ArrowRight className='w-4 h-4' />
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {user && <span className="mr-1"><UserButton afterSignOutUrl="/" /></span>}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none p-1">
              {mobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#050508]/95 backdrop-blur-xl border-t border-white/10 mt-2 shadow-2xl"
            >
              <div className="px-4 py-5 flex flex-col space-y-4">
                <a href="#features" onClick={scrollToFeatures} className="text-gray-300 hover:text-white font-medium text-sm">Features</a>
                <span onClick={() => {navigate('/ai/blogs'); setMobileMenuOpen(false);}} className="text-gray-300 hover:text-white font-medium text-sm cursor-pointer">Create Blog</span>
                <span onClick={() => {navigate('/ai/codeflow'); setMobileMenuOpen(false);}} className="text-gray-300 hover:text-white font-medium text-sm cursor-pointer">CodeFlow</span>
                <span onClick={() => {navigate('/ai/about'); setMobileMenuOpen(false);}} className="text-gray-300 hover:text-white font-medium text-sm cursor-pointer">About Us</span>
                
                {user && (
                  <span onClick={() => {setChatOpen(true); setMobileMenuOpen(false);}} className="text-purple-400 hover:text-purple-300 font-semibold text-sm cursor-pointer flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    AI Assistant
                  </span>
                )}

                {user ? (
                  <button onClick={() => {navigate('/ai/dashboard'); setMobileMenuOpen(false);}} className="text-purple-400 font-bold text-sm text-left">Dashboard</button>
                ) : (
                  <button onClick={() => {openSignIn(); setMobileMenuOpen(false);}} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-5 py-2.5 rounded-full w-max text-sm font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    Get Started <ArrowRight className="w-4 h-4"/>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Global AI Chatbot integration drawer */}
      <Chatbot openTrigger={chatOpen} setOpenTrigger={setChatOpen} />
    </>
  );
};

export default Navbar;

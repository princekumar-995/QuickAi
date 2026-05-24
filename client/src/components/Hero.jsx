import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className='relative min-h-screen pt-28 pb-16 flex flex-col items-center justify-center bg-gradient-soft overflow-hidden'>
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-purple-600/30 rounded-full filter blur-[100px] opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-pink-600/30 rounded-full filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-[30rem] h-[30rem] bg-blue-600/30 rounded-full filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 10}s`, width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px` }}></div>
      ))}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] glass text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Quick.ai 2.0 is here</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='text-5xl sm:text-6xl md:text-7xl font-outfit font-bold tracking-tight text-white mb-6'
        >
          Elevate your content with <br className="hidden sm:block" />
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]'>AI Intelligence</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10'
        >
          The all-in-one AI suite to write better articles, generate stunning images, and automate your entire creative workflow in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='flex flex-col sm:flex-row items-center justify-center gap-4'
        >
          <button
            onClick={() => navigate('/ai')}
            className='w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium px-8 py-3.5 rounded-full hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 group'
          >
            Start Creating For Free
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>

          <button
            className='w-full sm:w-auto glass hover:bg-white/10 text-white border border-white/20 font-medium px-8 py-3.5 rounded-full hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 flex items-center justify-center gap-2'
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className='mt-16 flex flex-col items-center justify-center gap-3'
        >
          <div className="flex -space-x-4">
             {/* Creating placeholder avatars for trusted by section to look premium */}
             {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                   <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt={`User ${i}`} className="w-full h-full object-cover"/>
                </div>
             ))}
          </div>
          <p className="text-sm font-medium text-gray-400 flex items-center gap-2">
             <span className="flex text-yellow-400">
               {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
             </span>
             Trusted by over 10,000+ creators
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;

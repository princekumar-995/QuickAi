import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkles, Activity, Clock } from 'lucide-react'
import { Protect } from '@clerk/clerk-react'
import CreationItem from '../components/CreationItem'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)

  const getDashboardData = async () => {
    // Simulate network delay for loading effect
    setTimeout(() => {
       setCreations(dummyCreationData)
       setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  return (
    <div className='w-full'>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-outfit font-bold text-white">Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your account.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'
      >
        {/* Total Creations Card */}
        <motion.div variants={itemVariants} className='glass-card flex items-center p-6 gap-5 bg-neutral-950/40 border-white/10'>
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex justify-center items-center shadow-lg shadow-blue-500/30'>
            <Sparkles className='w-7 h-7' />
          </div>
          <div>
            <p className='text-gray-400 text-sm font-medium uppercase tracking-wide'>Total Creations</p>
            {loading ? (
               <div className="h-8 w-16 bg-neutral-800 animate-pulse rounded mt-1"></div>
            ) : (
               <h2 className='text-3xl font-bold text-white mt-1'>{creations.length}</h2>
            )}
          </div>
        </motion.div>

        {/* Active Plan Card */}
        <motion.div variants={itemVariants} className='glass-card flex items-center p-6 gap-5 bg-neutral-950/40 border-white/10'>
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white flex justify-center items-center shadow-lg shadow-pink-500/30'>
            <Gem className='w-7 h-7' />
          </div>
          <div>
            <p className='text-gray-400 text-sm font-medium uppercase tracking-wide'>Active Plan</p>
            {loading ? (
               <div className="h-8 w-24 bg-neutral-800 animate-pulse rounded mt-1"></div>
            ) : (
                <h2 className='text-3xl font-bold text-white mt-1'>
                  <Protect plan='premium' fallback="Free">Premium</Protect>
                </h2>
            )}
          </div>
        </motion.div>
        
        {/* Output Quality (Dummy) */}
        <motion.div variants={itemVariants} className='glass-card flex items-center p-6 gap-5 bg-neutral-950/40 border-white/10'>
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex justify-center items-center shadow-lg shadow-orange-500/30'>
            <Activity className='w-7 h-7' />
          </div>
          <div>
            <p className='text-gray-400 text-sm font-medium uppercase tracking-wide'>Generation Health</p>
             {loading ? (
               <div className="h-8 w-20 bg-neutral-800 animate-pulse rounded mt-1"></div>
            ) : (
               <h2 className='text-3xl font-bold text-white mt-1'>Excellent</h2>
            )}
          </div>
        </motion.div>

        {/* Time Saved (Dummy) */}
        <motion.div variants={itemVariants} className='glass-card flex items-center p-6 gap-5 bg-neutral-950/40 border-white/10'>
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex justify-center items-center shadow-lg shadow-teal-500/30'>
            <Clock className='w-7 h-7' />
          </div>
          <div>
            <p className='text-gray-400 text-sm font-medium uppercase tracking-wide'>Time Saved</p>
            {loading ? (
               <div className="h-8 w-20 bg-neutral-800 animate-pulse rounded mt-1"></div>
            ) : (
               <h2 className='text-3xl font-bold text-white mt-1'>12h 4m</h2>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className='glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-neutral-950/40 text-white'
      >
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
           <h3 className='text-xl font-outfit font-semibold text-white'>Recent Activity</h3>
           <button className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">View All</button>
        </div>
        
        <div className='space-y-4'>
          {loading ? (
             // Skeletons
             [1,2,3].map((i) => (
                <div key={i} className="w-full h-20 bg-neutral-900 animate-pulse rounded-xl"></div>
             ))
          ) : creations.length > 0 ? (
            creations.map((item, index) => (
               <motion.div
                 key={item.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.5 + (index * 0.1) }}
               >
                 <CreationItem item={item}/>
               </motion.div>
            ))
          ) : (
             <div className="text-center py-12 flex flex-col items-center">
                <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                   <Sparkles className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-300 text-lg font-medium">No creations yet</p>
                <p className="text-gray-500 text-sm mt-1">Start generating content to see your history here.</p>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard

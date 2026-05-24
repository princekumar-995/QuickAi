


import React, { useState } from 'react'
import Markdown from 'react-markdown'


const CreationItem = ({ item }) => {

  const [expanded,setExpanded] =useState(false)
  return (
    <div onClick={()=> setExpanded(!expanded)} className='p-5 max-w-5xl text-sm bg-neutral-950/40 border border-white/10 rounded-2xl cursor-pointer shadow-md hover:shadow-lg hover:border-purple-500/30 hover:bg-neutral-900/40 transition-all duration-200 text-white'>
      <div className='flex justify-between items-center gap-4'>

        {/* Left Side */}
        <div>
          <h2 className='text-white font-bold mb-1 text-sm tracking-wide'>
            {item.prompt}
          </h2>
          <p className='text-gray-400 text-xs font-light'>
            {item.type} • {new Date(item.created_at).toLocaleDateString() || 'Invalid Date'}
          </p>
        </div>

        {/* Right Side Button */}
        <button className='bg-purple-950/30 border border-purple-500/20 text-purple-400 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider scale-95 shrink-0'>
          {item.type}
        </button>

      </div>
      {
        expanded && (
          <div>
            {item.type==='image' ? (
              <div>
                <img src={item.content} alt="image" className='mt-4 w-full max-w-md rounded-xl border border-white/10 shadow' />
              </div>
            ):(
              <div className='mt-4 h-full text-sm text-gray-300 border-t border-white/5 pt-4 leading-relaxed prose prose-invert max-w-none'>
                <div className='reset-tw'>
                  <Markdown>{item.content}</Markdown>
                </div>
              </div>
            )}
          </div>
        )
      }
    </div>
  )
}

export default CreationItem

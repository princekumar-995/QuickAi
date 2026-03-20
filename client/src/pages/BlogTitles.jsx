import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'

const BlogTitles = () => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [titles, setTitles] = useState([])

  const categories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Travel',
    'Food'
  ]

  const generateTitles = () => {
    if (!selectedCategory) return
    // Dummy data for now
    setTitles([
      `Top 10 ${selectedCategory} Trends in 2025`,
      `How ${selectedCategory} is Changing the World`,
      `${selectedCategory} Secrets You Need to Know`,
    ])
  }

  return (
    <div className='w-full flex gap-6 p-6'>
      
      {/* Left side */}
      <div className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>

        {/* Keyword Input */}
        <div className='mt-6'>
          <label className='block text-gray-700 text-sm mb-2'>Keyword</label>
          <input
            type='text'
            placeholder='The future of artificial intelligence'
            className='w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#4A7AFF]'
          />
        </div>

        {/* Category */}
        <div className='mt-6'>
          <label className='block text-gray-700 text-sm mb-2'>Category</label>
          <div className='flex flex-wrap gap-3'>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg border text-sm transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#4A7AFF] text-white border-[#4A7AFF]'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateTitles}
          className='mt-8 bg-gradient-to-r from-[#4A7AFF] to-[#7F56D9] text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200'
        >
          Generate Titles
        </button>
      </div>

      {/* Right side */}
      <div className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Titles</h1>
        </div>

        {/* Center message or list */}
        <div className='flex-1 flex justify-center items-center'>
          {titles.length === 0 ? (
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400 text-center'>
              <h1 className='text-4xl font-bold text-gray-300'>#</h1>
              <p>
                Enter keywords and click <strong>"Generate Titles"</strong> to get started
              </p>
            </div>
          ) : (
            <ul className='mt-6 space-y-3'>
              {titles.map((title, index) => (
                <li
                  key={index}
                  className='p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition'
                >
                  {title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogTitles

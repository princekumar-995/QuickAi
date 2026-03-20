import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'Short (500–800 words)' },
    { length: 1200, text: 'Medium (800–1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0])
  const [input, setInput] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
  }

  const handleGenerate = () => {
    if (input.trim() === '') {
      alert('Please enter an article topic!')
      return
    }
    alert(`🪄 Generating a ${selectedLength.text} article on: "${input}"`)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 text-slate-700'>

      {/* Left Form Section */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 shadow-sm'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 h-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>

        {/* Topic Input */}
        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400'
          placeholder='The future of artificial intelligence is...'
        />

        {/* Length Buttons */}
        <p className='mt-5 text-sm font-medium'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all duration-200 ${
                selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700 border-blue-400'
                  : 'text-gray-500 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        {/* Generate Button */}
        <button
          type='button'
          onClick={handleGenerate}
          className='mt-6 flex items-center justify-center gap-2 w-full p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-all duration-200'
        >
          <Edit className='w-5 h-5' />
          Generate Article
        </button>
      </form>

      <div className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 min-h-96 max-h-[600px] flex flex-col'>
  <div className='flex items-center gap-3'>
    <Edit className='w-5 h-5 text-[#4A7AFF]' />
    <h1 className='text-xl font-semibold'>Generated Article</h1>
  </div>

  {/* Center content vertically and horizontally */}
  <div className='flex flex-1 justify-center items-center'>
    <div className='text-sm flex flex-col items-center gap-5 text-gray-400 text-center'>
      <Edit className='w-9 h-9' />
      <p>
        Enter a topic and click <strong>"Generate Article"</strong> to get started
      </p>
    </div>
  </div>
</div>


    </div>
  )
}

export default WriteArticle


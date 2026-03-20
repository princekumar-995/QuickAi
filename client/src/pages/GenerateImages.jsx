import React, { useState } from 'react'
import { Image, Sparkles } from 'lucide-react'

const GenerateImages = () => {
  const [selectedStyle, setSelectedStyle] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)

  const styles = ['Realistic', 'Ghibli Style', 'Cartoon', 'Cyberpunk', 'Watercolor']

  const handleGenerate = () => {
    if (imagePrompt.trim() === '') {
      alert('Please describe your image!')
      return
    }
    // For now, just use a dummy placeholder image
    setGeneratedImage('https://placehold.co/400x250?text=Generated+Image')
  }

  return (
    <div className='w-full flex gap-6 p-6'>

      {/* Left Side */}
      <div className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>

        {/* Describe Image */}
        <div className='mt-6'>
          <label className='block text-gray-700 text-sm mb-2'>Describe Your Image</label>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder='Describe what you want to see in the image...'
            rows='4'
            className='w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#4A7AFF]'
          ></textarea>
        </div>

        {/* Style Options */}
        <div className='mt-6'>
          <label className='block text-gray-700 text-sm mb-2'>Style</label>
          <div className='flex flex-wrap gap-3'>
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-lg border text-sm transition-all duration-200 ${
                  selectedStyle === style
                    ? 'bg-[#4A7AFF] text-white border-[#4A7AFF]'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className='mt-8 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2'
        >
          <Image className='w-5 h-5' />
          Generate Image
        </button>
      </div>

      {/* Right Side */}
      <div className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>

        {/* Display or Empty State */}
        <div className='flex-1 flex justify-center items-center'>
          {generatedImage ? (
            <img
              src={generatedImage}
              alt='Generated'
              className='rounded-lg border border-gray-200 shadow-sm mt-6'
            />
          ) : (
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400 text-center'>
              <Image className='w-10 h-10' />
              <p>
                Describe an image and click <strong>"Generate Image"</strong> to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateImages

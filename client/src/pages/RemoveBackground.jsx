import React, { useState } from 'react'
import { ImageMinus, Sparkles, Upload } from 'lucide-react'

const RemoveBackground = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
      setProcessedImage(null)
    }
  }

  const handleRemoveBackground = () => {
    if (!selectedImage) {
      alert('Please upload an image first!')
      return
    }
    setTimeout(() => {
      setProcessedImage('https://placehold.co/400x250/orange/ffffff?text=Background+Removed')
    }, 1000)
  }

  return (
    <div className='w-full flex gap-6 p-6'>

      {/* Left Section */}
      <div className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>AI Background Remover</h1>
        </div>

        {/* Upload Input */}
        <div className='mt-6'>
          <label className='block text-gray-700 text-sm mb-2'>Upload Your Image</label>

          {/* Uploader box */}
          <label
            htmlFor='imageUpload'
            className='border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#4A7AFF] transition'
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt='Uploaded'
                className='w-full h-40 object-cover rounded-lg border border-gray-200'
              />
            ) : (
              <>
                <Upload className='w-8 h-8 mb-2' />
                <p className='text-sm'>Click or drag image to upload</p>
              </>
            )}
          </label>

          {/* Hidden input */}
          <input
            id='imageUpload'
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />

          {/* Supported formats below box */}
          <p className='mt-3 text-xs text-gray-500'>
            Supported formats: <strong>JPG</strong>, <strong>PNG</strong>, <strong>GIF</strong>, <strong>WEBP</strong>, and more.
          </p>
        </div>

        {/* Remove Background Button */}
        <button
          onClick={handleRemoveBackground}
          className='mt-8 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2'
        >
          <ImageMinus className='w-5 h-5' />
          Remove Background
        </button>
      </div>

      {/* Right Section */}
      <div className='w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col'>
        <div className='flex items-center gap-3'>
          <ImageMinus className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        <div className='flex-1 flex justify-center items-center'>
          {processedImage ? (
            <img
              src={processedImage}
              alt='Processed'
              className='rounded-lg border border-gray-200 shadow-sm mt-6'
            />
          ) : (
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400 text-center'>
              <ImageMinus className='w-10 h-10' />
              <p>
                Upload an image and click <strong>"Remove Background"</strong> to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RemoveBackground

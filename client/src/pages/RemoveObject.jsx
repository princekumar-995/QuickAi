// src/pages/RemoveObject.jsx
import React, { useState } from 'react'
import { Scissors, Sparkles, Upload } from 'lucide-react'

const RemoveObject = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [prompt, setPrompt] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
      setProcessedImage(null)
    }
  }

  const handleRemoveObject = () => {
    if (!selectedImage) {
      alert('Please upload an image first!')
      return
    }
    if (!prompt.trim()) {
      alert('Please describe the object to remove!')
      return
    }
    // Demo processing (replace with your API)
    setTimeout(() => {
      setProcessedImage('https://placehold.co/400x250/orange/ffffff?text=Object+Removed')
    }, 1000)
  }

  return (
    <div className="w-full flex gap-6 p-6">
      {/* Left Section */}
      <div className="w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>

        {/* Upload Input */}
        <div className="mt-6">
          <label className="block text-gray-700 text-sm mb-2">Upload image</label>

          {/* Uploader box */}
          <label
            htmlFor="objImageUpload"
            className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#4A7AFF] transition"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-full h-40 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm">Click or drag image to upload</p>
              </>
            )}
          </label>

          {/* Hidden input */}
          <input
            id="objImageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Supported formats below box */}
          <p className="mt-3 text-xs text-gray-500">
            Supported formats: <strong>JPG</strong>, <strong>PNG</strong>, <strong>GIF</strong>, <strong>WEBP</strong>, and more.
          </p>
        </div>

        {/* Describe object */}
        <div className="mt-6">
          <label className="block text-gray-700 text-sm mb-2">Describe object to remove</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., remove the car in background, remove the tree, remove the watermark text"
            className="w-full min-h-28 rounded-lg border border-gray-300 outline-none p-3 text-sm focus:border-[#4A7AFF] resize-y"
          />
          <p className="mt-2 text-xs text-gray-500">
            Be specific about what you want to remove.
          </p>
        </div>

        {/* Remove Object Button */}
        <button
          onClick={handleRemoveObject}
          className="mt-8 bg-gradient-to-r from-[#4A7AFF] to-[#8A5CF6] hover:opacity-95 text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Scissors className="w-5 h-5" />
          Remove Object
        </button>
      </div>

      {/* Right Section */}
      <div className="w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          {processedImage ? (
            <img
              src={processedImage}
              alt="Processed"
              className="rounded-lg border border-gray-200 shadow-sm mt-6"
            />
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center">
              <Scissors className="w-10 h-10" />
              <p>
                Upload an image and describe what to remove, then click <strong>"Remove Object"</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RemoveObject

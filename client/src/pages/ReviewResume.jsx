import React, { useState } from 'react'
import { FileText, ClipboardCheck, Upload } from 'lucide-react'

const ReviewResume = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [reviewResult, setReviewResult] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setReviewResult(null)
    }
  }

  const handleReviewResume = () => {
    if (!selectedFile) {
      alert('Please upload your resume first!')
      return
    }

    // Simulated analysis process (replace with your API later)
    setTimeout(() => {
      setReviewResult({
        feedback:
          'Your resume is strong overall. You can improve by adding more measurable achievements and ensuring consistent formatting.',
        strengths: [
          'Good structure and formatting',
          'Relevant skills section',
          'Clear educational background',
        ],
        suggestions: [
          'Add quantified achievements (e.g., “Increased sales by 30%”)',
          'Use consistent font and spacing throughout',
          'Include links to portfolio or LinkedIn profile',
        ],
      })
    }, 1500)
  }

  return (
    <div className="w-full flex gap-6 p-6">
      {/* Left Section */}
      <div className="w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        {/* Upload Input */}
        <div className="mt-6">
          <label className="block text-gray-700 text-sm mb-2">Upload Resume</label>
          <label
            htmlFor="resumeUpload"
            className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#4A7AFF] transition"
          >
            {selectedFile ? (
              <p className="text-sm text-gray-600 font-medium">{selectedFile.name}</p>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm">Click or drag file to upload</p>
              </>
            )}
          </label>

          <input
            id="resumeUpload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="mt-3 text-xs text-gray-500">
            Supports <strong>PDF</strong>, <strong>PNG</strong>, <strong>JPG</strong> formats.
          </p>
        </div>

        {/* Review Button */}
        <button
          onClick={handleReviewResume}
          className="mt-8 bg-gradient-to-r from-[#00C896] to-[#0084FF] hover:opacity-95 text-white py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ClipboardCheck className="w-5 h-5" />
          Review Resume
        </button>
      </div>

      {/* Right Section */}
      <div className="w-full max-w-lg p-6 bg-white rounded-xl border border-gray-200 flex flex-col">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-5 h-5 text-[#00C896]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center">
          {reviewResult ? (
            <div className="mt-6 text-left">
              <h2 className="font-semibold text-gray-800 mb-2">Feedback:</h2>
              <p className="text-sm text-gray-600 mb-4">{reviewResult.feedback}</p>

              <h3 className="font-semibold text-gray-800 mb-1">✅ Strengths</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                {reviewResult.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3 className="font-semibold text-gray-800 mb-1">💡 Suggestions</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {reviewResult.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center">
              <FileText className="w-10 h-10" />
              <p>
                Upload your resume and click <strong>"Review Resume"</strong> to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewResume

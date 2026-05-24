import React, { useState } from 'react';
import { Edit, Sparkles, PenTool, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';

const WriteArticle = () => {
  const { getToken } = useAuth();
  const articleLength = [
    { length: 800, text: 'Short (500–800 words)' },
    { length: 1200, text: 'Medium (800–1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState('');

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (input.trim() === '') {
      toast.error('Please enter an article topic!');
      return;
    }

    setLoading(true);
    setGeneratedArticle('');
    const toastId = toast.loading(`Generating a ${selectedLength.text} article...`);

    try {
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/generate-article`,
        { prompt: `Write a highly engaging, SEO optimized article about: ${input}. Length should be approximately ${selectedLength.length} tokens. Use markdown formatting with headings.`, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setGeneratedArticle(response.data.content);
        toast.success('Article generated successfully!', { id: toastId });
      } else {
        toast.error(response.data.message || 'Failed to generate article', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Make sure server is running and keys are valid.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full'>
       <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl flex items-center gap-3 font-outfit font-bold text-gray-900 dark:text-white">
          <PenTool className="w-8 h-8 text-primary"/>
          AI Article Writer
        </h1>
        <p className="text-gray-500 mt-1">Generate high-quality, SEO-optimized articles in seconds.</p>
      </motion.div>

      <div className='flex flex-col lg:flex-row items-start gap-8'>
        {/* Left Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full lg:w-1/3 glass-card p-6 border border-white/10 bg-neutral-950/80 text-white'
        >
          <form onSubmit={handleGenerate}>
            <div className='flex items-center justify-between mb-6 border-b border-white/10 pb-4'>
              <h2 className='text-lg font-semibold text-white'>Configuration</h2>
              <Sparkles className='w-5 h-5 text-purple-400' />
            </div>

            {/* Topic Input */}
            <div className="mb-6">
              <label className='block text-sm font-medium text-gray-300 mb-2'>Article Topic</label>
              <textarea
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='w-full p-4 outline-none text-sm rounded-xl border border-white/10 bg-black/40 text-white focus:bg-black focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30 transition-all resize-none shadow-inner'
                placeholder='e.g., The future of artificial intelligence in healthcare and its impact on doctors...'
              />
            </div>

            {/* Length Buttons */}
            <div className="mb-8">
              <label className='block text-sm font-medium text-gray-300 mb-2 mt-5'>Target Length</label>
              <div className='flex flex-col gap-2'>
                {articleLength.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedLength(item)}
                    className={`text-sm px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 border flex items-center justify-between ${
                      selectedLength.text === item.text
                        ? 'bg-purple-950/30 text-purple-400 border-purple-500/50 font-medium shadow-sm'
                        : 'text-gray-400 border-white/10 hover:border-purple-500/20 hover:bg-neutral-900 bg-black/20'
                    }`}
                  >
                    {item.text}
                    {selectedLength.text === item.text && <div className="w-2 h-2 rounded-full bg-purple-500"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type='submit'
              disabled={loading}
              className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md ${
                 loading 
                   ? 'bg-purple-600/70 text-white cursor-not-allowed cursor-wait' 
                   : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className='w-5 h-5' />
                  Generate Article
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Right Preview Section */}
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className='w-full lg:w-2/3 bg-neutral-950/80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-[600px] max-h-[800px] text-white'
        >
          <div className='bg-neutral-900/60 border-b border-white/10 px-6 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className="w-8 h-8 rounded-lg bg-green-950/40 border border-green-500/30 flex items-center justify-center">
                 <Edit className='w-4 h-4 text-green-400' />
              </div>
              <h2 className='text-lg font-semibold text-white'>Generated Output</h2>
            </div>
            {generatedArticle && (
              <button onClick={() => {
                  navigator.clipboard.writeText(generatedArticle);
                  toast.success("Copied to clipboard!");
              }} className="text-sm text-gray-400 hover:text-purple-400 transition-colors font-medium">Copy Text</button>
            )}
          </div>

          <div className='flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/20'>
             <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="w-full space-y-4"
                  >
                     <div className="h-8 w-3/4 bg-neutral-800/80 animate-pulse rounded-full mb-8"></div>
                     {[1,2,3,4,5,6,7].map((i) => (
                        <div key={i} className={`h-4 bg-neutral-800/80 animate-pulse rounded-full ${i % 3 === 0 ? 'w-5/6' : 'w-full'}`}></div>
                     ))}
                     <div className="h-4 w-1/2 bg-neutral-800/80 animate-pulse rounded-full mt-8"></div>
                  </motion.div>
                ) : generatedArticle ? (
                  <motion.div 
                     key="content"
                     initial={{ opacity: 0, filter: 'blur(10px)' }}
                     animate={{ opacity: 1, filter: 'blur(0px)' }}
                     transition={{ duration: 0.5 }}
                     className="prose prose-invert max-w-none text-gray-300"
                  >
                     <ReactMarkdown>{generatedArticle}</ReactMarkdown>
                  </motion.div>
                ) : (
                  <motion.div 
                     key="empty"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className='h-full flex flex-col justify-center items-center text-center text-gray-500 gap-4 mt-20'
                  >
                     <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center mb-2 border border-white/5 shadow-inner">
                        <Edit className='w-10 h-10 text-gray-600' />
                     </div>
                     <div>
                       <h3 className="text-lg font-medium text-gray-300">Ready to create</h3>
                       <p className="max-w-xs mt-1 text-sm text-gray-500">Enter a topic and configure your settings to generate an AI article.</p>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WriteArticle

import React, { useState, useEffect } from 'react';
import { Image, Sparkles, Download, History, RefreshCw, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const GenerateImages = () => {
  const { getToken } = useAuth();
  
  const styles = [
    { name: 'Realistic', value: 'Photorealistic, cinematic lighting' },
    { name: 'Ghibli Style', value: 'Studio Ghibli style, hand-drawn anime aesthetic' },
    { name: 'Cyberpunk', value: 'Cyberpunk neon noir, glowing signs, high-tech low-life' },
    { name: '3D Render', value: '3D render, octane render, smooth surfaces, futuristic design' },
    { name: 'Watercolor', value: 'Watercolor painting, delicate wash, artistic strokes' }
  ];

  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [imagePrompt, setImagePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('quickai_image_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse image history", e);
      }
    }
  }, []);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (imagePrompt.trim() === '') {
      toast.error('Please describe the image you want to generate!');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    const toastId = toast.loading('Architecting your futuristic image...');

    try {
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/generate-image`,
        { 
          prompt: imagePrompt, 
          style: selectedStyle.value 
        },
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      if (response.data.success) {
        const newImgUrl = response.data.imageUrl;
        setGeneratedImage(newImgUrl);
        
        // Add to history
        const newHistoryItem = {
          id: Date.now(),
          prompt: imagePrompt,
          style: selectedStyle.name,
          url: newImgUrl,
          createdAt: new Date().toISOString()
        };
        const updatedHistory = [newHistoryItem, ...history.slice(0, 19)]; // Keep max 20 items
        setHistory(updatedHistory);
        localStorage.setItem('quickai_image_history', JSON.stringify(updatedHistory));

        toast.success('Visual artifact synthesized successfully!', { id: toastId });
      } else {
        toast.error(response.data.message || 'Synthesis engine failed', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong with the image generator.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, prompt) => {
    try {
      toast.loading("Preparing download...");
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${prompt.substring(0, 20).replace(/\s+/g, '_')}_quickai.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.dismiss();
      toast.success("Download started!");
    } catch (error) {
      console.error("Download failed", error);
      // Fallback: Open in new tab
      window.open(url, '_blank');
      toast.dismiss();
      toast.success("Opened image in new tab!");
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('quickai_image_history');
    toast.success("Image history cleared");
  };

  return (
    <div className='w-full'>
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl flex items-center gap-3 font-outfit font-bold text-gray-900 dark:text-white">
          <Image className="w-8 h-8 text-purple-500"/>
          AI Image Generator
        </h1>
        <p className="text-gray-500 mt-1">Transform raw ideas and descriptive prompts into jaw-dropping premium vector artifacts.</p>
      </motion.div>

      <div className='flex flex-col lg:flex-row items-start gap-8'>
        {/* Left Control Card */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full lg:w-[35%] glass-card p-6 border border-white/10 bg-neutral-950/80 text-white rounded-2xl shadow-xl'
        >
          <form onSubmit={handleGenerate}>
            <div className='flex items-center justify-between mb-6 border-b border-white/10 pb-4'>
              <h2 className='text-lg font-semibold text-white'>Studio Parameters</h2>
              <Sparkles className='w-5 h-5 text-purple-400' />
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <label className='block text-sm font-medium text-gray-300 mb-2'>Prompt Description</label>
              <textarea
                rows={4}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className='w-full p-4 outline-none text-sm rounded-xl border border-white/10 bg-black/40 text-white focus:bg-black focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/30 transition-all resize-none shadow-inner'
                placeholder='e.g., A sleek cybernetic robot planning a city architecture on an interactive holographic workspace, 3d render...'
              />
            </div>

            {/* Styles */}
            <div className="mb-8">
              <label className='block text-sm font-medium text-gray-300 mb-3'>Artistic Render Style</label>
              <div className='grid grid-cols-2 gap-2'>
                {styles.map((style) => (
                  <div
                    key={style.name}
                    onClick={() => setSelectedStyle(style)}
                    className={`text-xs px-3 py-2.5 rounded-xl cursor-pointer text-center transition-all duration-200 border ${
                      selectedStyle.name === style.name
                        ? 'bg-purple-950/30 text-purple-400 border-purple-500/50 font-bold shadow-md'
                        : 'text-gray-400 border-white/10 hover:border-purple-500/20 hover:bg-neutral-900 bg-black/20'
                    }`}
                  >
                    {style.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Synthesize Button */}
            <button
              type='submit'
              disabled={loading}
              className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md ${
                 loading 
                   ? 'bg-purple-600/70 text-white cursor-not-allowed cursor-wait' 
                   : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles className='w-5 h-5' />
                  Generate Image
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Right Output Showcase */}
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className='w-full lg:w-[65%] bg-neutral-950/80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-[580px] max-h-[750px] text-white'
        >
          <div className='bg-neutral-900/60 border-b border-white/10 px-6 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-center">
                 <Image className='w-4 h-4 text-purple-400' />
              </div>
              <h2 className='text-lg font-semibold text-white'>Studio Canvas</h2>
            </div>
            {generatedImage && (
              <button 
                onClick={() => handleDownload(generatedImage, imagePrompt)} 
                className="inline-flex items-center gap-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-purple-500/10 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            )}
          </div>

          <div className='flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center bg-black/20'>
             <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center gap-4 text-center"
                  >
                     <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase animate-pulse">Running Neural Diffusion Engines...</p>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.div 
                     key="content"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.5 }}
                     className="relative max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
                  >
                     <img 
                       src={generatedImage} 
                       alt="Generated AI" 
                       className="w-full h-auto object-cover max-h-[450px]"
                     />
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 pointer-events-none">
                       <button
                         onClick={() => handleDownload(generatedImage, imagePrompt)}
                         className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white pointer-events-auto transition-transform hover:scale-110 shadow-lg"
                         title="Download Image"
                       >
                         <Download className="w-5 h-5" />
                       </button>
                       <a
                         href={generatedImage}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white pointer-events-auto transition-transform hover:scale-110 shadow-lg border border-white/10"
                         title="View Full Resolution"
                       >
                         <Eye className="w-5 h-5" />
                       </a>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                     key="empty"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className='h-full flex flex-col justify-center items-center text-center text-gray-500 gap-4'
                  >
                     <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center mb-2 border border-white/5 shadow-inner">
                        <Image className='w-10 h-10 text-gray-600 animate-pulse' />
                     </div>
                     <div>
                       <h3 className="text-lg font-medium text-gray-300">Image Studio</h3>
                       <p className="max-w-xs mt-1 text-sm text-gray-500">Provide an image prompt description on the left parameters sidebar to initialize the AI synthesis engine.</p>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* History section */}
      {history.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 glass-card p-6 border border-white/10 bg-neutral-950/80 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Generation History
            </h2>
            <button 
              onClick={clearHistory}
              className="text-xs text-gray-500 hover:text-red-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="group relative rounded-xl overflow-hidden border border-white/5 bg-black/40 hover:border-purple-500/30 transition-all hover:scale-[1.03] shadow-md cursor-pointer"
                onClick={() => setGeneratedImage(item.url)}
              >
                <img src={item.url} alt={item.prompt} className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                  <p className="text-[10px] text-white line-clamp-2 leading-tight">{item.prompt}</p>
                  <span className="text-[8px] text-purple-400 uppercase font-mono mt-1 font-bold">{item.style}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GenerateImages;

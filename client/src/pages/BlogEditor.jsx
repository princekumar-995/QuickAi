import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Upload, Image as ImageIcon, FileText, Loader2, 
  ArrowLeft, X, ChevronDown, Bold, Heading2, AlignLeft, List,
  PenTool, Brain, Check, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/blogs`;

const CategoriesList = [
  'Technology',
  'Health',
  'Lifestyle',
  'Travel',
  'Food',
  'Insurance',
  'AI & Machine Learning',
  'Web Development',
  'Design & UX',
  'Finance',
  'Sports',
  'Entertainment',
  'Education',
  'Photography'
];

const BlogEditor = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab State: 'manual' or 'ai'
  const [activeTab, setActiveTab] = useState('manual');

  // Form Field States
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [thumbnail, setThumbnail] = useState(''); // Base64 cover image
  const [submitting, setSubmitting] = useState(false);
  const [activeTool, setActiveTool] = useState('');

  // AI Option Input States
  const [aiTopic, setAiTopic] = useState('');
  const [aiImagePreview, setAiImagePreview] = useState(''); // Base64 context image
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiStatusStep, setAiStatusStep] = useState(0);

  const textareaRef = useRef(null);

  const aiStatusMessages = [
    "Uploading context assets...",
    "Sending guidelines to Gemini AI...",
    "Analyzing topic structure and metadata...",
    "Generating SEO titles and tags...",
    "Drafting rich HTML paragraphs...",
    "Formatting layout templates..."
  ];

  // AI Loading status steps interval
  useEffect(() => {
    let interval;
    if (aiGenerating) {
      interval = setInterval(() => {
        setAiStatusStep((prev) => (prev + 1) % aiStatusMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [aiGenerating]);

  // Load state if editing a post
  useEffect(() => {
    if (location.state?.editBlog) {
      const blog = location.state.editBlog;
      setEditingId(blog.id);
      setTitle(blog.title || '');
      setContent(blog.content || '');
      setCategory(blog.category || 'Technology');
      setThumbnail(blog.thumbnail || '');
      toast.success('Loaded article for editing! ✏️');
      setActiveTab('manual'); // force to manual editor for review
      
      // Clear navigation history state to prevent re-populating on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle Cover image file upload (Base64 conversion)
  const handleThumbnailChange = (e, target = 'thumbnail') => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (target === 'ai') {
        setAiImagePreview(reader.result);
      } else {
        setThumbnail(reader.result);
      }
      toast.success('Image loaded successfully! 📸');
    };
    reader.readAsDataURL(file);
  };

  // Notion/Medium-style toolbar tagging helper
  const insertTag = (tagOpen, tagClose = '', toolName = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end);
    
    const replacement = tagOpen + (selectedText || 'text') + tagClose;
    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);
    
    setContent(newContent);
    setActiveTool(toolName);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + tagOpen.length,
        start + tagOpen.length + (selectedText || 'text').length
      );
    }, 50);
  };

  // Generate with AI handler
  const handleAiGenerate = async () => {
    if (!aiTopic.trim() && !aiImagePreview) {
      toast.error('Please enter a topic, title context, or upload an image first.');
      return;
    }

    setAiGenerating(true);
    setAiStatusStep(0);
    const toastId = toast.loading('Quick.ai Co-Writer is drafting your blog...');

    try {
      const token = await getToken();
      const response = await axios.post(`${API_BASE}/ai/generate`, {
        topic: aiTopic.trim(),
        image: aiImagePreview || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const { title: gTitle, content: gContent, category: gCat } = response.data.blog;
        
        setTitle(gTitle || '');
        setContent(gContent || '');
        if (gCat && CategoriesList.includes(gCat)) {
          setCategory(gCat);
        }
        
        // If they uploaded a context image, pre-fill it as the blog cover thumbnail
        if (aiImagePreview) {
          setThumbnail(aiImagePreview);
        }

        toast.success('AI Drafting complete! Loaded in editor.', { id: toastId });
        setActiveTab('manual'); // switch back to manual tab so they can review and edit
      } else {
        toast.error(response.data.message || 'AI Generation failed.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('AI Generation crashed. Make sure OpenRouter key is set in .env.', { id: toastId });
    } finally {
      setAiGenerating(false);
    }
  };

  // Submit and Publish post
  const handlePublish = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to publish articles.');
      openSignIn();
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a blog title.');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter blog content.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(editingId ? 'Saving changes...' : 'Publishing blog post...');

    const blogData = {
      title: title.trim(),
      description: title.trim(),
      content: content.trim(),
      category: category,
      tags: [category.toLowerCase().replace(/\s+/g, '-'), 'quickai'],
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    };

    try {
      const token = await getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      let response;
      if (editingId) {
        response = await axios.put(`${API_BASE}/${editingId}`, blogData, config);
      } else {
        response = await axios.post(API_BASE, blogData, config);
      }

      if (response.data.success) {
        toast.success(editingId ? 'Changes saved successfully! 📝' : 'Post published successfully! 🚀', { id: toastId });
        navigate('/ai/blogs');
      } else {
        toast.error(response.data.message || 'Error saving post.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Server connection error.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full relative text-white bg-transparent">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/ai/blogs')}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </button>
        <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400">
          {editingId ? 'Edit Blog Post' : 'Quick.ai Publisher'}
        </span>
      </div>

      {/* Editor Content Area */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Futuristic Content Option Tabs */}
        <div className="flex bg-neutral-900/60 p-1.5 rounded-2xl border border-white/10 max-w-max">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'manual' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4" />
            Write Manually
          </button>
          
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ai' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/25' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Generate From AI
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8 bg-neutral-950/40 border border-white/10 rounded-3xl space-y-6 relative overflow-hidden"
        >
          {/* Header Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>

          <AnimatePresence mode="wait">
            
            {/* OPTION 1: WRITE MANUALLY */}
            {activeTab === 'manual' && (
              <motion.div
                key="manual-editor"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-outfit font-black text-white">Manual Writer</h2>
                  <p className="text-slate-400 text-xs mt-1">Compose your article detail structures manually.</p>
                </div>

                <form onSubmit={handlePublish} className="space-y-6">
                  
                  {/* Thumbnail Cover Image */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Cover Image</label>
                    <div className="flex flex-col items-center justify-center border border-dashed border-white/15 hover:border-purple-500/40 rounded-2xl p-6 bg-black/40 text-center relative transition-all group min-h-[160px]">
                      {thumbnail ? (
                        <div className="w-full relative flex flex-col items-center">
                          <img src={thumbnail} alt="Cover Preview" className="max-h-44 rounded-xl object-contain border border-white/10" />
                          <button 
                            type="button"
                            onClick={() => setThumbnail('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 cursor-pointer shadow-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleThumbnailChange(e, 'thumbnail')}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Upload className="w-8 h-8 text-slate-500 group-hover:text-purple-400 transition-colors mb-2 animate-pulse" />
                          <p className="text-xs font-semibold text-slate-300">Drag & drop cover image or browse</p>
                          <p className="text-[10px] text-slate-500 mt-1">Supports PNG, JPG, WEBP (Max 2MB)</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Title and Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Blog Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Blog Title</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a catchy blog title..."
                        className="w-full px-4 py-3.5 border border-white/10 rounded-xl text-xs outline-none bg-black/40 text-white focus:border-purple-500/50 transition-all font-semibold"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Choose Blog Type</label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3.5 border border-white/10 rounded-xl bg-black/40 text-xs text-white appearance-none cursor-pointer focus:border-purple-500/50 outline-none font-semibold"
                        >
                          {CategoriesList.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#0b0f1a] text-white">{cat}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Rich Text Editor Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Blog Content</label>
                    
                    <div className="flex flex-col border border-white/10 rounded-2xl overflow-hidden bg-black/25 focus-within:border-purple-500/40 transition-all">
                      
                      {/* Modern notions formatting helper */}
                      <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-[#0d0d12]/90 backdrop-blur-md border-b border-white/10">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mr-2">Formatting:</span>
                        
                        <button 
                          type="button" 
                          onClick={() => insertTag('<strong>', '</strong>', 'bold')}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:border-purple-500/40 cursor-pointer ${
                            activeTool === 'bold' 
                              ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Bold className="w-3.5 h-3.5" /> Bold
                        </button>

                        <button 
                          type="button" 
                          onClick={() => insertTag('<h2>', '</h2>', 'heading')}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:border-purple-500/40 cursor-pointer ${
                            activeTool === 'heading' 
                              ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Heading2 className="w-3.5 h-3.5" /> Header
                        </button>

                        <button 
                          type="button" 
                          onClick={() => insertTag('<p>', '</p>', 'paragraph')}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:border-purple-500/40 cursor-pointer ${
                            activeTool === 'paragraph' 
                              ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <AlignLeft className="w-3.5 h-3.5" /> Paragraph
                        </button>

                        <button 
                          type="button" 
                          onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>\n', 'list')}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] hover:border-purple-500/40 cursor-pointer ${
                            activeTool === 'list' 
                              ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <List className="w-3.5 h-3.5" /> List
                        </button>
                      </div>

                      <textarea
                        ref={textareaRef}
                        id="editor-textarea"
                        required
                        rows={14}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-4 outline-none border-none text-xs font-mono bg-transparent text-slate-300 resize-y min-h-[300px] leading-relaxed"
                        placeholder="Draft details manually here..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-xl text-sm shadow-md border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving Article...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        {editingId ? 'Save Article Changes' : 'Publish Blog Post'}
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* OPTION 2: GENERATE FROM AI */}
            {activeTab === 'ai' && (
              <motion.div
                key="ai-generator"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-outfit font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                    AI Co-Writer Studio
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">Provide a prompt, title, or image and let Gemini draft the content instantly.</p>
                </div>

                <div className="space-y-5">
                  {/* Topic Prompt Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Enter Topic / Context (Required)</label>
                    <textarea
                      rows={3}
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="Enter a title prompt or topic details, e.g. 'Virat Kohli's career statistics' or 'Top web development trends in 2026'..."
                      className="w-full p-3.5 text-xs rounded-xl border border-white/10 bg-black/40 text-white outline-none focus:border-purple-500/50 resize-none shadow-inner"
                    />
                  </div>

                  {/* Context Image Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Context Image Upload (Optional)</label>
                    <div className="flex flex-col items-center justify-center border border-dashed border-white/15 hover:border-purple-500/40 rounded-2xl p-6 bg-black/40 text-center relative transition-all group min-h-[160px]">
                      {aiImagePreview ? (
                        <div className="w-full relative flex flex-col items-center">
                          <img src={aiImagePreview} alt="AI Context Preview" className="max-h-40 rounded-xl object-contain border border-white/10" />
                          <button 
                            type="button"
                            onClick={() => setAiImagePreview('')}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 cursor-pointer shadow-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleThumbnailChange(e, 'ai')}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Upload className="w-8 h-8 text-slate-500 group-hover:text-purple-400 transition-colors mb-2" />
                          <p className="text-xs font-semibold text-slate-300">Drag & drop image or browse</p>
                          <p className="text-[10px] text-slate-500 mt-1">Supports PNG, JPG, WEBP (Max 2MB)</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* "Generate From API" Trigger */}
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={aiGenerating}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-xl text-sm shadow-md border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Post...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 animate-pulse" />
                        Generate From API
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full-screen Loading Overlay for manual submit */}
      {submitting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            <span className="text-sm font-semibold tracking-wider text-slate-300">
              {editingId ? 'Saving changes...' : 'Publishing blog details...'}
            </span>
          </div>
        </div>
      )}

      {/* Glowing AI Generation Status Overlay */}
      <AnimatePresence>
        {aiGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-white"
          >
            <div className="relative flex flex-col items-center p-8 max-w-sm text-center">
              <div className="w-20 h-20 rounded-full border-2 border-purple-500/20 border-t-purple-500 border-r-purple-500 animate-spin flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.25)]">
                <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              </div>
              
              <h3 className="text-lg font-outfit font-black tracking-wide mt-6 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Quick.ai Co-Writer
              </h3>
              
              <p className="text-slate-300 text-xs mt-3 font-semibold min-h-[40px] flex items-center justify-center leading-relaxed">
                {aiStatusMessages[aiStatusStep]}
              </p>

              <div className="w-32 h-0.5 bg-white/5 rounded-full overflow-hidden mt-6 relative">
                <motion.div 
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 absolute w-1/2"
                />
              </div>

              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-6">scanning document structure</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BlogEditor;

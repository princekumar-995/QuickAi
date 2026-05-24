import React, { useState, useEffect, useRef } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Upload, Image as ImageIcon, Trash2, Edit3, 
  FileText, Bold, Italic, Link as LinkIcon, Heading2, 
  Heading3, List, Quote, Code, Eye, Loader2,
  Calendar, Check, X, RefreshCw, Star, Heart, FileDown, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/blogs`;

const CategoriesList = [
  'Technology',
  'Health',
  'Insurance',
  'Lifestyle',
  'Travel',
  'Food',
  'AI & Machine Learning',
  'Web Development',
  'Design & UX',
  'Finance',
  'Startup',
  'Cyber Security',
  'Education',
  'Photography',
  'Sports',
  'Entertainment'
];

const CreateBlog = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [myBlogs, setMyBlogs] = useState([]);
  const [categories, setCategories] = useState(CategoriesList);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  
  // Editor Form Fields
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState([]);
  const [thumbnail, setThumbnail] = useState(''); // Base64 string
  
  // Editor Tabs
  const [editorSubTab, setEditorSubTab] = useState('edit'); // 'edit' or 'preview'
  const contentAreaRef = useRef(null);

  // AI Generator Fields
  const [aiTopic, setAiTopic] = useState('');
  const [aiImage, setAiImage] = useState(null);
  const [aiImagePreview, setAiImagePreview] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiStatusStep, setAiStatusStep] = useState(0);

  const aiStatusMessages = [
    "Uploading and scanning image assets...",
    "Sending content guidelines to Gemini API...",
    "Analyzing visual contexts and metadata...",
    "Drafting SEO-friendly title and categories...",
    "Generating tags and writing full rich article...",
    "Formatting HTML wrappers and parsing responses..."
  ];

  // Fetch Logged-in User's Blogs
  const fetchMyBlogs = async () => {
    if (!user) return;
    setLoadingBlogs(true);
    try {
      const response = await axios.get(`${API_BASE}/author/list`);
      if (response.data.success) {
        setMyBlogs(response.data.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching creator blogs:', error);
      toast.error('Failed to load your blogs.');
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBlogs();
    }
  }, [user]);

  // Handle Edit Trigger from details redirect
  useEffect(() => {
    if (location.state?.editBlog) {
      handleEditBlogTrigger(location.state.editBlog);
      // Clear navigation history state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // AI loading status loop
  useEffect(() => {
    let interval;
    if (aiGenerating) {
      interval = setInterval(() => {
        setAiStatusStep((prev) => (prev + 1) % aiStatusMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [aiGenerating]);

  // Check if draft template exists in LocalStorage
  useEffect(() => {
    const localDraft = localStorage.getItem('quickai_blog_draft');
    if (localDraft && !editingBlogId && !title) {
      try {
        const parsed = JSON.parse(localDraft);
        toast((t) => (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-300">Unsaved draft found locally. Restore it?</span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setTitle(parsed.title || '');
                  setDescription(parsed.description || '');
                  setContent(parsed.content || '');
                  setCategory(parsed.category || 'Technology');
                  setTags(parsed.tags || []);
                  setTagsInput((parsed.tags || []).join(', '));
                  setThumbnail(parsed.thumbnail || '');
                  toast.dismiss(t.id);
                  toast.success('Draft restored!');
                }}
                className="bg-purple-600 px-3 py-1 rounded text-[10px] font-bold text-white cursor-pointer"
              >
                Yes
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('quickai_blog_draft');
                  toast.dismiss(t.id);
                }}
                className="bg-white/10 px-3 py-1 rounded text-[10px] font-bold text-slate-400 cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        ), { duration: 6000 });
      } catch (e) {
        localStorage.removeItem('quickai_blog_draft');
      }
    }
  }, []);

  // Handle Thumbnail File Change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle AI Image File Change
  const handleAiImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image size exceeds 3MB limit.');
      return;
    }

    setAiImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAiImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Trigger AI Generation
  const handleAiGenerate = async () => {
    if (!aiTopic && !aiImagePreview) {
      toast.error('Please enter a topic or upload an image.');
      return;
    }

    setAiGenerating(true);
    setAiStatusStep(0);
    const toastId = toast.loading('AI is crafting your blog post...');

    try {
      const response = await axios.post(`${API_BASE}/ai/generate`, {
        topic: aiTopic,
        image: aiImagePreview || null
      });

      if (response.data.success) {
        const { title: aiTitle, description: aiDesc, content: aiContent, category: aiCat, tags: aiTags } = response.data.blog;
        
        setTitle(aiTitle || '');
        setDescription(aiDesc || '');
        setContent(aiContent || '');
        if (aiCat && categories.includes(aiCat)) {
          setCategory(aiCat);
        }
        setTags(aiTags || []);
        setTagsInput((aiTags || []).join(', '));
        
        if (aiImagePreview) {
          setThumbnail(aiImagePreview);
        }

        toast.success('AI generation complete! Review your details.', { id: toastId });
      } else {
        toast.error(response.data.message || 'Generation failed', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('AI generation crashed. Check server keys.', { id: toastId });
    } finally {
      setAiGenerating(false);
    }
  };

  // Rich toolbar inserts
  const insertTextMarkup = (before, after = '') => {
    const textarea = contentAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selection = currentVal.substring(start, end);
    
    const replacement = before + (selection || 'text') + after;
    setContent(currentVal.substring(0, start) + replacement + currentVal.substring(end));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selection || 'text').length);
    }, 50);
  };

  const handleTagsInputBlur = () => {
    if (!tagsInput) return;
    const parsed = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    setTags(parsed);
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit Blog
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      toast.error('Please fill out Title, Category, and Content.');
      return;
    }

    setSubmitting(true);
    const blogData = {
      title,
      description: description || title,
      content,
      category,
      tags,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    };

    try {
      let response;
      if (editingBlogId) {
        response = await axios.put(`${API_BASE}/${editingBlogId}`, blogData);
      } else {
        response = await axios.post(API_BASE, blogData);
      }

      if (response.data.success) {
        toast.success(editingBlogId ? 'Blog updated successfully! 📝' : 'Blog published successfully! 🚀');
        localStorage.removeItem('quickai_blog_draft'); // clear draft
        clearForm();
        fetchMyBlogs();
      } else {
        toast.error(response.data.message || 'Failed to save blog.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server encountered an error saving the blog.');
    } finally {
      setSubmitting(false);
    }
  };

  // Save Draft (Local & Server DB)
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('Please enter at least a Title to save a draft.');
      return;
    }

    setSavingDraft(true);
    
    // Save to LocalStorage
    const draftData = {
      title,
      description,
      content,
      category,
      tags,
      thumbnail
    };
    localStorage.setItem('quickai_blog_draft', JSON.stringify(draftData));

    // Save to server database with a [Draft] marker in the title
    const draftBlogData = {
      title: title.startsWith('[Draft]') ? title : `[Draft] ${title}`,
      description: description || title,
      content,
      category,
      tags,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    };

    try {
      let response;
      if (editingBlogId) {
        response = await axios.put(`${API_BASE}/${editingBlogId}`, draftBlogData);
      } else {
        response = await axios.post(API_BASE, draftBlogData);
      }

      if (response.data.success) {
        toast.success('Draft saved globally and locally! 💾');
        fetchMyBlogs();
      } else {
        toast.error('Failed to sync draft to server.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Draft synced locally only.');
    } finally {
      setSavingDraft(false);
    }
  };

  // Populate Edit fields
  const handleEditBlogTrigger = (blog) => {
    setEditingBlogId(blog.id);
    setTitle(blog.title);
    setDescription(blog.description);
    setContent(blog.content);
    setCategory(blog.category);
    setTags(blog.tags || []);
    setTagsInput((blog.tags || []).join(', '));
    setThumbnail(blog.thumbnail);
    toast.success(`Editing: "${blog.title.slice(0, 15)}..."`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const response = await axios.delete(`${API_BASE}/${blogId}`);
      if (response.data.success) {
        toast.success('Blog deleted.');
        fetchMyBlogs();
      }
    } catch (err) {
      toast.error('Failed to delete blog.');
    }
  };

  const clearForm = () => {
    setEditingBlogId(null);
    setTitle('');
    setDescription('');
    setContent('');
    setCategory('Technology');
    setTags([]);
    setTagsInput('');
    setThumbnail('');
    setAiTopic('');
    setAiImage(null);
    setAiImagePreview('');
  };

  return (
    <div className="w-full relative text-white bg-transparent">
      
      {/* Premium Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-purple-950/20 via-[#050508]/40 to-pink-950/20 border border-white/10 mb-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <h1 className="text-2xl font-outfit font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            AI Blogging Studio
          </h1>
          <p className="text-slate-400 text-xs mt-1">Draft articles, build templates manually, or let Gemini analyze visual context to generate complete SEO articles.</p>
        </div>
        <button
          onClick={() => navigate('/ai/blogs')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" /> Back to Articles
        </button>
      </motion.div>

      {/* 🚀 Two-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* ================= LEFT COLUMN: AI GENERATION & UPLOAD (col-span-4) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Generator Panel */}
          <div className="glass-card p-6 border border-purple-500/20 hover:border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.1)] rounded-3xl space-y-5 relative overflow-hidden group transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            
            <h3 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-purple-400" />
              AI Generating Context
            </h3>
            
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Upload an image, and Quick.ai will interpret its context to draft a full-length article, catchy title, suggested category, and relevant search tags.
            </p>

            {/* Drag & Drop Upload box */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wide">Image Upload (Required)</label>
              <div className="flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-purple-500/40 rounded-xl p-4 bg-black/40 text-center relative transition-all group min-h-[160px]">
                {aiImagePreview ? (
                  <div className="w-full relative flex flex-col items-center">
                    <img src={aiImagePreview} alt="" className="max-h-36 rounded-lg object-contain border border-white/10" />
                    <button 
                      onClick={() => { setAiImage(null); setAiImagePreview(''); }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-700 cursor-pointer shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAiImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-purple-400 transition-colors mb-2" />
                    <p className="text-xs font-semibold text-slate-300">Drag & drop image or browse</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Supports PNG, JPG (Max 3MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Optional Topic text */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wide">Optional Topic Context</label>
              <textarea
                rows={3}
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="w-full p-3.5 text-xs rounded-xl border border-white/10 bg-black/40 outline-none text-white focus:border-purple-500/50 resize-none shadow-inner"
                placeholder="Give AI specific topics or themes to write about..."
              />
            </div>

            {/* AI Generate trigger */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAiGenerate}
              disabled={aiGenerating}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl text-xs shadow border border-white/10 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </motion.button>
          </div>

          {/* Thumbnail Drag & Drop (for manual uploads) */}
          <div className="glass-card p-6 border border-white/10 rounded-3xl space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <ImageIcon className="w-4.5 h-4.5 text-purple-400" />
              Manual Cover Image
            </h3>
            
            <div className="flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-purple-500/40 rounded-xl p-4 bg-black/40 text-center relative transition-all group min-h-[140px]">
              {thumbnail ? (
                <div className="w-full relative flex flex-col items-center">
                  <img src={thumbnail} alt="" className="max-h-28 rounded-lg object-contain border border-white/10" />
                  <button 
                    type="button"
                    onClick={() => setThumbnail('')}
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-red-600/90 text-white hover:bg-red-700 cursor-pointer shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <ImageIcon className="w-8 h-8 text-slate-500 group-hover:text-purple-400 transition-colors mb-2" />
                  <p className="text-xs font-semibold text-slate-400">Drag & drop cover or click to browse</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">Recommended 16:9 ratio (Max 2MB)</p>
                </>
              )}
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: EDITOR CORE (col-span-8) ================= */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 md:p-8 bg-neutral-950/40 border border-white/10 rounded-3xl space-y-5">
            
            {/* Editing Header */}
            {editingBlogId && (
              <div className="flex justify-between items-center bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-xl">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5 animate-spin" />
                  Editing Article Mode (ID: {editingBlogId})
                </span>
                <button 
                  type="button" 
                  onClick={clearForm}
                  className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel Edit
                </button>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Blog Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging, click-worthy title..."
                className="w-full px-4 py-3 border border-white/10 rounded-xl text-sm outline-none bg-black/40 text-white focus:border-purple-500/50 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Short Summary / Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief 2-sentence summary for the post listing cards..."
                className="w-full p-4 border border-white/10 rounded-xl text-xs outline-none bg-black/40 text-white focus:border-purple-500/50 transition-all resize-none"
              />
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 outline-none border border-white/10 rounded-xl bg-black text-xs text-white appearance-none cursor-pointer focus:border-purple-500/50"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Custom Rich Text Editor */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/10 pb-3 mb-2 gap-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">Blog Content</label>
                
                {/* Editor sub tabs */}
                <div className="flex gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditorSubTab('edit')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                      editorSubTab === 'edit' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Edit Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorSubTab('preview')}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                      editorSubTab === 'preview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              {editorSubTab === 'edit' ? (
                <div className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-black/25 focus-within:border-purple-500/40">
                  {/* Rich Text Toolbar */}
                  <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#0f0f15] border-b border-white/10">
                    <button type="button" onClick={() => insertTextMarkup('<strong>', '</strong>')} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertTextMarkup('<em>', '</em>')} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertTextMarkup('<a href="https://" target="_blank">', '</a>')} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white" title="Hyperlink"><LinkIcon className="w-3.5 h-3.5" /></button>
                    <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                    <button type="button" onClick={() => insertTextMarkup('<h2>', '</h2>')} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white" title="Header H2"><Heading2 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertTextMarkup('<h3>', '</h3>')} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white" title="Header H3"><Heading3 className="w-3.5 h-3.5" /></button>
                    <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                    <button type="button" onClick={() => insertTextMarkup('<ul>\n  <li>', '</li>\n</ul>')} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertTextMarkup('<blockquote>', '</blockquote>')} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white" title="Blockquote"><Quote className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertTextMarkup('<pre><code>', '</code></pre>')} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white" title="Code Block"><Code className="w-3.5 h-3.5" /></button>
                  </div>
                  
                  <textarea
                    ref={contentAreaRef}
                    required
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-4 outline-none border-none text-xs font-mono bg-transparent text-slate-300 resize-y"
                    placeholder="Write article details here..."
                  />
                </div>
              ) : (
                /* Live preview */
                <div className="w-full border border-white/10 rounded-xl p-5 bg-black/40 min-h-[280px] overflow-y-auto max-h-[400px] prose prose-invert max-w-none text-xs text-slate-300">
                  {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  ) : (
                    <p className="text-slate-600 italic">No content written yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Tags cloud */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Search Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onBlur={handleTagsInputBlur}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleTagsInputBlur(); } }}
                placeholder="tech, ai, code (separated by comma)..."
                className="w-full px-4 py-3 border border-white/10 rounded-xl text-xs outline-none bg-black text-white focus:border-purple-500/50"
              />
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {tags.map((t, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[10px] font-bold">
                      #{t}
                      <button type="button" onClick={() => removeTag(idx)} className="text-purple-400 hover:text-white cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <motion.button
                type="button"
                onClick={handlePublish}
                disabled={submitting}
                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold rounded-xl text-xs shadow-md border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    {editingBlogId ? 'Save Changes' : 'Publish Blog'}
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {savingDraft ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Draft...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Save Draft
                  </>
                )}
              </motion.button>

              {(title || content || thumbnail) && (
                <button 
                  type="button"
                  onClick={clearForm}
                  className="text-xs font-semibold text-slate-500 hover:text-white ml-auto"
                >
                  Clear Form
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* ================= OWN ARTICLES TABLE SECTION ================= */}
      <div className="glass-card p-6 md:p-8 bg-neutral-950/40 border border-white/10 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-purple-400" />
              My Published Articles
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Manage, review likes, view stats, and edit your posts.</p>
          </div>
          
          <button 
            onClick={fetchMyBlogs} 
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-slate-400 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {loadingBlogs ? (
          <div className="space-y-3 py-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 w-full bg-neutral-900 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : myBlogs.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center">
            <p className="text-slate-500 text-xs italic">You haven't written any articles yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-4">Post</th>
                  <th className="pb-3">Stats</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myBlogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 pl-4 flex items-center gap-3">
                      <img src={blog.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                      <div className="flex flex-col">
                        <span 
                          onClick={() => navigate(`/ai/blogs/${blog.id}`)}
                          className="font-bold text-white hover:text-purple-400 cursor-pointer line-clamp-1 max-w-[240px]"
                        >
                          {blog.title}
                        </span>
                        <span className="text-[9px] font-bold text-purple-400 mt-0.5">{blog.category}</span>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-3 text-slate-400">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {blog.views_count || 0}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {blog.likes_count || 0}</span>
                      </div>
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold text-white">{blog.rating || '0.0'}</span>
                        <span className="text-slate-500">({blog.rating_count || 0})</span>
                      </div>
                    </td>

                    <td className="py-4 text-slate-400 font-medium">{new Date(blog.created_at).toLocaleDateString()}</td>

                    <td className="py-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditBlogTrigger(blog)}
                          className="p-2 rounded-lg hover:bg-purple-600/20 text-purple-400 hover:text-purple-300 border border-transparent cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="p-2 rounded-lg hover:bg-red-600/20 text-red-500 hover:text-red-400 border border-transparent cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🧬 AI GENERATING LOADER OVERLAY */}
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

              <div className="w-32 h-0.5 bg-white/5 rounded-full overflow-hidden mt-6">
                <motion.div 
                  initial={{ left: '-100%' }}
                  animate={{ left: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 relative w-1/2"
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

export default CreateBlog;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, MessageSquare, Bookmark, Share2, Clock, 
  Calendar, ArrowRight, Sparkles, Filter, ChevronDown, 
  Newspaper, Check, Loader2, ArrowUpRight, Edit3, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/blogs`;

const CategoriesList = [
  'All',
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

const Blogs = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  // State Management
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(CategoriesList);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sort, setSort] = useState('Latest');
  
  // Infinite Scroll State
  const [visibleBlogsCount, setVisibleBlogsCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likesInProgress, setLikesInProgress] = useState({});
  const [bookmarksInProgress, setBookmarksInProgress] = useState({});
  
  // Local state cache for likes and bookmarks to update UI instantly
  const [userLikes, setUserLikes] = useState({});
  const [userBookmarks, setUserBookmarks] = useState({});

  const loadMoreRef = useRef(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}?sort=${sort}`;
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (selectedTag) {
        url += `&tag=${encodeURIComponent(selectedTag)}`;
      }

      const response = await axios.get(url);
      if (response.data.success) {
        setBlogs(response.data.blogs || []);
        if (response.data.tags) {
          setTags(response.data.tags);
        }
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs. Make sure server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    setVisibleBlogsCount(6); // reset page count
  }, [selectedCategory, selectedTag, sort]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Infinite Scroll Trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleBlogsCount < blogs.length) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleBlogsCount((prev) => Math.min(prev + 6, blogs.length));
            setLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, blogs, visibleBlogsCount]);

  // Handle Like Interaction
  const handleLike = async (blogId, e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to like blog posts!');
      openSignIn();
      return;
    }

    if (likesInProgress[blogId]) return;

    setLikesInProgress(prev => ({ ...prev, [blogId]: true }));
    try {
      const response = await axios.post(`${API_BASE}/${blogId}/like`, {});
      if (response.data.success) {
        setBlogs(prev => prev.map(b => {
          if (b.id === blogId) {
            return {
              ...b,
              likes_count: response.data.likes_count
            };
          }
          return b;
        }));
        setUserLikes(prev => ({ ...prev, [blogId]: response.data.liked }));
        toast.success(response.data.liked ? 'Added to Liked posts! ❤️' : 'Like removed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update like status');
    } finally {
      setLikesInProgress(prev => ({ ...prev, [blogId]: false }));
    }
  };

  // Handle Bookmark
  const handleBookmark = async (blogId, e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to bookmark articles!');
      openSignIn();
      return;
    }

    if (bookmarksInProgress[blogId]) return;

    setBookmarksInProgress(prev => ({ ...prev, [blogId]: true }));
    try {
      const response = await axios.post(`${API_BASE}/${blogId}/bookmark`, {});
      if (response.data.success) {
        setUserBookmarks(prev => ({ ...prev, [blogId]: response.data.bookmarked }));
        toast.success(response.data.bookmarked ? 'Saved to Bookmarks! 🔖' : 'Bookmark removed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update bookmark status');
    } finally {
      setBookmarksInProgress(prev => ({ ...prev, [blogId]: false }));
    }
  };

  // Handle Share
  const handleShare = (blogId, title, e) => {
    e.stopPropagation();
    const blogUrl = `${window.location.origin}/ai/blog/${blogId}`;
    navigator.clipboard.writeText(blogUrl);
    toast.success('Link copied to clipboard! 🔗');
  };

  // Estimate reading time
  const calculateReadingTime = (content) => {
    if (!content) return '3 min read';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  // Category Colors
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Technology':
      case 'AI & Machine Learning':
        return 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30';
      case 'Web Development':
      case 'Cyber Security':
        return 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30';
      case 'Design & UX':
      case 'Photography':
        return 'from-pink-500/20 to-pink-600/10 text-pink-400 border-pink-500/30';
      case 'Startup':
      case 'Finance':
        return 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30';
      case 'Health':
      case 'Insurance':
        return 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30';
      case 'Travel':
      case 'Lifestyle':
        return 'from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30';
      case 'Food':
      case 'Entertainment':
      case 'Sports':
        return 'from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="w-full relative text-white bg-transparent">
      
      {/* 🚀 Welcome Landing Section */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden p-6 md:p-10 rounded-3xl bg-gradient-to-br from-indigo-950/20 via-[#050508]/40 to-purple-950/20 border border-white/10 flex flex-col lg:flex-row items-center gap-8 mb-12 shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
      >
        {/* Glow Orb inside card */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-purple-600/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-pink-500/10 rounded-full blur-[60px] pointer-events-none"></div>
 
        {/* Left Side Content */}
        <div className="flex-1 space-y-5 text-center lg:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 font-bold text-[10px] tracking-wider uppercase mb-1 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Quick.ai Publishing
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-300">
            Welcome to Quick.ai Blogging
          </h2>
          
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Create, share, and explore powerful AI-generated blogs. Write rich tutorials manually, or let Gemini build draft layouts complete with thumbnail interpretation.
          </p>
 
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/ai/create-blog/editor")}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl text-sm cursor-pointer shadow border border-white/10 group transition-all"
            >
              Get Started 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
 
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                navigate('/ai/blogs');
                setTimeout(() => {
                  document.getElementById('feed-hub')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl text-sm cursor-pointer border border-white/10 transition-all"
            >
              Explore Blogs
            </motion.button>
          </div>
        </div>

        {/* Right Side Illustration */}
        <div className="flex-1 w-full max-w-xs md:max-w-none flex justify-center items-center relative z-10">
          <svg className="w-full h-auto max-w-[280px] filter drop-shadow-[0_8px_20px_rgba(168,85,247,0.1)]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="250" r="160" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
            <circle cx="250" cy="250" r="120" stroke="#ec4899" strokeWidth="1" strokeDasharray="10 5" opacity="0.4" />
            
            <defs>
              <radialGradient id="illustrationGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#050508" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="250" r="100" fill="url(#illustrationGlow)" />

            {/* Simulated browser card mockup */}
            <rect x="175" y="190" width="150" height="120" rx="16" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" backdrop-filter="blur(8px)" />
            <circle cx="195" cy="205" r="4" fill="#ef4444" />
            <circle cx="205" cy="205" r="4" fill="#eab308" />
            <circle cx="215" cy="205" r="4" fill="#22c55e" />

            <rect x="195" y="222" width="110" height="8" rx="4" fill="#a855f7" opacity="0.8" />
            <rect x="195" y="240" width="80" height="5" rx="2" fill="#cbd5e1" opacity="0.6" />
            <rect x="195" y="252" width="95" height="5" rx="2" fill="#cbd5e1" opacity="0.6" />
            <rect x="195" y="264" width="50" height="5" rx="2" fill="#ec4899" opacity="0.7" />

            {/* Node Dots */}
            <circle cx="250" cy="90" r="6" fill="#a855f7" />
            <circle cx="350" cy="180" r="4" fill="#ec4899" />
            <circle cx="150" cy="320" r="5" fill="#6366f1" />
            <circle cx="250" cy="410" r="7" fill="#14b8a6" />
          </svg>
        </div>
      </motion.section>

      {/* 🧭 FEED HUB */}
      <section id="feed-hub" className="space-y-8">
        
        {/* Controls Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h3 className="text-2xl font-outfit font-black tracking-tight flex items-center gap-2">
              Explore Articles
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Filter category items, query topics, and read nested community discussions.</p>
          </div>
          
          {/* Search, Filter, Sort Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center w-full xl:w-auto">
            {/* Live Search Bar */}
            <div className="relative flex-1 sm:flex-initial w-full sm:w-80 border border-white/10 rounded-xl flex items-center px-3.5 bg-black/40 shadow-inner focus-within:border-purple-500/50">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs..."
                className="w-full outline-none border-none py-2.5 px-2.5 text-xs bg-transparent placeholder-slate-500 text-slate-200"
              />
            </div>
            
            {/* Sorting Select */}
            <div className="relative w-full sm:w-auto flex-shrink-0">
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-44 appearance-none outline-none font-semibold text-xs rounded-xl pl-4 pr-10 py-3 border border-white/10 bg-black text-white cursor-pointer focus:border-purple-500/50"
              >
                <option value="Latest">Latest</option>
                <option value="Most liked">Most Liked</option>
                <option value="Trending">Trending</option>
                <option value="Most viewed">Most Viewed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Categories checklist wrapped grid */}
        <div className="w-full">
          <div className="flex flex-wrap gap-2 py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedTag(null);
                }}
                className={`text-[11px] font-bold px-3.5 py-2 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-500/20' 
                    : 'bg-[#0f0f15]/50 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tags cloud */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-2.5 border-t border-b border-white/5 text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3" /> Tags:
            </span>
            {tags.map((tg) => (
              <button
                key={tg}
                onClick={() => setSelectedTag(selectedTag === tg ? null : tg)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border cursor-pointer transition-all duration-150 ${
                  selectedTag === tg
                    ? 'bg-pink-600/20 border-pink-500/40 text-pink-400'
                    : 'bg-black/20 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                #{tg}
              </button>
            ))}
            {selectedTag && (
              <button onClick={() => setSelectedTag(null)} className="text-[10px] text-purple-400 font-bold ml-2 hover:underline">Clear Tag Filter</button>
            )}
          </div>
        )}

        {/* FEED BLOG CARD LISTING */}
        {loading ? (
          /* SKELETON LOADER GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass border border-white/10 rounded-2xl overflow-hidden shadow-lg h-[460px] flex flex-col p-4 space-y-4">
                <div className="w-full h-44 bg-neutral-900 animate-pulse rounded-xl"></div>
                <div className="h-5 w-24 bg-neutral-900 animate-pulse rounded-md"></div>
                <div className="h-7 w-5/6 bg-neutral-900 animate-pulse rounded-md"></div>
                <div className="h-4 w-full bg-neutral-900 animate-pulse rounded-md"></div>
                <div className="h-4 w-2/3 bg-neutral-900 animate-pulse rounded-md"></div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 animate-pulse"></div>
                    <div className="h-3 w-16 bg-neutral-900 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-12 bg-neutral-900 animate-pulse rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          /* 🎨 MAPPED EMPTY STATE FIX */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl p-8 max-w-xl mx-auto mt-8 bg-neutral-950/20"
          >
            {/* Glowing Illustration SVG */}
            <div className="relative w-20 h-20 bg-purple-500/10 rounded-full border border-purple-500/25 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.1)] animate-pulse">
              <Newspaper className="w-10 h-10 text-purple-400" />
              <div className="absolute inset-0 bg-pink-500/5 rounded-full blur-md"></div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">No Blogs Found</h3>
            
            <p className="text-slate-400 text-xs max-w-xs mb-8">
              We couldn't find any articles matching your category, tag or search term. Be the first to publish a post!
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/ai/create-blog/editor")}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-semibold px-6 py-3.5 rounded-xl cursor-pointer border border-white/10"
            >
              Write First Blog <Sparkles className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          /* BLOGS GRID */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.slice(0, visibleBlogsCount).map((blog, index) => {
                const isLiked = userLikes[blog.id] ?? false;
                const isBookmarked = userBookmarks[blog.id] ?? false;
                
                return (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index % 3 * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="glass border border-white/10 bg-neutral-950/30 rounded-3xl overflow-hidden flex flex-col h-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] relative group transition-all hover:shadow-[0_8px_35px_rgba(168,85,247,0.15)] hover:border-purple-500/30"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden cursor-pointer" onClick={() => navigate(`/ai/blog/${blog._id || blog.id}`)}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                      <img 
                        src={blog.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Reading Time */}
                      <span className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-lg backdrop-blur-md bg-black/55 text-white border border-white/10">
                        <Clock className="w-2.5 h-2.5 text-purple-400" />
                        {calculateReadingTime(blog.content)}
                      </span>

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => handleBookmark(blog.id, e)}
                        disabled={bookmarksInProgress[blog.id]}
                        className={`absolute top-3.5 right-3.5 z-20 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                          isBookmarked 
                            ? 'bg-pink-500 border-pink-400 text-white' 
                            : 'bg-black/50 border-white/10 text-slate-300 hover:text-white hover:bg-black/80'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      
                      {/* Category Badge & Date */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-md border bg-gradient-to-r ${getCategoryColor(blog.category)}`}>
                          {blog.category}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 
                        onClick={() => navigate(`/ai/blog/${blog._id || blog.id}`)}
                        className="text-base font-outfit font-bold leading-snug cursor-pointer line-clamp-2 text-white group-hover:text-purple-400 transition-colors mb-2"
                      >
                        {blog.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                        {blog.description || blog.title}
                      </p>

                      {/* Footer Actions */}
                      <div className="mt-auto pt-3.5 border-t border-white/5 flex items-center justify-between">
                        
                        {/* Author metadata */}
                        <div className="flex items-center gap-2">
                          <img 
                            src={blog.author_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} 
                            alt={blog.author_name} 
                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                          />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-200 truncate max-w-[80px]">
                              {blog.author_name}
                            </span>
                            <span className="text-[9px] text-slate-500">Author</span>
                          </div>
                        </div>

                        {/* Interactive Counters */}
                        <div className="flex items-center gap-2.5">
                          
                          {/* Like Button */}
                          <button 
                            onClick={(e) => handleLike(blog.id, e)}
                            disabled={likesInProgress[blog.id]}
                            className={`flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                              isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-white'
                            } transition-colors`}
                          >
                            <Heart className="w-3.5 h-3.5" fill={isLiked ? "currentColor" : "none"} />
                            <span>{blog.likes_count || 0}</span>
                          </button>

                          {/* Comment Button */}
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 cursor-pointer" onClick={() => navigate(`/ai/blog/${blog._id || blog.id}`)}>
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{blog.comments_count || 0}</span>
                          </div>

                          {/* Share Button */}
                          <button 
                            onClick={(e) => handleShare(blog.id, blog.title, e)}
                            className="p-1.5 rounded-full hover:bg-white/5 transition-all text-slate-400 hover:text-purple-400 cursor-pointer"
                            title="Copy link"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                        </div>

                      </div>

                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="w-full py-10 flex justify-center items-center">
              {loadingMore && (
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading more posts...
                </div>
              )}
              {!loadingMore && visibleBlogsCount >= blogs.length && blogs.length > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Dashboard feed up to date 🌐
                </span>
              )}
            </div>
          </>
        )}
      </section>
      
    </div>
  );
};

export default Blogs;

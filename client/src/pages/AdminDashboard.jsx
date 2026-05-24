import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, BarChart2, MessageSquare, Newspaper, Users, 
  Trash2, Plus, X, Loader2, ArrowLeft, RefreshCw, Eye,
  Mail, Settings, Check, Sparkles, FolderKanban
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/blogs`;

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // State Management
  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, blogs, comments, categories, subscribers
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBlogs: 0, totalComments: 0, totalSubscribers: 0, totalViews: 0, activeUsers: 0 });
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  
  // Category management input
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  // Fetch admin dashboard details
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/admin/stats`);
      if (response.data.success) {
        setStats(response.data.stats || {});
        setBlogs(response.data.blogs || []);
        setComments(response.data.comments || []);
        setCategories(response.data.categories || []);
        setSubscribers(response.data.subscribers || []);
      } else {
        toast.error(response.data.message || 'Restricted area.');
        navigate('/ai/blogs');
      }
    } catch (err) {
      console.error(err);
      toast.error('Unauthorized access. Admin role required.');
      navigate('/ai/blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAddingCategory(true);
    try {
      const response = await axios.post(`${API_BASE}/categories`, { name: newCategoryName });
      if (response.data.success) {
        toast.success('New category added! 📂');
        setNewCategoryName('');
        fetchAdminData();
      } else {
        toast.error(response.data.message || 'Failed to add category.');
      }
    } catch (err) {
      toast.error('Server error creating category.');
    } finally {
      setAddingCategory(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category? Blogs inside this category won\'t be deleted, but the category pill will be removed.')) return;
    try {
      const response = await axios.delete(`${API_BASE}/categories/${catId}`);
      if (response.data.success) {
        toast.success('Category removed.');
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to delete category.');
    }
  };

  // Delete Inappropriate Blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('ADMIN ALERT: Delete this blog post globally? This action is irreversible.')) return;
    try {
      const response = await axios.delete(`${API_BASE}/${blogId}`);
      if (response.data.success) {
        toast.success('Blog deleted globally.');
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to delete blog.');
    }
  };

  // Delete Inappropriate Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('ADMIN ALERT: Delete this comment globally? This will also remove any nested replies.')) return;
    try {
      const response = await axios.delete(`${API_BASE}/comments/${commentId}`);
      if (response.data.success) {
        toast.success('Comment deleted globally.');
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to delete comment.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-2" />
        <span className="text-sm font-semibold tracking-wider text-slate-400">Verifying administrator credentials...</span>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-[calc(100vh-8rem)]">
      
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-outfit font-black text-white flex items-center gap-2.5">
            <Shield className="w-8 h-8 text-red-500 filter drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
            Admin Moderation Panel
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Global audit tools, user metrics, category organizers, and content moderators.</p>
        </div>

        {/* Refresh button */}
        <button 
          onClick={fetchAdminData}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
        </button>
      </div>

      {/* Admin Tabs Toggle Bar */}
      <div className="flex overflow-x-auto gap-2 bg-neutral-900/60 p-1.5 rounded-2xl border border-white/10 mb-8 max-w-max custom-scrollbar">
        {[
          { id: 'overview', label: 'Overview', Icon: BarChart2 },
          { id: 'blogs', label: 'Blogs Mod', Icon: Newspaper },
          { id: 'comments', label: 'Comments Mod', Icon: MessageSquare },
          { id: 'categories', label: 'Categories', Icon: FolderKanban },
          { id: 'subscribers', label: 'Subscribers', Icon: Mail }
        ].map((tab) => {
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === tab.id ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tabs Layout render */}
      <AnimatePresence mode="wait">
        
        {/* OVERVIEW PANEL */}
        {activeSubTab === 'overview' && (
          <motion.div
            key="overview-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Grid stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Views */}
              <div className="glass-card p-6 flex items-center gap-5 bg-neutral-950/40 border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <Eye className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Global Views</p>
                  <h2 className="text-3xl font-bold text-white mt-1">{stats.totalViews}</h2>
                </div>
              </div>

              {/* Total Blogs */}
              <div className="glass-card p-6 flex items-center gap-5 bg-neutral-950/40 border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/10">
                  <Newspaper className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Total Blogs</p>
                  <h2 className="text-3xl font-bold text-white mt-1">{stats.totalBlogs}</h2>
                </div>
              </div>

              {/* Total Comments */}
              <div className="glass-card p-6 flex items-center gap-5 bg-neutral-950/40 border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-red-500/10">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Total Comments</p>
                  <h2 className="text-3xl font-bold text-white mt-1">{stats.totalComments}</h2>
                </div>
              </div>

              {/* Active Subscribers */}
              <div className="glass-card p-6 flex items-center gap-5 bg-neutral-950/40 border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-green-500/10">
                  <Mail className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">Subscribers</p>
                  <h2 className="text-3xl font-bold text-white mt-1">{stats.totalSubscribers}</h2>
                </div>
              </div>

            </div>

            {/* Quick Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Category Quickview */}
              <div className="glass-card p-6 bg-neutral-950/40 border-white/10 text-white rounded-3xl">
                <h3 className="text-base font-bold mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-purple-400" /> Categories Overview
                </h3>
                <div className="space-y-3">
                  {categories.map((c) => {
                    const count = blogs.filter(b => b.category === c.name).length;
                    return (
                      <div key={c.id} className="flex justify-between items-center text-xs font-semibold py-1 border-b border-white/5">
                        <span className="text-slate-300">{c.name}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400">{count} posts</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Admin info warning */}
              <div className="glass-card p-6 bg-red-950/10 border-red-500/20 text-white rounded-3xl flex flex-col justify-center">
                <Shield className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-red-400">Responsible Moderation</h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  As an administrator, you have access to modify global categories and delete any user's blog posts or comments. Deleting entries will permanently wipe related likes, comments, and replies from the database. Please execute moderation tasks with caution.
                </p>
              </div>

            </div>
          </motion.div>
        )}

        {/* BLOG MODERATION */}
        {activeSubTab === 'blogs' && (
          <motion.div
            key="blogs-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 bg-neutral-950/40 border-white/10 rounded-3xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">Global Article Registry</h3>
            
            {blogs.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">No articles exist in the registry.</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="pb-3 pl-4">Title</th>
                      <th className="pb-3">Author</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Views</th>
                      <th className="pb-3 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((b) => (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-xs">
                        
                        {/* Title and path link */}
                        <td className="py-4 pl-4 font-bold text-white hover:text-purple-400 cursor-pointer" onClick={() => navigate(`/ai/blog/${b.id}`)}>
                          {b.title}
                        </td>
                        
                        {/* Author */}
                        <td className="py-4 text-slate-300 font-semibold">{b.author_name}</td>
                        
                        {/* Category */}
                        <td className="py-4"><span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">{b.category}</span></td>
                        
                        {/* Views */}
                        <td className="py-4 font-bold text-slate-400">{b.views_count || 0}</td>
                        
                        {/* Action */}
                        <td className="py-4 text-right pr-4">
                          <button
                            onClick={() => handleDeleteBlog(b.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 hover:text-red-400 cursor-pointer"
                            title="Delete post globally"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* COMMENTS MODERATION */}
        {activeSubTab === 'comments' && (
          <motion.div
            key="comments-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 bg-neutral-950/40 border-white/10 rounded-3xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">Global Comments Audit</h3>
            
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">No comments posted yet.</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="pb-3 pl-4">Comment</th>
                      <th className="pb-3">Author</th>
                      <th className="pb-3">Blog Context</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((c) => (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        
                        {/* Comment Content */}
                        <td className="py-4 pl-4 text-slate-300 max-w-[200px] truncate" title={c.content}>
                          {c.content}
                        </td>
                        
                        {/* Author */}
                        <td className="py-4 text-slate-400 font-bold">{c.author_name}</td>
                        
                        {/* Context Blog */}
                        <td className="py-4 text-slate-400 italic line-clamp-1 max-w-[150px]">{c.blog_title}</td>
                        
                        {/* Date */}
                        <td className="py-4 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                        
                        {/* Action */}
                        <td className="py-4 text-right pr-4">
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 hover:text-red-400 cursor-pointer"
                            title="Delete comment globally"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* CATEGORY MANAGER */}
        {activeSubTab === 'categories' && (
          <motion.div
            key="categories-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            
            {/* Create Category (col-span-5) */}
            <div className="md:col-span-5 glass-card p-6 bg-neutral-950/40 border-white/10 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">Create Category</h3>
              
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Cybersecurity, Devops..."
                    className="w-full px-4 py-3 outline-none border border-white/10 rounded-xl bg-black text-sm text-white focus:border-red-500/50"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={addingCategory}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {addingCategory ? 'Creating...' : 'Add Category'}
                </button>
              </form>
            </div>

            {/* List categories (col-span-7) */}
            <div className="md:col-span-7 glass-card p-6 bg-neutral-950/40 border-white/10 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">Active Categories</h3>
              
              <div className="space-y-3">
                {categories.map((c) => (
                  <div key={c.id} className="flex justify-between items-center py-2 px-3 rounded-xl bg-black/30 border border-white/5 text-sm font-semibold">
                    <span className="text-slate-300">{c.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 hover:text-red-400 cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* NEWSLETTER SUBSCRIBERS */}
        {activeSubTab === 'subscribers' && (
          <motion.div
            key="subscribers-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 bg-neutral-950/40 border-white/10 rounded-3xl"
          >
            <h3 className="text-lg font-bold text-white mb-6">Subscribed Readers</h3>
            
            {subscribers.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">No subscribers registered.</p>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="pb-3 pl-4">Subscriber Email</th>
                      <th className="pb-3">Subscribed Date</th>
                      <th className="pb-3 text-right pr-4">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 pl-4 font-bold text-white">{s.email}</td>
                        <td className="py-4 text-slate-400">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="py-4 text-right pr-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-semibold text-[10px] uppercase tracking-wider">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;

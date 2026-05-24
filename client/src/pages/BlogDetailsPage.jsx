import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageSquare, Share2, Clock, Calendar, 
  ArrowLeft, Star, Send, Trash2, Edit3, Eye, Sparkles,
  ChevronRight, AlignLeft, Bookmark, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/blogs`;

const BlogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();

  // State Management
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  // Comments Interaction State
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const isAdmin = user?.publicMetadata?.role === 'admin' || 
                  user?.primaryEmailAddress?.emailAddress?.includes('admin') || 
                  user?.id === 'user_2yMX02PRbyMtQK6PebpjnxvRNIA';

  // Fetch Blog Details
  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(`${API_BASE}/${id}`, config);
      if (response.data.success) {
        setBlog(response.data.blog);
        setComments(response.data.comments || []);
        setLiked(response.data.liked || false);
        setBookmarked(response.data.bookmarked || false);
      } else {
        toast.error('Blog not found.');
        navigate('/ai/blogs');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load blog details.');
      navigate('/ai/blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Toggle Like
  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like posts.');
      openSignIn();
      return;
    }
    try {
      const token = await getToken();
      const response = await axios.post(`${API_BASE}/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setLiked(response.data.liked);
        setBlog(prev => ({
          ...prev,
          likes_count: response.data.likes_count
        }));
        toast.success(response.data.liked ? 'Liked! ❤️' : 'Like removed');
      }
    } catch (err) {
      toast.error('Like request failed.');
    }
  };

  // Toggle Bookmark
  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please log in to bookmark.');
      openSignIn();
      return;
    }
    try {
      const token = await getToken();
      const response = await axios.post(`${API_BASE}/${id}/bookmark`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBookmarked(response.data.bookmarked);
        toast.success(response.data.bookmarked ? 'Saved to bookmarks!' : 'Bookmark removed');
      }
    } catch (err) {
      toast.error('Bookmark request failed.');
    }
  };

  // Copy share link
  const handleShare = () => {
    const detailUrl = `${window.location.origin}/ai/blog/${id}`;
    navigator.clipboard.writeText(detailUrl);
    toast.success('Link copied to clipboard! 🔗');
  };

  // Post Comment
  const handlePostComment = async (e, parentId = null) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to comment.');
      openSignIn();
      return;
    }

    const contentStr = parentId ? replyContent : newComment;
    if (!contentStr.trim()) return;

    setSubmittingComment(true);
    try {
      const token = await getToken();
      const response = await axios.post(`${API_BASE}/${id}/comments`, {
        parent_id: parentId,
        content: contentStr
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setComments(prev => [...prev, response.data.comment]);
        setBlog(prev => ({ ...prev, comments_count: (prev.comments_count || 0) + 1 }));
        
        if (parentId) {
          setReplyContent('');
          setReplyingTo(null);
        } else {
          setNewComment('');
        }
        toast.success('Comment posted! 💬');
      }
    } catch (err) {
      toast.error('Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete comment?')) return;
    try {
      const token = await getToken();
      const response = await axios.delete(`${API_BASE}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Comment deleted.');
        // Refresh comments list
        fetchBlogDetails();
      }
    } catch (err) {
      toast.error('Failed to delete comment.');
    }
  };

  // Delete Blog
  const handleDeleteBlog = async () => {
    if (!window.confirm('Delete this blog post globally? This action is irreversible.')) return;
    try {
      const token = await getToken();
      const response = await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success('Blog post deleted.');
        navigate('/ai/blogs');
      }
    } catch (err) {
      toast.error('Delete request failed.');
    }
  };

  // Build comment tree for nested comments
  const buildCommentTree = (flatList) => {
    const map = {};
    const tree = [];
    flatList.forEach(c => {
      map[c.id] = { ...c, replies: [] };
    });
    flatList.forEach(c => {
      if (c.parent_id) {
        if (map[c.parent_id]) {
          map[c.parent_id].replies.push(map[c.id]);
        }
      } else {
        tree.push(map[c.id]);
      }
    });
    return tree;
  };

  const commentTree = buildCommentTree(comments);

  const CommentNode = ({ node }) => {
    const canDelete = user && (node.user_id === user.id || blog.author_id === user.id || isAdmin);
    
    return (
      <div className="border-l-2 border-purple-500/20 pl-4 py-2 mt-4 space-y-2 text-xs">
        <div className="flex items-start gap-3">
          <img src={node.author_image} alt="" className="w-8 h-8 rounded-full border border-white/10" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-white">{node.author_name}</span>
                <span className="text-[9px] text-slate-500 ml-2">
                  {new Date(node.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {canDelete && (
                <button 
                  onClick={() => handleDeleteComment(node.id)}
                  className="p-1 rounded hover:bg-red-500/10 text-red-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <p className="text-xs text-slate-300 mt-1">{node.content}</p>
            
            <div className="flex items-center gap-4 mt-1.5">
              <button 
                onClick={() => setReplyingTo(replyingTo === node.id ? null : node.id)}
                className="text-[10px] font-bold text-purple-400 hover:text-purple-300"
              >
                Reply
              </button>
            </div>

            {replyingTo === node.id && (
              <form onSubmit={(e) => handlePostComment(e, node.id)} className="flex items-center gap-2 mt-2 max-w-sm">
                <input
                  type="text"
                  required
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${node.author_name}...`}
                  className="flex-1 px-3 py-1.5 outline-none rounded-lg text-[10px] border border-white/10 bg-black text-white focus:border-purple-500/50"
                />
                <button 
                  type="submit" 
                  disabled={submittingComment}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {node.replies && node.replies.map(reply => (
              <CommentNode key={reply.id} node={reply} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-2" />
        <span className="text-sm font-semibold tracking-wider text-slate-400">Loading blog details...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-center items-center">
        <span className="text-sm font-semibold text-slate-400">Error loading blog.</span>
      </div>
    );
  }

  const isOwner = user && (blog.author_id === user.id || isAdmin);

  return (
    <div className="w-full relative text-white bg-transparent">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/ai/blogs')}
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </button>

      {/* Spacing alignment */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Large Blog Image */}
        <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-3xl border border-white/10 relative shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
          <img 
            src={blog.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge & Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
            <span className="inline-block text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded bg-purple-600 border border-purple-500 text-white shadow-md shadow-purple-500/20">
              {blog.category}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-outfit font-black tracking-tight leading-tight text-white">
              {blog.title}
            </h2>
          </div>
        </div>

        {/* Content Card */}
        <div className="glass-card p-6 md:p-8 bg-neutral-950/20 border border-white/10 rounded-3xl">
          
          {/* Author Name, Avatar, Date, Likes and Shares */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6 text-xs">
            <div className="flex items-center gap-3">
              <img src={blog.author_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
              <div>
                <span className="font-bold text-white block">{blog.author_name}</span>
                <span className="text-[10px] text-slate-500">
                  Published {new Date(blog.created_at).toLocaleDateString()} • {blog.views_count || 0} views
                </span>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                  liked ? 'bg-pink-500/20 border-pink-500/30 text-pink-400' : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
                <span>{blog.likes_count || 0}</span>
              </button>

              {/* Bookmark */}
              <button 
                onClick={handleBookmark}
                className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                  bookmarked ? 'bg-purple-600/20 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
              </button>

              {/* Share */}
              <button 
                onClick={handleShare}
                className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {/* Edit/Delete controls for owner */}
              {isOwner && (
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <button
                    onClick={() => navigate('/ai/create-blog/editor', { state: { editBlog: blog } })}
                    className="p-2 rounded-lg border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 cursor-pointer"
                    title="Edit Post"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDeleteBlog}
                    className="p-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Full Blog Content */}
          <div 
            className="blog-content prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm select-text"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Comment Section */}
        <div className="glass-card p-6 md:p-8 bg-neutral-950/20 border border-white/10 rounded-3xl space-y-6">
          <h4 className="text-sm font-bold flex items-center gap-2 border-b border-white/10 pb-4">
            <MessageSquare className="w-4.5 h-4.5 text-purple-400" />
            Comments ({comments.length})
          </h4>

          {/* New Comment Input */}
          <form onSubmit={(e) => handlePostComment(e)} className="flex items-start gap-3">
            <img 
              src={user?.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} 
              alt="" 
              className="w-8 h-8 rounded-full object-cover border border-white/10"
            />
            <div className="flex-1 space-y-3">
              <textarea
                rows={2}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3.5 text-xs rounded-xl border border-white/10 bg-black/40 text-white outline-none focus:border-purple-500/50 resize-none shadow-inner"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                Add Comment <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Comment Tree */}
          <div className="pt-4 space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {commentTree.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No comments yet.</p>
            ) : (
              commentTree.map(comment => (
                <CommentNode key={comment.id} node={comment} />
              ))
            )}
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default BlogDetailsPage;

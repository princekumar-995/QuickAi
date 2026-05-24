import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Terminal, RefreshCw, Cpu, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth, useUser } from '@clerk/clerk-react';

const Chatbot = ({ openTrigger, setOpenTrigger }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Sync with global openTrigger (from Navbar or Hero)
  useEffect(() => {
    if (openTrigger) {
      setIsOpen(true);
      if (setOpenTrigger) setOpenTrigger(false);
    }
  }, [openTrigger, setOpenTrigger]);

  // Load chat history from LocalStorage
  useEffect(() => {
    const savedChat = localStorage.getItem('quickai_chat_history');
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    } else {
      // Default welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hi there! 🤖 I'm your premium 24/7 AI System Architect & Coding Assistant. 

How can I help you elevate your project today?
*   Suggest a **modern tech stack** for your scale
*   Map out a **database schema**
*   Create **Express API routes**
*   Debug a **coding issue**`
        }
      ]);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (updatedMessages) => {
    setMessages(updatedMessages);
    localStorage.setItem('quickai_chat_history', JSON.stringify(updatedMessages));
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (input.trim() === '' || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    const updatedMessages = [...messages, userMessage];
    saveHistory(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const token = await getToken();
      // Call backend Chat controller
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/chat`,
        { 
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.response
        };
        saveHistory([...updatedMessages, assistantMessage]);
      } else {
        toast.error(response.data.message || "Failed to fetch response");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Something went wrong connecting to the AI brain. Please verify the backend server is running and API keys are set. Let me know if you would like to retry!`
      };
      saveHistory([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const defaultWelcome = [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hi there! 🤖 I'm your premium 24/7 AI System Architect & Coding Assistant. Let me know what we are building today!`
      }
    ];
    saveHistory(defaultWelcome);
    toast.success("Chat history cleared!");
  };

  return (
    <>
      {/* Global Floating Button - Show only if logged in and panel closed */}
      {user && !isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.45)] border border-white/10 cursor-pointer flex items-center justify-center hover:shadow-[0_0_35px_rgba(168,85,247,0.65)] hover:border-purple-400/50 transition-all duration-300 group"
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          {/* Pulsing indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#050508] animate-pulse"></span>
        </motion.button>
      )}

      {/* Slide-out Chat Panel drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-[#070614]/95 border-l border-white/10 backdrop-blur-2xl z-50 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-neutral-950/60 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-purple-500/20">
                  <div className="w-full h-full rounded-xl bg-neutral-950 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5 leading-none">
                    AI Coding Assistant
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  </h3>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">v2.0 • Online</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearChat}
                  className="text-[10px] text-gray-500 hover:text-red-400 transition-colors font-medium border border-white/5 bg-neutral-900/60 px-2 py-1 rounded cursor-pointer"
                  title="Clear Chat History"
                >
                  Clear History
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg border border-white/5 bg-neutral-900/60 hover:bg-neutral-800 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Speaker Label */}
                  <span className="text-[9px] font-mono text-slate-600 mb-1 uppercase tracking-wider px-1">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                  
                  {/* Bubble Container */}
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                      msg.role === 'user' 
                        ? 'bg-purple-950/20 border-purple-500/20 text-purple-200' 
                        : 'bg-neutral-900/60 border-white/5 text-gray-300'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-xs text-left">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator bubble */}
              {loading && (
                <div className="flex flex-col items-start animate-pulse">
                  <span className="text-[9px] font-mono text-slate-600 mb-1 uppercase tracking-wider">Assistant</span>
                  <div className="bg-neutral-900/60 border border-white/5 rounded-2xl px-4 py-3 text-sm text-gray-500 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                    <span>Analyzing system configurations...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form onSubmit={handleSend} className="p-4 bg-neutral-950/60 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about tech stacks, Express APIs, Docker, schemas..."
                className="flex-1 px-4 py-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:bg-black focus:border-purple-500/50 transition-all shadow-inner"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={input.trim() === '' || loading}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() !== '' && !loading
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg cursor-pointer'
                    : 'bg-neutral-900 text-gray-600 border border-white/5 cursor-not-allowed'
                }`}
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

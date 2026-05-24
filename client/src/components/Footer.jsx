import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Sparkles, 
  Cpu, 
  Send, 
  Terminal, 
  Globe, 
  ShieldAlert, 
  CheckCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setTimeout(() => {
      toast.success("Successfully subscribed to Quick.ai insider newsletter!");
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <footer className="relative w-full bg-[#000000] text-gray-400 mt-28 border-t border-purple-500/10 shadow-[0_-20px_50px_rgba(168,85,247,0.06)] overflow-hidden font-outfit">
      
      {/* 🌌 Cyber Grid Backdrop & Particles */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f1d_1px,transparent_1px),linear-gradient(to_bottom,#0f0f1d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none -z-10"></div>
      
      {/* Ambient Pulsing Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-20 pb-8 relative z-10">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 border-b border-white/5 pb-16">
          
          {/* Logo & Branding Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <div className="w-full h-full rounded-xl bg-neutral-950 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
                </div>
              </motion.div>
              <div>
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1 leading-none">
                  Quick.ai
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                </span>
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest leading-none block mt-1">AI SAAS PLATFORM</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              Experience the power of neural computing with Quick.ai. Transform your architecture planning, write Express routes, isolate visual subjects, and review executive resumes on our unified premium dashboard.
            </p>

            {/* Social Icons with Smooth Hover */}
            <div className="flex items-center gap-3.5 pt-2">
              {[
                { Icon: Github, href: "https://github.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Linkedin, href: "https://linkedin.com" },
                { Icon: Youtube, href: "https://youtube.com" }
              ].map((social, index) => {
                const SocIcon = social.Icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 rounded-xl border border-white/5 bg-neutral-950/60 text-slate-400 hover:text-white hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300"
                  >
                    <SocIcon className="w-4.5 h-4.5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">AI Tools Suite</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { name: "CodeFlow Planer", href: "/ai/codeflow" },
                { name: "Image Generator", href: "/ai/generate-images" },
                { name: "Background Remover", href: "/ai/remove-background" },
                { name: "Resume Reviewer", href: "/ai/review-resume" },
                { name: "Write Articles", href: "/ai/write-article" }
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="hover:text-purple-400 hover:underline transition-colors flex items-center gap-1 group font-light"
                  >
                    {link.name}
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Resources Column */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">Resources</h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {[
                { name: "Documentation", href: "#" },
                { name: "System Status", href: "#" },
                { name: "Pricing Plans", href: "#" },
                { name: "Community Forum", href: "/ai/community" },
                { name: "About QuickAI", href: "/ai/about" }
              ].map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.href}
                    className="hover:text-cyan-400 transition-colors flex items-center gap-1 group font-light"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">Neural Insider Newsletter</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Get weekly updates on new AI tools release, developer documentation updates, and technical articles.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
              <div className="flex items-center gap-2 max-w-sm rounded-xl border border-white/10 bg-black/40 p-1.5 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/10 transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="flex-1 min-w-0 bg-transparent text-xs px-3.5 py-2 border-none outline-none text-white focus:ring-0 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg flex items-center gap-1.5 transition duration-300 shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Join</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1.5 font-light">
                <ShieldAlert className="w-3 h-3 shrink-0" />
                Zero spam. Unsubscribe with one click at any time.
              </span>
            </form>
          </div>

        </div>

        {/* Gradient Divider Line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-8"></div>

        {/* Bottom Bar Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>2026 © Quick.ai Inc. All Rights Reserved.</span>
            <span className="h-3 w-[1px] bg-white/10 hidden sm:inline"></span>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span className="h-3 w-[1px] bg-white/10 hidden sm:inline"></span>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>

          <div className="flex items-center gap-1.5 font-light">
            <Globe className="w-3.5 h-3.5 text-cyan-500" />
            <span>Deployed globally on Edge Networks •</span>
            <span className="font-semibold text-slate-400">Stable</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

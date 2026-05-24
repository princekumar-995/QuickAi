import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  UserPlus, 
  PenTool, 
  UploadCloud, 
  FileText, 
  Send, 
  Compass, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Edit, 
  Trash2, 
  Filter, 
  LayoutDashboard, 
  ShieldCheck, 
  Zap, 
  Eye, 
  Globe, 
  Linkedin, 
  Github, 
  Briefcase,
  Terminal,
  Cpu,
  Layers,
  Code
} from 'lucide-react';
import myImg from '../assets/my img.jpeg';

// Workflow steps configuration
const workflowSteps = [
  {
    id: 1,
    title: 'Sign In / Register',
    subtitle: 'Clerk Secure Authentication',
    desc: 'Access your secure personalized dashboard in seconds using advanced social log-ins or email credentials.',
    icon: UserPlus,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 2,
    title: 'Initiate Creation',
    subtitle: 'Create Blog Workspace',
    desc: 'Navigate to the creation suite with a single click and access state-of-the-art content tools.',
    icon: PenTool,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 3,
    title: 'Provide Context',
    subtitle: 'Visuals & Topics',
    desc: 'Upload reference images for AI analysis or write custom text prompts to seed your blog ideas.',
    icon: UploadCloud,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 4,
    title: 'AI Generation (Optional)',
    subtitle: 'Automated Title & Body',
    desc: 'Let our advanced LLM models draft SEO-friendly titles and outline complete drafts automatically.',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 5,
    title: 'Refine in Rich Editor',
    subtitle: 'Immersive Editing Suite',
    desc: 'Polishing your blog post is simple with formatting, tables, images, and visual components.',
    icon: FileText,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 6,
    title: 'Publish Real-Time',
    subtitle: 'Deploy to the Cloud',
    desc: 'Instantly publish your written blog and render it live on our performant hosting architecture.',
    icon: Send,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 7,
    title: 'Appear in Explore',
    subtitle: 'Discover Feed',
    desc: 'Your blog is indexed immediately in our centralized feed for worldwide reading and sharing.',
    icon: Compass,
    color: 'from-fuchsia-500 to-pink-500'
  },
  {
    id: 8,
    title: 'Social Engagement',
    subtitle: 'Likes, Comments, Shares',
    desc: 'Readers can like, write comments, copy sharing links, and bookmark your post for later viewing.',
    icon: Heart,
    color: 'from-red-500 to-rose-500'
  },
  
  {
    id: 9,
    title: 'Categorize & Filter',
    subtitle: 'Taxonomy & Navigation',
    desc: 'Easily filter published blogs by custom categories (Technology, Lifestyle, Business, etc.).',
    icon: Filter,
    color: 'from-violet-500 to-purple-500'
  }
];

// Feature list configuration
const features = [
  {
    title: 'AI Blog Generation',
    desc: 'Generate complete, readable blog drafts and suggestions automatically using state-of-the-art LLMs.',
    icon: Sparkles,
    glowColor: 'rgba(168, 85, 247, 0.4)'
  },
  {
    title: 'Smart Rich Text Editor',
    desc: 'A robust editor offering custom styling blocks, image embeds, code snippets, and standard layouts.',
    icon: FileText,
    glowColor: 'rgba(236, 72, 153, 0.4)'
  },
  {
    title: 'AI Image Understanding',
    desc: 'Analyze uploaded graphics to automatically extract keywords and suggest matching themes.',
    icon: Eye,
    glowColor: 'rgba(59, 130, 246, 0.4)'
  },
  {
    title: 'Blog Categories & Filters',
    desc: 'Browse articles based on topic interests using instant tags and category search mechanics.',
    icon: Filter,
    glowColor: 'rgba(16, 185, 129, 0.4)'
  },
  {
    title: 'Likes & Comments System',
    desc: 'Foster discussions with robust, interactive comments and instant upvote responses.',
    icon: Heart,
    glowColor: 'rgba(239, 68, 68, 0.4)'
  },
  {
    title: 'Share & Bookmark',
    desc: 'Share articles to external websites and save favorites directly to your private list.',
    icon: Share2,
    glowColor: 'rgba(245, 158, 11, 0.4)'
  },
  {
    title: 'Responsive Dashboard',
    desc: 'A futuristic administrative view to inspect platform stats, recent edits, and creation history.',
    icon: LayoutDashboard,
    glowColor: 'rgba(99, 102, 241, 0.4)'
  },
  {
    title: 'Secure Authentication',
    desc: 'Engineered with industry-standard login protocols for bulletproof database isolation and user protection.',
    icon: ShieldCheck,
    glowColor: 'rgba(6, 182, 212, 0.4)'
  },
  {
    title: 'Real-time Publishing',
    desc: 'Fast, edge-rendered publishing loops ensure content changes appear worldwide immediately.',
    icon: Globe,
    glowColor: 'rgba(20, 184, 166, 0.4)'
  },
  
];

// Tech stack configurations
const techStack = [
  { name: 'React', desc: 'Front-end Library', icon: '⚛️', color: 'from-[#00d8ff]/20 to-[#00d8ff]/5', hoverGlow: 'shadow-[0_0_25px_rgba(0,216,255,0.3)]' },
  { name: 'Node.js', desc: 'Back-end Engine', icon: '🟢', color: 'from-[#339933]/20 to-[#339933]/5', hoverGlow: 'shadow-[0_0_25px_rgba(51,153,51,0.3)]' },
  { name: 'Express.js', desc: 'Web API Server', icon: '⚙️', color: 'from-[#ffffff]/10 to-[#ffffff]/2', hoverGlow: 'shadow-[0_0_25px_rgba(255,255,255,0.15)]' },
  { name: 'MongoDB', desc: 'NoSQL Database', icon: '🍃', color: 'from-[#47A248]/20 to-[#47A248]/5', hoverGlow: 'shadow-[0_0_25px_rgba(71,162,72,0.3)]' },
  { name: 'Tailwind CSS', desc: 'Utility CSS Styling', icon: '🎨', color: 'from-[#38bdf8]/20 to-[#38bdf8]/5', hoverGlow: 'shadow-[0_0_25px_rgba(56,189,248,0.3)]' },
  { name: 'Framer Motion', desc: 'Premium Animations', icon: '✨', color: 'from-[#ff007f]/20 to-[#ff007f]/5', hoverGlow: 'shadow-[0_0_25px_rgba(255,0,127,0.3)]' },
  { name: 'Clerk Auth', desc: 'Identity Provider', icon: '🔒', color: 'from-[#6c47ff]/20 to-[#6c47ff]/5', hoverGlow: 'shadow-[0_0_25px_rgba(108,71,255,0.3)]' },
  { name: 'Gemini / OpenAI API', desc: 'Intelligence Engine', icon: '🧠', color: 'from-[#8B5CF6]/20 to-[#8B5CF6]/5', hoverGlow: 'shadow-[0_0_25px_rgba(139,92,246,0.3)]' }
];

const About = () => {
  return (
    <div className="min-h-screen bg-[#050508] text-white relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      
      {/* 🔮 Background Futuristic Glowing Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-blob animation-delay-4000"></div>

      {/* ================= SECTION 1: HERO / INTRO ================= */}
      <section className="relative z-10 max-w-5xl mx-auto text-center pt-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative inline-block"
        >
          {/* Neon Glow under title */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-20 -z-10"></div>
          <span className="px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-6 inline-block">
            Revolutionizing Content Creation
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl lg:text-7xl font-outfit font-black tracking-tight mb-8"
        >
          About{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            Quick.ai
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Quick.ai is a next-generation AI-powered blogging and content creation platform designed to help users create, generate, manage, and publish high-quality blogs effortlessly. Whether users want to write content manually or use advanced AI tools for automatic blog generation, Quick.ai provides a seamless and futuristic experience with smart editing, AI-powered content suggestions, image-based content generation, real-time publishing, category filtering, community engagement, and modern interactive features — all inside a beautifully crafted responsive dashboard built for creators, developers, and digital storytellers.
        </motion.p>

        {/* Floating elements */}
        <div className="absolute left-1/10 top-1/4 hidden lg:block">
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-2xl backdrop-blur-md shadow-2xl"
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
        </div>
        <div className="absolute right-1/10 top-1/3 hidden lg:block">
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
            className="p-3 bg-pink-950/30 border border-pink-500/20 rounded-2xl backdrop-blur-md shadow-2xl"
          >
            <Cpu className="w-6 h-6 text-pink-400" />
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 2: HOW QUICK.AI WORKS ================= */}
      <section className="relative z-10 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black tracking-tight mb-4"
          >
            How{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Quick.ai Works
            </span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-light">
            Embark on a fluid, AI-driven workflow that turns raw ideas into globally accessible blogs.
          </p>
        </div>

        {/* Central Vertical Flow Timeline */}
        <div className="relative">
          {/* Center Line for desktop, Left Line for mobile */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-purple-600 via-pink-500 to-indigo-600 rounded-full opacity-30 shadow-[0_0_15px_rgba(168,85,247,0.3)]"></div>

          <div className="space-y-12">
            {workflowSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={`flex flex-col sm:flex-row items-stretch sm:justify-between relative ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot with Glow */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-[#050508] border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] flex items-center justify-center z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></div>
                  </div>

                  {/* Flow Arrow Decorator (desktop only) */}
                  <div 
                    className={`hidden sm:block absolute top-9 w-6 h-[2px] bg-gradient-to-r opacity-40 ${
                      isEven 
                        ? 'right-1/2 translate-x-[-16px] from-purple-500 to-transparent' 
                        : 'left-1/2 translate-x-[16px] from-transparent to-purple-500'
                    }`}
                  ></div>

                  {/* Step Card */}
                  <div className="w-full sm:w-[45%] pl-14 sm:pl-0">
                    <div className="relative group p-6 sm:p-8 rounded-2xl bg-neutral-900/30 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden h-full flex flex-col justify-between">
                      {/* Gradient Backing Mesh */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}></div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} bg-opacity-20 text-white shadow-lg`}>
                            <StepIcon className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-outfit font-black tracking-widest text-slate-500 group-hover:text-purple-400 transition-colors">
                            STEP {step.id.toString().padStart(2, '0')}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold font-outfit text-white mb-1 group-hover:text-purple-300 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-purple-400/80 font-medium tracking-wide uppercase mb-3">
                          {step.subtitle}
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed font-light">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop spacer */}
                  <div className="hidden sm:block w-[45%]"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: FEATURES BOXES ================= */}
      <section className="relative z-10 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black tracking-tight mb-4"
          >
            Core Features of{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Quick.ai
            </span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-light">
            A comprehensive overview of the cutting-edge toolset built to empower modern publishers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const FeatureIcon = feature.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative group p-6 rounded-2xl bg-neutral-900/20 border border-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/30 flex flex-col justify-between"
                style={{
                  '--glow-color': feature.glowColor
                }}
              >
                {/* Background Hover Glow Halo */}
                <div 
                  className="absolute -right-20 -bottom-20 w-44 h-44 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500"
                ></div>

                <div className="relative z-10">
                  <div className="mb-6 inline-block p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 group-hover:border-purple-500/50 group-hover:bg-purple-950/60 transition-all text-purple-400 shadow-md">
                    <FeatureIcon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold font-outfit text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>

                {/* Subtle bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= SECTION 4: MEET THE CREATOR ================= */}
      <section className="relative z-10 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black tracking-tight"
          >
            Meet the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Creator
            </span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-1 rounded-3xl bg-gradient-to-br from-purple-500/30 via-pink-500/10 to-indigo-500/30 backdrop-blur-xl shadow-2xl"
        >
          {/* Innermost Dark Container */}
          <div className="bg-[#09090e]/95 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>

            {/* Profile Avatar Frame */}
            <div className="relative shrink-0">
              {/* Spinning / Glowing Gradient Ring */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 blur-sm opacity-70 animate-pulse"></div>
              
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/20 shadow-xl bg-neutral-900 flex items-center justify-center">
                <img 
                  src={myImg} 
                  alt="Chandan Pandey" 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Fallback in case of image load failure
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<span class="text-4xl">👨‍💻</span>`;
                  }}
                />
              </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <h3 className="text-3xl font-black font-outfit bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 mb-1">
                  Prince Pandey
                </h3>
                <p className="text-sm font-semibold tracking-wider text-purple-400 uppercase font-outfit">
                  Full-Stack Developer
                </p>
              </div>

              <p className="text-slate-300 text-base leading-relaxed font-light">
                Passionate full-stack developer focused on building futuristic AI-powered web experiences with clean UI/UX and smart automation.
              </p>

              {/* Styled Quote */}
              <div className="relative pl-6 py-1.5 border-l-2 border-pink-500 text-left bg-white/[0.02] rounded-r-lg pr-4">
                <p className="text-sm text-slate-300 italic font-light">
                  "Quick.ai was built to help creators generate and share content faster with the power of AI."
                </p>
              </div>

              {/* Creator Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 text-xs font-bold text-white shadow-lg shadow-blue-600/10 cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center gap-2 text-xs font-bold text-white shadow-lg shadow-black/30 cursor-pointer border border-white/5"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a 
                  href="#" 
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity flex items-center gap-2 text-xs font-bold text-white shadow-lg shadow-purple-500/10 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= SECTION 5: TECH STACK ================= */}
      <section className="relative z-10 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-outfit font-black tracking-tight mb-4"
          >
            Built With{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Modern Tech
            </span>
          </motion.h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-light">
            Powering Quick.ai with industry-leading frontend frameworks, databases, and AI algorithms.
          </p>
        </div>

        {/* Brand Tech Stack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {techStack.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              className={`relative p-5 rounded-2xl bg-gradient-to-b ${tech.color} border border-white/5 backdrop-blur-md overflow-hidden text-center transition-all duration-300 hover:border-purple-500/30 ${tech.hoverGlow}`}
            >
              <div className="text-4xl mb-3 filter drop-shadow-md select-none">{tech.icon}</div>
              <h4 className="font-bold text-base text-white font-outfit mb-0.5">{tech.name}</h4>
              <p className="text-xs text-slate-400 font-light">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;

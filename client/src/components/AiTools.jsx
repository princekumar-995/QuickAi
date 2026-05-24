import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Workflow, Image, Layers, FileText, SquarePen, MessageSquare, Sparkles } from 'lucide-react';
import Chatbot from './Chatbot';

const AiTools = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [chatTrigger, setChatTrigger] = useState(false);

  const toolsList = [
    {
      title: 'AI Workflow Generator',
      description: 'Generate complete, visual React Flow architecture systems and development roadmaps automatically from a description.',
      Icon: Workflow,
      color: '#a855f7', // purple
      shadowColor: 'rgba(168, 85, 247, 0.4)',
      bgGradient: 'from-purple-500/10 to-pink-500/5',
      path: '/ai/describe-problem'
    },
    {
      title: 'AI Image Generator',
      description: 'Generate realistic, high-fidelity AI vector graphics and artistic renders from any simple text prompt.',
      Icon: Image,
      color: '#ec4899', // pink
      shadowColor: 'rgba(236, 72, 153, 0.4)',
      bgGradient: 'from-pink-500/10 to-rose-500/5',
      path: '/ai/generate-images'
    },
    {
      title: 'Background Remover',
      description: 'Upload any raw visual asset and instantly isolate subjects with clean, transparent PNG backgrounds.',
      Icon: Layers,
      color: '#f97316', // orange
      shadowColor: 'rgba(249, 115, 22, 0.4)',
      bgGradient: 'from-orange-500/10 to-red-500/5',
      path: '/ai/remove-background'
    },
    {
      title: 'Resume Reviewer',
      description: 'Audit resume texts against target job requirements to calculate ATS score index and generate professional rewrites.',
      Icon: FileText,
      color: '#06b6d4', // cyan
      shadowColor: 'rgba(6, 182, 212, 0.4)',
      bgGradient: 'from-cyan-500/10 to-blue-500/5',
      path: '/ai/review-resume'
    },
    {
      title: 'AI Blog Writer',
      description: 'Synthesize high-quality, engaging, and SEO-optimized professional articles and blog posts instantly.',
      Icon: SquarePen,
      color: '#10b981', // emerald
      shadowColor: 'rgba(16, 185, 129, 0.4)',
      bgGradient: 'from-emerald-500/10 to-teal-500/5',
      path: '/ai/write-article'
    },
    {
      title: 'AI Chat Assistant',
      description: 'Launch a 24/7 intelligent developer assistant to answer coding doubts, suggest tech stacks, and guide workflows.',
      Icon: MessageSquare,
      color: '#6366f1', // indigo
      shadowColor: 'rgba(99, 102, 241, 0.4)',
      bgGradient: 'from-indigo-500/10 to-blue-500/5',
      isChatTrigger: true
    }
  ];

  const handleToolClick = (tool) => {
    if (!user) {
      toast.error("Please sign in or register to explore our premium AI tools!");
      return;
    }
    
    if (tool.isChatTrigger) {
      setChatTrigger(true);
    } else {
      navigate(tool.path);
    }
  };

  return (
    <div id="features" className='px-4 sm:px-10 lg:px-20 xl:px-32 py-24 relative bg-black font-outfit'>
      {/* Floating background blur effects */}
      <div className="absolute top-1/2 left-0 w-[40rem] h-[40rem] bg-purple-900/5 rounded-full filter blur-[120px] -z-10 pointer-events-none animate-pulse"></div>

      {/* Heading section */}
      <div className='text-center relative z-10 mb-16'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          AI SUITE Blueprints
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className='text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] text-4xl sm:text-5xl font-black tracking-tight mb-4'
        >
          Powerful AI Tools
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className='text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-light'
        >
          Everything you need to plan architectures, write code, segment images, review resumes, and accelerate workflows.
        </motion.p>
      </div>

      {/* Structured Layout Grid */}
      <div className='max-w-6xl mx-auto relative z-10'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolsList.map((tool, index) => {
            const ToolIcon = tool.Icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleToolClick(tool)}
                className={`p-8 rounded-3xl bg-neutral-900/30 border border-white/5 backdrop-blur-md cursor-pointer group relative overflow-hidden transition-all duration-300 hover:border-purple-500/20 shadow-lg flex flex-col justify-between min-h-[260px]`}
                style={{ 
                  boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4)`
                }}
              >
                {/* Micro Ambient Hover Glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle 120px at center, ${tool.color}15, transparent)`
                  }}
                />

                <div>
                  {/* Glowing Icon Wrapper */}
                  <div 
                    className="p-3 w-fit rounded-2xl border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      background: `linear-gradient(135deg, ${tool.color}25, ${tool.color}05)`,
                      borderColor: `${tool.color}30`,
                      boxShadow: `0 0 15px ${tool.color}10`
                    }}
                  >
                    <ToolIcon className="w-6 h-6" style={{ color: tool.color }} />
                  </div>

                  <h3 className='mt-6 mb-3 text-lg font-bold text-white group-hover:text-white transition-colors tracking-tight'>
                    {tool.title}
                  </h3>
                  
                  <p className='text-xs sm:text-sm text-slate-400 leading-relaxed font-light'>
                    {tool.description}
                  </p>
                </div>

                {/* Animated neon linear border indicator */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
                  style={{ backgroundColor: tool.color }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Embedded Chatbot for direct triggers */}
      <Chatbot openTrigger={chatTrigger} setOpenTrigger={setChatTrigger} />
    </div>
  );
};

export default AiTools;

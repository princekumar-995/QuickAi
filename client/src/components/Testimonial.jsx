import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const testimonials = [
  {
    name: 'John Doe',
    role: 'Software Architect, Vercel',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
    review: 'Quick.ai transformed how we design microservices. The React Flow outputs are incredibly detailed and accurate!'
  },
  {
    name: 'Rahul Raj',
    role: 'Full Stack Developer, Zoho',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150',
    review: 'Generating directory setups directly from my project description saved me hours of boring configuration and boilerplate setup.'
  },
  {
    name: 'Ankit Sharma',
    role: 'Backend Lead, Paytm',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    review: 'The architecture layout and OpenRouter integration are blazing fast. The interactive zoomable flowchart is exactly what we needed.'
  },
  {
    name: 'Priya Singh',
    role: 'Frontend Engineer, Razorpay',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
    review: 'The premium dark UI is stunning. Generating ready-to-run bash commands and tech blueprints works like magic.'
  },
  {
    name: 'Rohit Kumar',
    role: 'Indie Hacker & Creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    review: 'I built my MVP flowchart and tech stack in less than 5 minutes. The visual design is outstanding and UX is super smooth!'
  },
  {
    name: 'Neha Gupta',
    role: 'DevOps Lead, BrowserStack',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150',
    review: 'Automating development roadmaps keeps our entire engineering team aligned from Day 1. Absolutely phenomenal work.'
  },
  {
    name: 'Satyam',
    role: 'CTO, SteynCorp',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    review: 'The automated system design matches the quality of senior architects. A game-changer for speed-focused startups.'
  },
  {
    name: 'Dev Raj',
    role: 'AI Specialist, Cognizant',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
    review: 'Generating structured system design diagrams from a simple text prompt feels like sci-fi. Highly recommended.'
  },
  {
    name: 'Aman Verma',
    role: 'Junior Developer, TCS',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150',
    review: 'The step-by-step roadmaps help me understand large-scale codebases and directories. Great for onboarding junior engineers!'
  }
];

// Divide testimonials into 3 columns
const column1 = [testimonials[0], testimonials[1], testimonials[2]];
const column2 = [testimonials[3], testimonials[4], testimonials[5]];
const column3 = [testimonials[6], testimonials[7], testimonials[8]];

const ReviewCard = ({ t }) => {
  return (
    <div className="p-6 rounded-3xl bg-neutral-950/40 border border-white/5 backdrop-blur-xl transition-colors hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] group">
      
      {/* 5 Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5 fill-purple-500 text-purple-500 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>

      <p className="text-gray-300 text-sm font-light italic leading-relaxed mb-6 group-hover:text-white transition-colors">
        "{t.review}"
      </p>

      <div className="flex items-center gap-3 border-t border-white/5 pt-4">
        <img
          src={t.avatar}
          className="w-10 h-10 object-cover rounded-full border border-purple-500/20 group-hover:border-purple-500 transition-colors"
          alt={t.name}
        />
        <div>
          <h4 className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
            {t.name}
          </h4>
          <p className="text-[10px] text-purple-400/80">
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
};

const Testimonial = () => {
  return (
    <div id="testimonials" className="py-28 relative overflow-hidden bg-black text-white">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-0 w-[40rem] h-[40rem] bg-purple-900/5 rounded-full filter blur-[150px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-0 w-[40rem] h-[40rem] bg-cyan-900/5 rounded-full filter blur-[150px] pointer-events-none -z-10 animate-pulse"></div>

      {/* Heading section */}
      <div className="text-center relative z-10 mb-20 px-4">
        <h2 className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] text-4xl sm:text-5xl lg:text-6xl font-outfit font-black tracking-tight mb-4">
          What <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">Developers Say</span>
        </h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-outfit font-light">
          Don't just take our word for it. Here's how teams are building 10x faster using our smart workflows.
        </p>
      </div>

      {/* 3 Infinite Vertical Marquee Columns */}
      <div className="max-w-6xl mx-auto px-4 h-[580px] relative overflow-hidden select-none z-10">
        
        {/* Top/Bottom Fade mask overlay */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          
          {/* Column 1 (Scroll Up) */}
          <div className="relative overflow-hidden h-full flex flex-col gap-6">
            <motion.div
              animate={{ y: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 22 }}
              className="flex flex-col gap-6"
            >
              {[...column1, ...column1].map((t, idx) => (
                <ReviewCard key={idx} t={t} />
              ))}
            </motion.div>
          </div>

          {/* Column 2 (Scroll Down - Hidden on mobile) */}
          <div className="hidden md:flex relative overflow-hidden h-full flex-col gap-6">
            <motion.div
              animate={{ y: ['-50%', '0%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
              className="flex flex-col gap-6"
            >
              {[...column2, ...column2].map((t, idx) => (
                <ReviewCard key={idx} t={t} />
              ))}
            </motion.div>
          </div>

          {/* Column 3 (Scroll Up - Hidden on mobile) */}
          <div className="hidden md:flex relative overflow-hidden h-full flex-col gap-6">
            <motion.div
              animate={{ y: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 28 }}
              className="flex flex-col gap-6"
            >
              {[...column3, ...column3].map((t, idx) => (
                <ReviewCard key={idx} t={t} />
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Testimonial;

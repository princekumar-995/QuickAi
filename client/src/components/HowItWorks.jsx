import React, { useState } from 'react';
import { FileText, LayoutGrid, Code2, Terminal, Sparkles, Home, Github } from 'lucide-react';

const steps = [
  {
    title: 'Describe Your Project',
    phase: 'Planning',
    icon: FileText,
    desc: "Explain what you're building in plain English",
    color: '#8b5cf6' // Purple
  },
  {
    title: 'Get AI-Generated Flowchart',
    phase: 'Architecture',
    icon: LayoutGrid,
    desc: 'Visual breakdown of development phases',
    color: '#ec4899' // Pink
  },
  {
    title: 'Review Tech Stack',
    phase: 'Review',
    icon: Code2,
    desc: 'Verify framework integrations and databases',
    color: '#3b82f6' // Blue
  },
  {
    title: 'Start Coding',
    phase: 'Coding',
    icon: Terminal,
    desc: 'Use generated directories and run scripts',
    color: '#10b981' // Emerald
  },
  {
    title: 'Test & Refactor',
    phase: 'Refactor',
    icon: Sparkles,
    desc: 'Diagnose bottlenecks and validate schemas',
    color: '#eab308' // Yellow
  }
];

const HowItWorks = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div id="how-it-works" className="py-32 relative overflow-hidden bg-black text-white">
      {/* Immersive background stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 2 + 1;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = Math.random() * 4 + 4;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-30 animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.6)',
              }}
            />
          );
        })}
      </div>

      {/* Floating Header Bar */}
      <div className="flex justify-center mb-6 relative z-10">
        <div className="flex items-center gap-6 px-5 py-2.5 rounded-2xl bg-neutral-950/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer">
            <Home className="w-4 h-4" />
          </div>
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition cursor-pointer">
            <Github className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Heading section */}
      <div className="text-center relative z-10 mb-20 px-4">
        <p className="text-gray-400 text-xs sm:text-sm tracking-wide font-light">
          A streamlined process from idea to production-ready implementation
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Centered vertical timeline line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-purple-500/10 via-purple-500/30 to-pink-500/10 pointer-events-none"></div>

        <div className="relative z-10 space-y-12">
          {steps.map((step, index) => {
            const isOdd = index % 2 === 0;

            return (
              <div key={index} className="relative flex flex-col md:flex-row items-stretch w-full">
                
                {/* Timeline Dot (Desktop: centered on timeline line. Mobile: aligned to left-6) */}
                <div 
                  className="absolute left-6 md:left-1/2 top-8 -translate-x-1/2 w-2.5 h-2.5 rounded-full z-20 transition-all duration-300"
                  style={{ 
                    backgroundColor: step.color,
                    boxShadow: hoveredIdx === index ? `0 0 10px ${step.color}` : `0 0 4px ${step.color}80`
                  }}
                />

                {/* Left Side Column: Always contains the Card on desktop */}
                <div className="w-full md:w-1/2 flex justify-start md:justify-end pl-16 md:pl-0 pr-0 md:pr-12 relative">
                  
                  {/* Floating Icon Box on the Left (for Step 1, 3, 5) */}
                  {isOdd && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 -left-16 hidden xl:flex w-12 h-12 rounded-xl bg-[#090b11]/90 border items-center justify-center transition-all duration-300 cursor-pointer shadow-lg z-30"
                      style={{
                        borderColor: hoveredIdx === index ? `${step.color}50` : 'rgba(255, 255, 255, 0.08)',
                        boxShadow: hoveredIdx === index ? `0 0 20px ${step.color}20` : 'none'
                      }}
                      onMouseEnter={() => setHoveredIdx(index)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      <step.icon 
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: hoveredIdx === index ? '#ffffff' : step.color }}
                      />
                    </div>
                  )}

                  {/* Main Card */}
                  <div 
                    onMouseEnter={() => setHoveredIdx(index)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="w-full max-w-[480px] bg-[#07090e]/95 border rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden cursor-pointer z-10"
                    style={{
                      borderColor: hoveredIdx === index ? `${step.color}40` : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: hoveredIdx === index ? `0 0 25px ${step.color}15` : 'none'
                    }}
                  >
                    {/* Glow overlay inside card */}
                    <div className="absolute -inset-px bg-gradient-to-r from-white/0 via-white/[0.01] to-white/0 rounded-2xl pointer-events-none"></div>

                    <div className="flex flex-col gap-3">
                      
                      {/* Pill & Mobile Icon Row */}
                      <div className="flex items-center justify-between xl:justify-start gap-4">
                        <div className="flex items-center gap-3">
                          <span 
                            className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded"
                            style={{
                              backgroundColor: `${step.color}15`,
                              color: step.color,
                              border: `1px solid ${step.color}25`
                            }}
                          >
                            Step {index + 1}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {step.phase}
                          </span>
                        </div>

                        {/* Mobile/Tablet icon box */}
                        <div 
                          className="xl:hidden flex w-8 h-8 rounded-lg bg-[#090b11] border items-center justify-center"
                          style={{
                            borderColor: `${step.color}30`,
                          }}
                        >
                          <step.icon className="w-3.5 h-3.5" style={{ color: step.color }} />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold font-outfit text-white tracking-wide">
                          {step.title}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed font-light font-inter">
                          {step.desc}
                        </p>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Right Side Column: Desktop empty, except for Step 2/4 which have the floating icon box */}
                <div className="hidden md:flex w-1/2 pl-12 items-center relative">
                  
                  {/* Floating Icon Box on the Right (for Step 2, 4) */}
                  {!isOdd && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 left-8 hidden xl:flex w-12 h-12 rounded-xl bg-[#090b11]/90 border items-center justify-center transition-all duration-300 cursor-pointer shadow-lg z-30"
                      style={{
                        borderColor: hoveredIdx === index ? `${step.color}50` : 'rgba(255, 255, 255, 0.08)',
                        boxShadow: hoveredIdx === index ? `0 0 20px ${step.color}20` : 'none'
                      }}
                      onMouseEnter={() => setHoveredIdx(index)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    >
                      <step.icon 
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: hoveredIdx === index ? '#ffffff' : step.color }}
                      />
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

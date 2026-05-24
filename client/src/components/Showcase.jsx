import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Terminal, Cpu, Shield, Workflow, Code, GitBranch } from 'lucide-react';

const Showcase = () => {
  const navigate = useNavigate();

  // Floating mockup code lines
  const codeSnippet = `// Quick.ai Synthesized Architecture
const QuickApp = async () => {
  const workflow = await AI.generateWorkflow({
    prompt: "Modern Express Microservice",
    scale: "Production",
    database: "PostgreSQL"
  });
  
  await workflow.initializeEnv();
  await workflow.deployToCloud();
  console.log("System stable • v2.0.0");
};`;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 py-28 border-t border-white/5 bg-[#020204]/60 overflow-hidden font-outfit">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse"></div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side: Dynamic Copywriting */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-semibold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            Next-Gen Architecture
          </motion.div>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400 font-mono"
            >
              The Future of AI-Assisted Development
            </motion.h2>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight"
            >
              Architect. Build.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.35)]">
                Scale.
              </span>
            </motion.h3>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed font-light max-w-xl mx-auto lg:mx-0"
          >
            Quick.ai transforms raw ideas into production-ready systems using AI-powered workflows, intelligent architecture planning, automation tools, and developer-focused execution systems.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button
              onClick={() => navigate('/ai')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Building
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => navigate('/ai/codeflow')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-neutral-900 border border-white/10 hover:border-cyan-500/50 hover:bg-neutral-800 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              Explore CodeFlow
            </button>
          </motion.div>
        </div>

        {/* Right Side: High Fidelity Digital Dashboard Mockup & Holograms */}
        <div className="lg:col-span-6 relative flex justify-center py-8">
          
          {/* Orbiting particle ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-[380px] h-[380px] border border-dashed border-purple-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute w-[440px] h-[440px] border border-dashed border-cyan-500/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[480px]"
          >
            {/* Ambient Radial Gradient behind Robot */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/0 to-cyan-500/5 rounded-3xl blur-3xl -z-10"></div>

            {/* Dashboard Wrapper */}
            <div className="w-full border border-white/10 rounded-3xl bg-[#090718]/40 backdrop-blur-xl p-5 flex flex-col justify-between overflow-hidden shadow-2xl relative hover:border-purple-500/30 transition-colors duration-500">
              
              {/* Fake Dashboard Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5 font-mono">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                  AI Architecture Map
                </span>
                <span className="text-[9px] font-mono text-purple-400 bg-purple-950/20 px-2 py-0.5 rounded border border-purple-500/20">STABLE CLOUD</span>
              </div>

              {/* Graphic Hologram Nodes Map */}
              <div className="relative py-4 flex flex-col items-center justify-center gap-4 bg-black/25 rounded-2xl border border-white/5 mb-4 p-4">
                
                {/* Center Core Node */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.3)] z-10 flex items-center justify-center">
                  <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center text-xl">
                    ⚡
                  </div>
                </div>

                {/* Connected Orbit Nodes */}
                <div className="flex gap-16 justify-center mt-2">
                  {/* Database Node */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-xl border border-white/10 bg-neutral-950/60 hover:border-cyan-500/30 flex items-center justify-center text-xs shadow-md">
                      💾
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase font-bold">SQL Database</span>
                  </div>

                  {/* API Controller Node */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-xl border border-white/10 bg-neutral-950/60 hover:border-pink-500/30 flex items-center justify-center text-xs shadow-md">
                      ⚙️
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase font-bold">Express API</span>
                  </div>

                  {/* Vercel Cloud Node */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-xl border border-white/10 bg-neutral-950/60 hover:border-purple-500/30 flex items-center justify-center text-xs shadow-md">
                      ☁️
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase font-bold">Vercel Deploy</span>
                  </div>
                </div>

                {/* SVG glowing connection paths */}
                <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 50,30 L 25,65 M 50,30 L 50,65 M 50,30 L 75,65" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.75" fill="none" />
                </svg>
              </div>

              {/* Floating Code Widget */}
              <div className="relative rounded-2xl bg-neutral-950/80 border border-white/5 p-4 font-mono text-[9px] text-purple-300/80 text-left shadow-lg overflow-hidden group">
                <div className="absolute top-1 right-2 text-[7px] text-slate-500">plan_compiler.js</div>
                <pre className="custom-scrollbar overflow-x-auto leading-relaxed whitespace-pre-wrap">{codeSnippet}</pre>
              </div>
            </div>

            {/* Float Cards around Dashboard */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-4 -left-8 p-2.5 bg-neutral-950/90 border border-white/10 rounded-xl backdrop-blur-md shadow-xl text-[10px] flex items-center gap-1.5 font-semibold text-white pointer-events-none"
            >
              <Workflow className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Planning System Active</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -bottom-4 -right-4 p-2.5 bg-neutral-950/90 border border-white/10 rounded-xl backdrop-blur-md shadow-xl text-[10px] flex items-center gap-1.5 font-semibold text-white pointer-events-none"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>ATS score: 98%</span>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Showcase;

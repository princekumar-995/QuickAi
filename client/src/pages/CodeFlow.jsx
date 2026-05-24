import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Workflow, 
  Cpu, 
  GitBranch, 
  BookOpen, 
  Layers, 
  CloudLightning,
  Settings,
  Terminal,
  Shield,
  ThumbsUp,
  User,
  Zap,
  Layout,
  Code,
  FileText,
  LayoutGrid
} from 'lucide-react';
import toast from 'react-hot-toast';

// Feature items configuration
const featuresList = [
  {
    title: 'Visual Planning',
    desc: 'Map out your entire microservice or serverless system on an interactive drag-and-drop workflow canvas.',
    icon: Workflow,
    color: 'from-purple-500/20 to-pink-500/5',
    borderColor: 'group-hover:border-purple-500/50',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]'
  },
  {
    title: 'Smart Tech Stack',
    desc: 'AI chooses the ideal stack for your scale, listing dependencies, alternatives, and rationale automatically.',
    icon: Cpu,
    color: 'from-cyan-500/20 to-blue-500/5',
    borderColor: 'group-hover:border-cyan-500/50',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]'
  },
  {
    title: 'Git Integration',
    desc: 'Generate clear commit strategies, branching roadmaps, and boilerplate script setups automatically.',
    icon: GitBranch,
    color: 'from-pink-500/20 to-rose-500/5',
    borderColor: 'group-hover:border-pink-500/50',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.15)]'
  },
  {
    title: 'Auto Documentation',
    desc: 'Generate complete API documentation templates, SQL tables, and configuration guidelines.',
    icon: BookOpen,
    color: 'from-amber-500/20 to-orange-500/5',
    borderColor: 'group-hover:border-amber-500/50',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]'
  },
  {
    title: 'Testing Framework',
    desc: 'Produce unit, integration, and E2E script templates (Vitest, Playwright) custom-fitted to your architecture.',
    icon: Settings,
    color: 'from-emerald-500/20 to-teal-500/5',
    borderColor: 'group-hover:border-emerald-500/50',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'
  },
  {
    title: 'One Click Deploy',
    desc: 'Receive copy-paste production setup commands, Dockerfiles, and CI/CD pipelines for deployment.',
    icon: CloudLightning,
    color: 'from-indigo-500/20 to-blue-500/5',
    borderColor: 'group-hover:border-indigo-500/50',
    glow: 'shadow-[0_0_30px_rgba(99,102,241,0.15)]'
  }
];

// Step colors and glow configurations matching premium image style
const stepColors = [
  {
    color: '#a855f7', // purple
    badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    dot: 'bg-purple-500 shadow-purple-500/50',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.15)]',
    border: 'hover:border-purple-500/30',
  },
  {
    color: '#ec4899', // pink
    badge: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    dot: 'bg-pink-500 shadow-pink-500/50',
    glow: 'shadow-[0_0_25px_rgba(236,72,153,0.15)]',
    border: 'hover:border-pink-500/30',
  },
  {
    color: '#6366f1', // indigo/blue
    badge: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    dot: 'bg-indigo-500 shadow-indigo-500/50',
    glow: 'shadow-[0_0_25px_rgba(99,102,241,0.15)]',
    border: 'hover:border-indigo-500/30',
  },
  {
    color: '#10b981', // emerald
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-500 shadow-emerald-500/50',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.15)]',
    border: 'hover:border-emerald-500/30',
  },
  {
    color: '#f59e0b', // amber
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    dot: 'bg-amber-500 shadow-amber-500/50',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.15)]',
    border: 'hover:border-amber-500/30',
  },
  {
    color: '#ef4444', // red
    badge: 'text-red-400 bg-red-500/10 border-red-500/20',
    dot: 'bg-red-500 shadow-red-500/50',
    glow: 'shadow-[0_0_25px_rgba(239,68,68,0.15)]',
    border: 'hover:border-red-500/30',
  }
];

// Timeline steps configuration with customized phases and icons matching Image 2
const timelineSteps = [
  {
    title: 'Describe Your Project',
    desc: 'Provide your app idea or system requirements in plain English in our interactive workspace.',
    icon: FileText,
    glowColor: 'rgba(168, 85, 247, 0.4)',
    phase: 'Planning'
  },
  {
    title: 'Get AI Generated Flowchart',
    desc: 'Explore a fully mapped React Flow diagram splitting your system into structured development phases.',
    icon: LayoutGrid,
    glowColor: 'rgba(236, 72, 153, 0.4)',
    phase: 'Planning'
  },
  {
    title: 'Review Tech Stack',
    desc: 'Browse architectural components, database entity recommendations, and customized alternatives.',
    icon: Cpu,
    glowColor: 'rgba(6, 182, 212, 0.4)',
    phase: 'Planning'
  },
  {
    title: 'Start Coding',
    desc: 'Copy terminal bash setups and boilerplate server files to initialize your directories in seconds.',
    icon: Code,
    glowColor: 'rgba(16, 185, 129, 0.4)',
    phase: 'Coding'
  },
  {
    title: 'Test & Refactor',
    desc: 'Ensure system stability by copying unit test templates and validating output payloads.',
    icon: Shield,
    glowColor: 'rgba(245, 158, 11, 0.4)',
    phase: 'Testing'
  },
  {
    title: 'Deploy & Scale',
    desc: 'Deliver updates automatically using tailored GitHub Actions workflows and Cloud deployments.',
    icon: CloudLightning,
    glowColor: 'rgba(239, 68, 68, 0.4)',
    phase: 'Deploying'
  }
];

// Testimonials data for marquee
const testimonialsColumn1 = [
  { name: 'Alex Rivers', role: 'Staff Engineer', text: 'This tool saved me hours of system design. Went from zero to full architecture diagram in 20 seconds.' },
  { name: 'Maria Chen', role: 'Full Stack Dev', text: 'The React Flow visual layout is highly intuitive. It maps my express routes perfectly.' },
  { name: 'Siddharth M.', role: 'Startup Founder', text: 'CodeFlow is a absolute lifesaver for rapid prototyping. We launched our MVP in half the time.' }
];

const testimonialsColumn2 = [
  { name: 'Derrick K.', role: 'DevOps Lead', text: 'The generated Dockerfiles and CI/CD script suggestions worked out-of-the-box. Absolute gold!' },
  { name: 'Emma Watson', role: 'UI Architect', text: 'Stunning neon dark theme design. The interface is highly responsive and clean.' },
  { name: 'Arjun P.', role: 'Senior Consultant', text: 'Clicking nodes to see database schemas and tooling recommendations is remarkably smart.' }
];

const testimonialsColumn3 = [
  { name: 'Chloe Vance', role: 'Lead Architect', text: 'We plan all our feature workflows in CodeFlow now. It makes onboarding new developers effortless.' },
  { name: 'Tyler Durden', role: 'Software Engineer', text: 'One-click vertical/horizontal layout switching makes reviewing complex systems super easy.' },
  { name: 'Sarah Connor', role: 'Backend Specialist', text: 'The database schema generation saves massive whiteboarding hours. Clean, structured output!' }
];

// Default sample plan in case they want a quick visual check
const SAMPLE_FLOWCHART_DATA = {
  "root": {
    "id": "workflow",
    "label": "workflow",
    "children": [
      {
        "id": "planning",
        "label": "Planning",
        "color": "#ec4899",
        "children": [
          {
            "id": "p1",
            "label": "Project Discovery",
            "details": "Analyze business requirements, map dependencies, and draft high-level scopes.",
            "tools": ["Notion", "Miro"],
            "features": ["System scoping", "Mockups review"],
            "databaseTables": ["configurations"],
            "apiEndpoints": [],
            "testingTools": [],
            "deploymentTools": []
          }
        ]
      },
      {
        "id": "design",
        "label": "Design",
        "color": "#3b82f6",
        "children": [
          {
            "id": "d1",
            "label": "Database Schema Modeling",
            "details": "Model primary tables, index keys, and references for system data stability.",
            "tools": ["PgAdmin", "dbdiagram.io"],
            "features": ["SQL setup", "Data isolation"],
            "databaseTables": ["users", "profiles"],
            "apiEndpoints": [],
            "testingTools": [],
            "deploymentTools": []
          }
        ]
      },
      {
        "id": "implementation",
        "label": "Implementation",
        "color": "#10b981",
        "children": [
          {
            "id": "i1",
            "label": "Authentication & Gateway",
            "details": "Integrate secure auth gates and configure router middleware handlers.",
            "tools": ["Clerk SDK", "Express JWT"],
            "features": ["Token verification", "Session lifecycle"],
            "databaseTables": ["users"],
            "apiEndpoints": ["POST /api/auth/login", "GET /api/auth/session"],
            "testingTools": ["Supertest"],
            "deploymentTools": ["Docker", "Vercel CLI"]
          }
        ]
      },
      {
        "id": "testing",
        "label": "Testing",
        "color": "#f59e0b",
        "children": [
          {
            "id": "t1",
            "label": "Automated Testing Suite",
            "details": "Configure test runners and write integration endpoints checking scripts.",
            "tools": ["Vitest", "Jest"],
            "features": ["Mock databases testing", "Assertions coverage"],
            "databaseTables": [],
            "apiEndpoints": [],
            "testingTools": ["Jest"],
            "deploymentTools": []
          }
        ]
      },
      {
        "id": "deployment",
        "label": "Deployment",
        "color": "#f97316",
        "children": [
          {
            "id": "dep1",
            "label": "CI/CD Pipeline Setup",
            "details": "Compile, run linter testing, and execute target production deployment loops.",
            "tools": ["GitHub Actions", "Vercel Hooks"],
            "features": ["DevOps triggers", "Rollback hooks"],
            "databaseTables": [],
            "apiEndpoints": [],
            "testingTools": [],
            "deploymentTools": ["GitHub Actions"]
          }
        ]
      },
      {
        "id": "maintenance",
        "label": "Maintenance",
        "color": "#a855f7",
        "children": [
          {
            "id": "m1",
            "label": "Metrics & APM Logging",
            "details": "Setup request logger pipelines, monitor container health, and configure alerts.",
            "tools": ["Sentry", "Winston Logger"],
            "features": ["Vitals reporting", "Error logs analytics"],
            "databaseTables": ["logs"],
            "apiEndpoints": ["POST /api/logs/report"],
            "testingTools": [],
            "deploymentTools": []
          }
        ]
      }
    ]
  },
  "techStack": {
    "frontend": "React with Tailwind CSS and Framer Motion.",
    "backend": "Node.js with Express and OpenAI SDK.",
    "database": "MongoDB or PostgreSQL relational database.",
    "hosting": "Vercel for client, Render or AWS for backend services.",
    "aiTools": "OpenAI API completions model Integration.",
    "devTools": "Vite bundling, ESLint checking, and Git control."
  },
  "techStackDetails": [
    { "name": "React", "category": "Frontend", "whyToUse": "Efficient UI updates and large hooks ecosystem.", "alternatives": ["Vue", "Svelte"], "rating": 5 },
    { "name": "Express.js", "category": "Backend", "whyToUse": "Fast, minimal, and fully compatible with Node middleware.", "alternatives": ["Fastify", "NestJS"], "rating": 5 },
    { "name": "OpenAI API", "category": "AI Tools", "whyToUse": "Powerful structured output JSON modes and superior semantic reasoning.", "alternatives": ["Gemini", "Anthropic Claude"], "rating": 5 }
  ],
  "bashCommand": "mkdir sample-flow && cd sample-flow && npm init -y && npm i express dotenv openai cors && echo 'CodeFlow initialized!'"
};

const CodeFlow = () => {
  const navigate = useNavigate();

  const handleGenerateSample = () => {
    localStorage.setItem('quickai_flowchart_data', JSON.stringify(SAMPLE_FLOWCHART_DATA));
    localStorage.setItem('quickai_flowchart_prompt', "AI Microservices Blogging Sample");
    toast.success("Sample Workflow generated successfully!");
    navigate('/ai/flowchart');
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white relative overflow-hidden font-outfit">
      
      {/* 🌌 Cyber Backdrop Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c16_1px,transparent_1px),linear-gradient(to_bottom,#0c0c16_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>
      
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[130px] pointer-events-none -z-10"></div>
      <div className="absolute top-[20%] right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* ================= CODEFLOW HERO SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Content */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/20 text-purple-300 text-xs font-semibold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-400" />
            AI Architecture Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none"
          >
            Plan First.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.35)]">
              Ship Production-Ready.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
          >
            Turn your project idea into a complete AI-generated workflow, tech stack, architecture, and development roadmap.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={() => navigate('/ai/describe-problem')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Describe Your Problem
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleGenerateSample}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-900 border border-white/10 hover:border-cyan-500/50 hover:bg-neutral-800 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            >
              Generate Sample Flowchart
            </button>
          </motion.div>
        </div>

        {/* Right Side Illustration */}
        <div className="lg:col-span-5 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-80 h-80 sm:w-96 sm:h-96"
          >
            {/* Ambient Radial Gradient behind Robot */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>

            {/* Simulated Animated AI Robot Canvas */}
            <div className="w-full h-full border border-purple-500/20 rounded-3xl bg-neutral-950/40 backdrop-blur-xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl relative group hover:border-purple-500/40 transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                  Core Engine Online
                </span>
                <span className="text-[10px] font-mono text-purple-400">v4.0.0</span>
              </div>

              {/* Glowing Interactive Graphic */}
              <div className="my-auto flex flex-col items-center justify-center relative py-6">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 p-[2px] shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center z-10"
                >
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl">
                    🤖
                  </div>
                </motion.div>

                {/* Orbiting particles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                    className="w-40 h-40 border border-dashed border-white/10 rounded-full flex items-center justify-between"
                  >
                    <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>
                    <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]"></div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom stats indicators */}
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['10%', '90%', '50%', '85%'] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  ></motion.div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>ANALYZING GRAPH SCHEMA</span>
                  <span>85% STABLE</span>
                </div>
              </div>
            </div>

            {/* Glowing Floating cards */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -top-6 -left-10 p-3 bg-neutral-900/90 border border-white/10 rounded-xl backdrop-blur-md shadow-xl text-xs flex items-center gap-2 pointer-events-none"
            >
              <Workflow className="w-4 h-4 text-purple-400" />
              <span>React Flow Configured</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -bottom-6 -right-6 p-3 bg-neutral-900/90 border border-white/10 rounded-xl backdrop-blur-md shadow-xl text-xs flex items-center gap-2 pointer-events-none"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>gpt-4o-mini ready</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 border-t border-white/5 bg-black/20">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block mb-3">Core Advantages</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight">
            CodeFlow Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feat, idx) => {
            const FeatIcon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className={`relative group p-8 rounded-2xl bg-neutral-950/40 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 overflow-hidden flex flex-col justify-between hover:shadow-2xl ${feat.glow}`}
              >
                {/* Gradient background hover fade */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}></div>

                <div>
                  <div className="mb-6 p-4 w-fit rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <FeatIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit text-white mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">
                    {feat.desc}
                  </p>
                </div>

                {/* Neon side border indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500 to-cyan-400 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <span className="text-purple-400 text-xs font-bold uppercase tracking-widest block mb-3">Roadmap Sequence</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg font-light">
            A streamlined process from idea to production-ready implementation.
          </p>
        </div>

        {/* Central Vertical Flow Timeline */}
        <div className="relative">
          {/* Vertical central neon line - centered exactly */}
          <div className="absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-purple-500 via-pink-500 to-indigo-500 opacity-20 shadow-[0_0_15px_rgba(168,85,247,0.3)]"></div>

          <div className="space-y-16">
            {timelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isEven = idx % 2 === 0;
              const colorInfo = stepColors[idx % stepColors.length];

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6 }}
                  className="relative flex justify-center items-center w-full"
                >
                  {/* Timeline Dot on the Top Border of Card */}
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#020204] border-2 z-20 flex items-center justify-center transition-all duration-300"
                    style={{ borderColor: colorInfo.color }}
                  >
                    <div className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125" style={{ backgroundColor: colorInfo.color }}></div>
                  </div>

                  {/* Absolute Floating Icon Box - Hidden on mobile, shown on md+ */}
                  <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 items-center justify-center w-14 h-14 rounded-2xl bg-[#090716]/80 backdrop-blur-xl border border-white/5 shadow-lg hover:scale-110 transition-all duration-300 ${
                    isEven ? 'right-full mr-8' : 'left-full ml-8'
                  } ${colorInfo.border} ${colorInfo.glow}`}>
                    <StepIcon className="w-6 h-6" style={{ color: colorInfo.color }} />
                  </div>

                  {/* Step Info Card (Centered) - Spanning wide like Image 2 */}
                  <div className="w-full max-w-[960px] px-4 md:px-0 z-10 group">
                    <div className={`relative p-6 sm:p-8 rounded-3xl bg-[#080614]/50 border border-white/5 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl ${colorInfo.border} ${colorInfo.glow}`}>
                      
                      {/* Decorative internal subtle glow */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      {/* Header containing Badge & Phase */}
                      <div className="flex items-center gap-3 mb-4">
                        {/* Step Number Badge */}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono border ${colorInfo.badge}`}>
                          Step {idx + 1}
                        </span>
                        
                        {/* Phase/Category Text */}
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {step.phase}
                        </span>

                        {/* Mobile view only icon - placed top right inside the card */}
                        <div className="md:hidden ml-auto p-2 rounded-xl bg-neutral-900/60 border border-white/5">
                          <StepIcon className="w-4 h-4" style={{ color: colorInfo.color }} />
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-outfit text-white mb-3 group-hover:text-white transition-colors">
                        {step.title}
                      </h3>
                      
                      <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DEVELOPER REVIEWS SECTION ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 border-t border-white/5 overflow-hidden">
        <div className="text-center mb-16">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block mb-3">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-outfit tracking-tight">
            What Developers Say
          </h2>
        </div>

        {/* 3 Infinite Vertical Scrolling Marquee Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[450px] relative overflow-hidden select-none">
          {/* Top/Bottom Fade mask */}
          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#020204] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#020204] to-transparent z-10 pointer-events-none"></div>

          {/* Column 1 (Scroll Up) */}
          <div className="relative overflow-hidden h-full flex flex-col gap-4">
            <motion.div
              animate={{ y: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 18 }}
              className="flex flex-col gap-4"
            >
              {[...testimonialsColumn1, ...testimonialsColumn1].map((test, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-neutral-950/60 border border-white/5 hover:border-cyan-500/40 transition-colors hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-xs">
                      {test.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{test.name}</h4>
                      <p className="text-[10px] text-slate-500">{test.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">"{test.text}"</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Column 2 (Scroll Down) */}
          <div className="relative overflow-hidden h-full flex flex-col gap-4">
            <motion.div
              animate={{ y: ['-50%', '0%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
              className="flex flex-col gap-4"
            >
              {[...testimonialsColumn2, ...testimonialsColumn2].map((test, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-neutral-950/60 border border-white/5 hover:border-purple-500/40 transition-colors hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 flex items-center justify-center font-bold text-xs">
                      {test.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{test.name}</h4>
                      <p className="text-[10px] text-slate-500">{test.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">"{test.text}"</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Column 3 (Scroll Up) */}
          <div className="relative overflow-hidden h-full flex flex-col gap-4">
            <motion.div
              animate={{ y: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 22 }}
              className="flex flex-col gap-4"
            >
              {[...testimonialsColumn3, ...testimonialsColumn3].map((test, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-neutral-950/60 border border-white/5 hover:border-cyan-500/40 transition-colors hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs">
                      {test.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{test.name}</h4>
                      <p className="text-[10px] text-slate-500">{test.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">"{test.text}"</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CodeFlow;

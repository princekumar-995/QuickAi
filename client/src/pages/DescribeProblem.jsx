import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  Workflow, 
  Cpu, 
  Terminal, 
  Database, 
  Network, 
  FolderOpen, 
  CloudLightning,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';
import { useAuth } from '@clerk/clerk-react';

const checkboxItems = [
  { id: 'flowchart', label: 'Visual Flowchart', desc: 'React Flow diagrams and status nodes.', icon: Workflow },
  { id: 'techStack', label: 'Tech Stack', desc: 'Frontend, Backend, Database tools choice.', icon: Cpu },
  { id: 'bashCommands', label: 'Bash Commands', desc: 'Initialize command-line setups.', icon: Terminal },
  { id: 'databaseDesign', label: 'Database Design', desc: 'Tables models and indices.', icon: Database },
  { id: 'apiStructure', label: 'API Structure', desc: 'REST API paths and handlers list.', icon: Network },
  { id: 'folderStructure', label: 'Folder Structure', desc: 'Scaffold directories hierarchy.', icon: FolderOpen },
  { id: 'deploymentPlan', label: 'Deployment Plan', desc: 'Dockerfiles and CI/CD pipelines.', icon: CloudLightning }
];

const loadingMessages = [
  "Analyzing problem statement...",
  "Querying AI software architects...",
  "Formulating visual React Flow nodes...",
  "Structuring database entities...",
  "Compiling setup bash scripts...",
  "Structuring REST API router routes...",
  "Validating JSON blueprint schema..."
];

const DescribeProblem = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [prompt, setPrompt] = useState('');
  const [configs, setConfigs] = useState({
    flowchart: true,
    techStack: true,
    bashCommands: true,
    databaseDesign: true,
    apiStructure: true,
    folderStructure: true,
    deploymentPlan: true
  });
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleConfig = (key) => {
    setConfigs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please describe your project idea or problem!');
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    // 14. Add clean console logs for debugging
    console.log("API URL:", api.defaults.baseURL + "/api/generate/workflow");
    console.log("Request Payload:", { userPrompt: prompt, configs: configs });

    let response = null;
    let retries = 3;
    let success = false;
    let lastError = null;

    while (retries > 0 && !success) {
      try {
        const token = await getToken();
        response = await api.post(
          '/api/generate/workflow',
          {
            userPrompt: prompt,
            configs: configs
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        success = true;
      } catch (err) {
        lastError = err;
        const isNetworkError = !err.response || err.message?.includes("Network Error") || err.code === "ERR_NETWORK" || err.code === "ECONNABORTED";
        
        if (isNetworkError) {
          retries--;
          console.warn(`⚠️ Network connection failed. Retrying... (${3 - retries}/3)`);
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1500)); // wait 1.5s
          }
        } else {
          // Break immediately on non-network errors (like 400 Bad Request or 500 Server Error)
          break;
        }
      }
    }

    try {
      if (!success && lastError) {
        throw lastError;
      }

      console.log("API response:", response.data);

      if (response.data.success) {
        const parsedData = response.data.workflow || response.data.plan;
        
        // Save in localStorage for reload safety
        localStorage.setItem('quickai_flowchart_data', JSON.stringify(parsedData));
        localStorage.setItem('quickai_flowchart_prompt', prompt);

        toast.success("AI Workflow successfully generated!");
        
        // 17. Automatically navigate to workflow result page
        navigate('/ai/flowchart', { state: { flowchartData: parsedData, userPrompt: prompt } });
      } else {
        toast.error(response.data.message || "Failed to generate workflow plan.");
      }
    } catch (err) {
      // 14. Add API error log
      console.error("API error:", err);

      const isNetworkError = !err.response || err.message?.includes("Network Error") || err.code === "ERR_NETWORK" || err.code === "ECONNABORTED";
      
      if (isNetworkError) {
        // 20. If backend fails: show toast: “Backend server not connected”
        toast.error("Backend server not connected");
      } else {
        // 21. If OpenAI fails: show toast: “AI generation failed”
        toast.error("AI generation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020204] text-white relative py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>

      {/* Header / Back Button */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center justify-between">
        <button 
          onClick={() => navigate('/ai/codeflow')}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900/60 border border-white/5 rounded-xl text-xs text-slate-400 hover:text-white transition hover:border-purple-500/20 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to CodeFlow
        </button>

        <div className="flex items-center gap-2 text-right">
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest bg-purple-950/20 border border-purple-500/20 px-2.5 py-1 rounded-full">
            AI Architect Suite
          </span>
        </div>
      </div>

      {!loading ? (
        <form onSubmit={handleGenerate} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* LEFT: Describe Prompt Textarea */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950/50 border border-white/5 backdrop-blur-xl shadow-xl flex flex-col gap-6">
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-400">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">Describe Your Project</h1>
                  <p className="text-sm text-slate-400 mt-1 font-light">
                    Outline your project goals, required services, frameworks, and architecture ideas in plain English.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={9}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want to build a modern AI blogging platform with user dashboard. I need user authentication, database persistence, automated content suggestions using LLM APIs, and Docker files..."
                  className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl outline-none text-white text-sm placeholder-slate-700 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none shadow-inner leading-relaxed"
                />
              </div>

              <div className="text-xs text-slate-500 font-light flex items-center gap-2 bg-white/[0.01] p-3 rounded-lg border border-white/[0.02]">
                💡 Tip: Provide details about databases, authentication options, or deployment configurations for highly customized roadmaps.
              </div>
            </div>
          </div>

          {/* RIGHT: Checklist Cards */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950/50 border border-white/5 backdrop-blur-xl shadow-xl space-y-6 flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">Generate Deliverables</h2>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Select target items to draft during AI workflow planning.
                  </p>
                </div>

                {/* Checkbox grid */}
                <div className="grid grid-cols-1 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {checkboxItems.map((item) => {
                    const ItemIcon = item.icon;
                    const isSelected = configs[item.id];

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleConfig(item.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                          isSelected 
                            ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50' 
                            : 'bg-black/35 border-white/5 hover:border-white/10 hover:bg-neutral-900/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${
                            isSelected 
                              ? 'bg-purple-900/30 border-purple-500/30 text-purple-400' 
                              : 'bg-neutral-900 border-white/5 text-slate-500'
                          }`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.label}</h4>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5">{item.desc}</p>
                          </div>
                        </div>

                        <div>
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BOTTOM: Submit Button */}
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className={`w-full mt-6 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 ${
                  (!prompt.trim() || loading) 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                }`}
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                Generate Workflow
              </button>
            </div>
          </div>

        </form>
      ) : (
        /* Futuristic Loading Overlay Screen */
        <div className="max-w-md mx-auto py-12 relative z-10">
          <div className="bg-neutral-950/90 border border-purple-500/30 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.2)] text-center backdrop-blur-xl">
            
            <div className="relative mb-6">
              {/* Rotating outer spinner */}
              <div className="w-24 h-24 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
              {/* Inner glowing pulsing dot */}
              <div className="w-12 h-12 rounded-full bg-purple-500/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
            </div>

            <h3 className="text-xl font-bold font-outfit text-white mb-2">Generating AI CodeFlow...</h3>
            <p className="text-xs text-purple-400 font-medium tracking-wide min-h-[16px] mb-6">
              {loadingMessages[loadingStep]}
            </p>

            <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-[65%] animate-pulse"></div>
            </div>

            <span className="text-[10px] text-slate-500 block">
              Architecting nodes, code templates, and databases.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescribeProblem;

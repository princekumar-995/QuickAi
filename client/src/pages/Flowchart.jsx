import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  Handle, 
  Position, 
  Panel 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Sparkles, 
  ArrowLeft, 
  Download, 
  Save, 
  Grid, 
  Cpu, 
  Terminal, 
  Plus, 
  Trash2,
  ClipboardList,
  Palette,
  Code2,
  FileCheck,
  Rocket,
  Settings2,
  Workflow,
  X,
  Copy,
  Check,
  Star,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import toast from 'react-hot-toast';
import TaskNode from "../components/TaskNode";
import { buildFlowElements } from "../utils/buildFlowElements";

// 1. Custom Node Component
const CustomNode = ({ data }) => {
  const isRoot = data.isRoot;
  const isPhase = data.isPhase;
  const isTask = data.isTask;
  const isVertical = data.direction === 'vertical';

  const borderColor = data.color || '#a855f7';

  // Mapping corresponding icon for headers
  const getHeaderIcon = () => {
    if (isRoot) return <Workflow className="w-3.5 h-3.5 text-purple-400 animate-pulse" />;
    
    const name = data.label.toLowerCase();
    if (name.includes("planning")) return <ClipboardList className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
    if (name.includes("design")) return <Palette className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    if (name.includes("implementation")) return <Code2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (name.includes("testing")) return <FileCheck className="w-3.5 h-3.5 text-yellow-400 shrink-0" />;
    if (name.includes("deployment")) return <Rocket className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    if (name.includes("maintenance")) return <Settings2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    
    return <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
  };
  
  return (
    <div 
      className={`p-4 rounded-2xl bg-[#09090D] border-2 transition-all duration-300 text-white min-w-[210px] max-w-[240px] shadow-lg relative group ${
        isRoot ? 'shadow-purple-500/10' : ''
      } hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] cursor-pointer`}
      style={{ 
        borderColor: borderColor,
        boxShadow: `0 0 15px ${borderColor}15`,
      }}
    >
      {/* Target Handle */}
      {!isRoot && (
        <Handle 
          type="target" 
          position={isVertical ? Position.Top : Position.Left} 
          style={{ background: borderColor, width: 8, height: 8 }}
        />
      )}
      
      <div className="flex flex-col gap-1.5">
        {/* Node Category Header with Icons */}
        <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5 mb-0.5">
          {getHeaderIcon()}
          {!isRoot && !isPhase && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: borderColor }} />}
          <span className="text-[8px] uppercase font-bold tracking-widest text-slate-500">
            {isRoot ? 'Architecture Hub' : isPhase ? 'Phase Block' : `${data.phaseName || 'Task'} Node`}
          </span>
        </div>

        <h4 className="font-extrabold text-xs tracking-wide leading-tight text-white group-hover:text-purple-300 transition-colors">
          {data.label}
        </h4>

        {isTask && data.details && (
          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
            {data.details}
          </p>
        )}

        {isTask && data.tools && data.tools.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.tools.slice(0, 2).map((t, idx) => (
              <span key={idx} className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                {t}
              </span>
            ))}
            {data.tools.length > 2 && (
              <span className="text-[8px] px-1 text-slate-500 font-bold">+{data.tools.length - 2}</span>
            )}
          </div>
        )}

        {isTask && (
          <div className="text-[8px] text-purple-400 font-semibold mt-1 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-2.5 h-2.5" />
            Click to expand details
          </div>
        )}
      </div>
 
      {/* Source Handle */}
      <Handle 
        type="source" 
        position={isVertical ? Position.Bottom : Position.Right} 
        style={{ background: borderColor, width: 8, height: 8 }}
      />
    </div>
  );
};

const WorkflowNode = ({ data }) => {
  const isVertical = data.direction !== 'horizontal';
  return (
    <div 
      className="p-4 rounded-2xl bg-[#09090D] border-2 transition-all duration-300 text-white min-w-[210px] max-w-[240px] shadow-lg text-center hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
      style={{ 
        borderColor: '#a855f7',
        boxShadow: '0 0 15px rgba(168,85,247,0.15)',
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-center gap-1.5 border-b border-white/5 pb-1.5 mb-0.5">
          <Workflow className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-[8px] uppercase font-bold tracking-widest text-slate-500">
            Architecture Hub
          </span>
        </div>
        <h4 className="font-extrabold text-xs tracking-wide leading-tight text-white">
          {data.label}
        </h4>
      </div>
      <Handle 
        type="source" 
        position={isVertical ? Position.Bottom : Position.Right} 
        style={{ background: '#a855f7', width: 8, height: 8 }}
      />
    </div>
  );
};

const PhaseNode = ({ data }) => {
  const borderColor = data.color || '#ec4899';
  const isVertical = data.direction !== 'horizontal';
  return (
    <div 
      className="p-4 rounded-2xl bg-[#09090D] border-2 transition-all duration-300 text-white min-w-[210px] max-w-[240px] shadow-lg text-center hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]"
      style={{ 
        borderColor: borderColor,
        boxShadow: `0 0 15px ${borderColor}15`,
      }}
    >
      <Handle 
        type="target" 
        position={isVertical ? Position.Top : Position.Left} 
        style={{ background: borderColor, width: 8, height: 8 }}
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-center gap-1.5 border-b border-white/5 pb-1.5 mb-0.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="text-[8px] uppercase font-bold tracking-widest text-slate-500">
            Phase Block
          </span>
        </div>
        <h4 className="font-extrabold text-xs tracking-wide leading-tight text-white">
          {data.label}
        </h4>
      </div>
      <Handle 
        type="source" 
        position={isVertical ? Position.Bottom : Position.Right} 
        style={{ background: borderColor, width: 8, height: 8 }}
      />
    </div>
  );
};

// Map node types
const nodeTypes = {
  custom: CustomNode,
  workflowNode: WorkflowNode,
  phaseNode: PhaseNode,
  taskNode: TaskNode
};

const DEFAULT_MOCK_PLAN = {
  "root": {
    "id": "workflow",
    "label": "AI Microservices Blogging Sample",
    "children": [
      {
        "id": "planning",
        "label": "Planning",
        "color": "#ec4899",
        "children": [
          {
            "id": "p1",
            "label": "Project Scope Definition",
            "details": "Define the boundaries, features, and target metrics for the blogging platform.",
            "tools": ["Notion", "Miro"],
            "features": ["Content creation flow", "Explore blogs engine"],
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
            "label": "Database Design & Modeling",
            "details": "Model entity schemas, table relationships, and index setups.",
            "tools": ["PgAdmin", "Dbdiagram.io"],
            "features": ["SQL setup", "Data isolation"],
            "databaseTables": ["users", "posts", "comments"],
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
            "label": "User Authentication & Roles",
            "details": "Integrate secure sign-in controls using Clerk SDKs.",
            "tools": ["Clerk Auth", "React SDK"],
            "features": ["OAuth integration", "Protected router components"],
            "databaseTables": ["users"],
            "apiEndpoints": ["GET /api/auth/profile", "POST /api/auth/register"],
            "testingTools": ["Supertest"],
            "deploymentTools": ["GitHub Actions", "Vercel"]
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
            "label": "Unit Testing Controllers",
            "details": "Draft isolated test suites for controller methods.",
            "tools": ["Jest", "Vitest"],
            "features": ["Controller mocking", "Service layers assert"],
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
            "label": "CI/CD Pipeline Build",
            "details": "Setup deploy routines compiling client and server layers.",
            "tools": ["GitHub Actions", "Vercel CLI"],
            "features": ["Automatic deploys", "Env profile validation"],
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
            "label": "Performance Monitoring Setup",
            "details": "Configure application performance metrics reporting systems.",
            "tools": ["Datadog", "Sentry"],
            "features": ["Logs indexing", "Warning triggers"],
            "databaseTables": [],
            "apiEndpoints": ["POST /api/logs"],
            "testingTools": [],
            "deploymentTools": []
          }
        ]
      }
    ]
  },
  "techStack": {
    "frontend": "React with Tailwind CSS and Framer Motion for client layer.",
    "backend": "Node.js with Express framework. OpenAI SDK completions.",
    "database": "MongoDB NoSQL databases layer.",
    "hosting": "Vercel client hosting, Render API server.",
    "aiTools": "OpenAI completions API.",
    "devTools": "Vite server, Git control, ESLint."
  },
  "techStackDetails": [
    { "name": "React", "category": "Frontend", "whyToUse": "Fast virtual DOM rendering and hooks structures.", "alternatives": ["Svelte", "Vue"], "rating": 5 },
    { "name": "Node.js", "category": "Backend", "whyToUse": "Event-driven asynchronous I/O execution loop.", "alternatives": ["Python FastAPI", "Golang"], "rating": 4 },
    { "name": "MongoDB", "category": "Database", "whyToUse": "Document database supporting dynamic JSON schemas.", "alternatives": ["PostgreSQL", "Firebase"], "rating": 4 }
  ],
  "bashCommand": "mkdir my-chat-app && cd my-chat-app && npm init -y && npm i express cors dotenv mongodb && echo 'Init Complete'"
};

const Flowchart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve flow config
  const initialData = useMemo(() => {
    if (location.state?.flowchartData) return location.state.flowchartData;
    const stored = localStorage.getItem('quickai_flowchart_data');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error("Parse stored plan failed", err);
      }
    }
    return DEFAULT_MOCK_PLAN;
  }, [location.state]);

  const userPrompt = useMemo(() => {
    if (location.state?.userPrompt) return location.state.userPrompt;
    return localStorage.getItem('quickai_flowchart_prompt') || "AI Workflow Generator";
  }, [location.state]);

  const [flowchartData, setFlowchartData] = useState(initialData);
  const [direction, setDirection] = useState('vertical');
  const [activeTab, setActiveTab] = useState('flowchart'); // 'flowchart' | 'techstack' | 'scripts'
  
  // Custom Node Add Form State
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeDetails, setNewNodeDetails] = useState('');
  const [selectedPhaseId, setSelectedPhaseId] = useState('');

  // Floating Detail Overlay State
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  // Copy state
  const [copied, setCopied] = useState(false);

  // Sync default selected phase
  useEffect(() => {
    if (flowchartData && flowchartData.root?.children?.length > 0) {
      setSelectedPhaseId(flowchartData.root.children[0].id);
    }
  }, [flowchartData]);

  // Generate nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!flowchartData || !flowchartData.root) return { initialNodes: [], initialEdges: [] };
    const { nodes, edges } = buildFlowElements(flowchartData, direction);
    console.log("Generated flowchart nodes:", nodes);
    console.log("Generated flowchart edges:", edges);
    return { initialNodes: nodes, initialEdges: edges };
  }, [flowchartData, direction]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state if elements change
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle node click to launch overlay modal
  const onNodeClick = useCallback((event, node) => {
    if (node.id === 'workflow' || node.data.isPhase) return;
    setSelectedNode(node.data);
    setIsDetailViewOpen(true);
  }, []);

  // Add custom node
  const handleAddNode = (e) => {
    e.preventDefault();
    if (!newNodeName.trim()) {
      toast.error("Please enter a task name!");
      return;
    }

    const newTask = {
      id: `custom-task-${Date.now()}`,
      label: newNodeName,
      details: newNodeDetails || "Custom developer outline.",
      tools: ["Custom"],
      features: [],
      databaseTables: [],
      apiEndpoints: [],
      testingTools: [],
      deploymentTools: []
    };

    const updatedData = { ...flowchartData };
    const targetPhase = updatedData.root?.children?.find(p => p.id === selectedPhaseId);
    if (targetPhase) {
      if (!targetPhase.children) targetPhase.children = [];
      targetPhase.children.push(newTask);
      
      setFlowchartData(updatedData);
      localStorage.setItem('quickai_flowchart_data', JSON.stringify(updatedData));
      toast.success(`Task added to ${targetPhase.label}!`);
      setNewNodeName('');
      setNewNodeDetails('');
    } else {
      toast.error("Invalid phase selection.");
    }
  };

  // Download logic as JSON
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flowchartData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quickai-codeflow-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Workflow config JSON exported!");
  };

  // Save flowchart logic
  const handleSave = () => {
    localStorage.setItem('quickai_flowchart_data', JSON.stringify(flowchartData));
    toast.success("Workflow successfully saved to workspace!");
  };

  // Copy Terminal Script
  const handleCopyScript = () => {
    if (!flowchartData.bashCommand) return;
    navigator.clipboard.writeText(flowchartData.bashCommand);
    setCopied(true);
    toast.success("Bash command copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock download image
  const handleDownloadImage = () => {
    toast.success("Canvas screenshot compiled and downloaded!");
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-black text-white flex flex-col font-outfit relative">
      
      {/* Header Panel Controls */}
      <div className="h-16 border-b border-white/10 bg-neutral-950 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/ai/codeflow')}
            className="p-2 bg-neutral-900 rounded-xl hover:bg-neutral-800 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-sm tracking-widest uppercase text-purple-400">Interactive Architect</h1>
            <p className="text-xs text-gray-500 font-light truncate max-w-[200px] sm:max-w-md">
              Configuring: {userPrompt}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-neutral-900 border border-white/5 rounded-full p-1 text-xs font-semibold gap-1">
          <button 
            onClick={() => setActiveTab('flowchart')}
            className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
              activeTab === 'flowchart' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Flowchart
          </button>
          {flowchartData?.techStackDetails && (
            <button 
              onClick={() => setActiveTab('techstack')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'techstack' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Tech Stack
            </button>
          )}
          {flowchartData?.bashCommand && (
            <button 
              onClick={() => setActiveTab('scripts')}
              className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                activeTab === 'scripts' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Setup Scripts
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownload}
            title="Export JSON Configurations"
            className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white rounded-xl border border-white/5 transition flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
          <button 
            onClick={handleSave}
            title="Save diagram config"
            className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-600/10 transition flex items-center gap-2 text-xs font-bold cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Workflow</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden bg-[#050508]">
        
        {/* ================= FLOWCHART VIEW ================= */}
        {activeTab === 'flowchart' && (
          <div className="flex-1 h-[70vh] min-h-[600px] relative w-full border border-white/10 rounded-2xl overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              minZoom={0.2}
              maxZoom={2}
              defaultEdgeOptions={{
                type: 'smoothstep'
              }}
            >
              <Background color="#1f1f2e" gap={24} size={1} />
              <Controls className="bg-neutral-900 border border-white/10 text-white [&>button]:border-white/5 [&>button]:bg-neutral-800" />
              <MiniMap 
                nodeColor={(node) => node.data.color || '#a855f7'}
                maskColor="rgba(0, 0, 0, 0.7)"
                className="bg-neutral-950 border border-white/10 rounded-2xl"
              />

              {/* Float configuration panel */}
              <Panel position="top-left" className="bg-neutral-950/90 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-2xl flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Canvas Controls</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Direction:</span>
                  <div className="flex bg-neutral-900 border border-white/5 rounded-lg p-0.5 text-[10px] font-bold">
                    <button 
                      onClick={() => setDirection('vertical')}
                      className={`px-3 py-1 rounded-md transition ${direction === 'vertical' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Vertical
                    </button>
                    <button 
                      onClick={() => setDirection('horizontal')}
                      className={`px-3 py-1 rounded-md transition ${direction === 'horizontal' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Horizontal
                    </button>
                  </div>
                </div>
                <button 
                  onClick={handleDownloadImage}
                  className="w-full py-2 bg-neutral-900 border border-white/5 hover:border-cyan-500/50 hover:bg-neutral-800 text-[10px] font-bold text-white rounded-lg transition-colors cursor-pointer"
                >
                  Download PNG Snapshot
                </button>
              </Panel>
            </ReactFlow>
          </div>
        )}

        {/* ================= TECH STACK VIEW ================= */}
        {activeTab === 'techstack' && flowchartData?.techStackDetails && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">Smart Tech Stack Blueprint</h2>
              <p className="text-sm text-slate-400 font-light mt-1">
                AI selected libraries and configurations best suited for your prompt payload.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flowchartData.techStackDetails.map((tech, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-neutral-950/50 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 font-mono">
                      {tech.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, sIdx) => (
                        <Star 
                          key={sIdx} 
                          className={`w-3.5 h-3.5 ${sIdx < (tech.rating || 5) ? 'fill-current' : 'opacity-20'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                    {tech.whyToUse}
                  </p>

                  {tech.alternatives && tech.alternatives.length > 0 && (
                    <div className="border-t border-white/5 pt-3">
                      <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-500 block mb-2">Alternatives</span>
                      <div className="flex flex-wrap gap-1.5">
                        {tech.alternatives.map((alt, aIdx) => (
                          <span key={aIdx} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-medium">
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SETUP SCRIPTS VIEW ================= */}
        {activeTab === 'scripts' && flowchartData?.bashCommand && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white">Scaffolding Setup Scripts</h2>
              <p className="text-sm text-slate-400 font-light mt-1">
                Run the terminal script below to initialize directories and pull all dependencies.
              </p>
            </div>

            {/* Terminal Window Box */}
            <div className="relative rounded-2xl border border-purple-500/20 bg-neutral-950 overflow-hidden shadow-2xl shadow-purple-500/5">
              {/* Header Bar */}
              <div className="h-10 bg-neutral-900 border-b border-white/5 px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70"></div>
                  <span className="text-[10px] font-mono text-slate-500 ml-4">sh — terminal console</span>
                </div>
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Script code body */}
              <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto selection:bg-purple-500/30">
                <div className="flex items-start gap-3">
                  <span className="text-slate-600 select-none">$</span>
                  <pre className="whitespace-pre-wrap text-emerald-400 glow-text">{flowchartData.bashCommand}</pre>
                  {/* Flashing cursor */}
                  <div className="w-2 h-4 bg-emerald-400 animate-pulse mt-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= RIGHT SIDEBAR: NODE CUSTOM EDITOR ================= */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-neutral-950 p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-sm tracking-wide uppercase text-white">Append Custom Task</h3>
            </div>

            <form onSubmit={handleAddNode} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Target Phase</label>
                <select
                  value={selectedPhaseId}
                  onChange={(e) => setSelectedPhaseId(e.target.value)}
                  className="w-full p-2.5 bg-black border border-white/10 rounded-xl outline-none text-xs text-white"
                >
                  {flowchartData.root?.children?.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Task Name</label>
                <input
                  type="text"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder="e.g. Verify CORS headers"
                  className="w-full p-2.5 bg-black border border-white/10 rounded-xl outline-none text-xs text-white placeholder-slate-700 focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Details</label>
                <textarea
                  rows={4}
                  value={newNodeDetails}
                  onChange={(e) => setNewNodeDetails(e.target.value)}
                  placeholder="Describe task scope..."
                  className="w-full p-2.5 bg-black border border-white/10 rounded-xl outline-none text-xs text-white placeholder-slate-700 focus:border-purple-500/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 border border-white/10 hover:border-purple-500/50 hover:bg-neutral-800 text-xs font-bold rounded-xl text-white transition-colors cursor-pointer"
              >
                Add Custom Node
              </button>
            </form>
          </div>

          <div className="mt-8 border-t border-white/5 pt-4 text-[10px] text-slate-500 font-light leading-relaxed">
            💡 React Flow canvas operates in zoomable and panable mode. Double click node cards to review their complete tools recommendations.
          </div>
        </div>

      </div>

      {/* ================= FLOATING GLASS MODAL: EXPANDABLE NODES ================= */}
      {isDetailViewOpen && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-neutral-950/95 border border-purple-500/30 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.3)] text-white backdrop-blur-xl relative overflow-hidden transition-all duration-300">
            {/* Phase glow top indicator */}
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"></div>

            {/* Close Button */}
            <button 
              onClick={() => {
                setIsDetailViewOpen(false);
                setSelectedNode(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6">
              
              {/* Header */}
              <div className="flex items-start gap-4">
                <div 
                  className="p-3.5 rounded-2xl bg-neutral-900 text-white shadow-md border"
                  style={{ borderColor: selectedNode.color || '#a855f7' }}
                >
                  <Sparkles className="w-6 h-6" style={{ color: selectedNode.color || '#a855f7' }} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    {selectedNode.phaseName || 'Task Blueprint'} Node
                  </span>
                  <h2 className="text-2xl font-black text-white mt-0.5">{selectedNode.label}</h2>
                </div>
              </div>

              {/* Details Paragraph */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Scope Description</span>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {selectedNode.details || "No scope description generated for this task."}
                </p>
              </div>

              {/* Metadata lists grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Tools */}
                {selectedNode.tools && selectedNode.tools.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Recommended Tools</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.tools.map((t, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/5 text-slate-300 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {selectedNode.features && selectedNode.features.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Features Mapped</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.features.map((f, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/20 border border-purple-500/20 text-purple-300 font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Database tables */}
                {selectedNode.databaseTables && selectedNode.databaseTables.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Database Entities</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.databaseTables.map((db, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-cyan-300 font-mono">
                          {db}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* API endpoints */}
                {selectedNode.apiEndpoints && selectedNode.apiEndpoints.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">REST APIs Routes</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.apiEndpoints.map((api, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/5 text-emerald-400 font-mono">
                          {api}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testing tools */}
                {selectedNode.testingTools && selectedNode.testingTools.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Testing Libraries</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.testingTools.map((test, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-yellow-950/20 border border-yellow-500/20 text-yellow-300 font-medium">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deployment tools */}
                {selectedNode.deploymentTools && selectedNode.deploymentTools.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">CI/CD & DevOps</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.deploymentTools.map((dep, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-orange-950/20 border border-orange-500/20 text-orange-300 font-medium">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Flowchart;

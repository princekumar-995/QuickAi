import React, { useState } from 'react';
import { 
  FileText, 
  ClipboardCheck, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  Download,
  BookOpen,
  User,
  Settings,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';

const ReviewResume = () => {
  const { getToken } = useAuth();
  
  // Tab switcher state
  const [activeTab, setActiveTab] = useState('review'); // 'review' or 'build'

  // ================= ATS REVIEWER STATE =================
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [isImproving, setIsImproving] = useState(false);
  const [improvedResume, setImprovedResume] = useState(null);
  const [updatePrompt, setUpdatePrompt] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [subTab, setSubTab] = useState('report'); // 'report' or 'preview'

  // ================= RESUME BUILDER STATE =================
  const [builderForm, setBuilderForm] = useState({
    name: '',
    jobTitle: '',
    skills: '',
    experience: '',
    projects: '',
    education: ''
  });
  const [builderLoading, setBuilderLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [generatedPdfBase64, setGeneratedPdfBase64] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setReviewResult(null);
      setImprovedResume(null);
      
      // Auto-extract content for TXT files, show loader message for PDF/DOCX
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
          setResumeText(text);
          toast.success("Resume text extracted from file!");
        } else {
          // Keep text clean, backend parses binary buffers directly
          setResumeText(`[Binary File Selected: ${file.name} - Will be parsed dynamically by the AI parser]`);
          toast.success("Resume attached! The AI will parse the document directly.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReviewResume = async (e) => {
    e?.preventDefault();
    if (resumeText.trim() === '' && !selectedFile) {
      toast.error('Please upload a resume file or paste resume text first!');
      return;
    }

    setLoading(true);
    setReviewResult(null);
    setImprovedResume(null);
    const toastId = toast.loading('Running semantic ATS scanning engines...');

    try {
      const token = await getToken();
      
      // Construct FormData to support direct binary uploads
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('resumeText', resumeText);
      formData.append('jobDescription', jobDescription);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/review-resume`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      if (response.data.success) {
        setReviewResult(response.data.analysis);
        if (response.data.analysis.improvedResume) {
          setImprovedResume(response.data.analysis.improvedResume);
        }
        setSubTab('report'); // Default to Report analysis view first
        toast.success('ATS Review completed successfully!', { id: toastId });
      } else {
        toast.error(response.data.message || 'ATS Scanning failed', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Something went wrong. Verify server connection.';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleImproveResume = async () => {
    if (!reviewResult) return;
    setIsImproving(true);
    const toastId = toast.loading('Opening optimized resume draft in preview...');

    try {
      setTimeout(() => {
        if (reviewResult.improvedResume) {
          setImprovedResume(reviewResult.improvedResume);
        }
        setSubTab('preview');
        toast.success('Optimized resume preview active!', { id: toastId });
        setIsImproving(false);
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load optimized resume', { id: toastId });
      setIsImproving(false);
    }
  };

  const handleModifyResume = async (e) => {
    e?.preventDefault();
    if (!updatePrompt.trim()) return;

    setIsUpdating(true);
    const toastId = toast.loading('Applying AI modifications to your resume...');

    try {
      const token = await getToken();
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/modify-resume`,
        {
          resumeText: improvedResume || resumeText,
          prompt: updatePrompt,
          jobDescription: jobDescription
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setImprovedResume(response.data.updatedResume);
        setUpdatePrompt('');
        setSubTab('preview'); // Instantly show preview with the live changes
        toast.success('Resume updated dynamically!', { id: toastId });
      } else {
        toast.error(response.data.message || 'Failed to modify resume', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to update resume. Verify server connection.';
      toast.error(msg, { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  // ================= AI RESUME BUILDER ACTION =================
  const handleGenerateResume = async (e) => {
    e?.preventDefault();
    if (!builderForm.name.trim()) {
      toast.error("Please enter your full name!");
      return;
    }

    setBuilderLoading(true);
    setGeneratedResume(null);
    setGeneratedPdfBase64(null);
    const toastId = toast.loading('Synthesizing professional ATS optimized resume...');

    try {
      const token = await getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/generate-resume`,
        builderForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setGeneratedResume(response.data.markdownResume);
        setGeneratedPdfBase64(response.data.pdfBase64);
        toast.success('Resume generated successfully!', { id: toastId });
      } else {
        toast.error(response.data.message || 'Generation failed', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong generating resume.', { id: toastId });
    } finally {
      setBuilderLoading(false);
    }
  };

  const downloadResume = (content, filename) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded Resume Markdown!");
  };

  const downloadPdf = (base64, filename) => {
    if (!base64) return;
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Downloaded professional PDF Resume!");
    } catch (err) {
      console.error("PDF download failed:", err);
      toast.error("Failed to download PDF.");
    }
  };

  return (
    <div className='w-full'>
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl flex items-center gap-3 font-outfit font-bold text-gray-900 dark:text-white">
          <ClipboardCheck className="w-8 h-8 text-cyan-500"/>
          AI Resume Suite
        </h1>
        <p className="text-gray-500 mt-1">Audit resumes with our recruiter-grade ATS system or synthesize customized high-impact professional resumes from scratch.</p>
      </motion.div>

      {/* Glassmorphic Tab Switcher */}
      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('review')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
            activeTab === 'review' 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20' 
              : 'text-gray-400 border border-white/5 bg-neutral-900/60 hover:bg-neutral-800'
          }`}
        >
          ATS Review & Scan
        </button>
        <button
          onClick={() => setActiveTab('build')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
            activeTab === 'build' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20' 
              : 'text-gray-400 border border-white/5 bg-neutral-900/60 hover:bg-neutral-800'
          }`}
        >
          AI Resume Builder
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'review' ? (
          // ================= TAB 1: ATS REVIEWER =================
          <motion.div 
            key="review-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className='flex flex-col lg:flex-row items-start gap-8'
          >
            {/* Parameter Sidebar */}
            <div className='w-full lg:w-[35%] glass-card p-6 border border-white/10 bg-neutral-950/80 text-white rounded-2xl shadow-xl'>
              <form onSubmit={handleReviewResume} className="space-y-6">
                <div className='flex items-center justify-between mb-4 border-b border-white/10 pb-4'>
                  <h2 className='text-lg font-semibold text-white'>Audit Parameters</h2>
                  <Sparkles className='w-5 h-5 text-cyan-400' />
                </div>

                {/* PDF/DOCX Upload */}
                <div>
                  <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Upload Resume File</label>
                  <label
                    htmlFor="resumeUpload"
                    className="border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-500/50 bg-black/20 hover:bg-black/40 transition"
                  >
                    {selectedFile ? (
                      <p className="text-xs text-cyan-400 font-bold font-mono truncate max-w-[200px]">{selectedFile.name}</p>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-500 mb-1" />
                        <span className="text-[11px] text-gray-400">Click to upload PDF, DOCX, or text</span>
                      </>
                    )}
                  </label>
                  <input
                    id="resumeUpload"
                    type="file"
                    accept=".pdf,.txt,.md,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Paste text fallback */}
                <div>
                  <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Resume Content / Paste Resume</label>
                  <textarea
                    rows={5}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className='w-full p-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:bg-black focus:border-cyan-500/50 transition-all resize-none shadow-inner'
                    placeholder="Or paste the raw text of your resume here to let our semantic ATS scanning engine analyze it..."
                  />
                </div>

                {/* Job description */}
                <div>
                  <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Target Job Description</label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className='w-full p-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white focus:bg-black focus:border-cyan-500/50 transition-all resize-none shadow-inner'
                    placeholder="e.g. Senior Backend Engineer with Node.js, Express, AWS Cloud, and microservices experience..."
                  />
                </div>

                <button
                  type='submit'
                  disabled={loading || (resumeText.trim() === '' && !selectedFile)}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md ${
                    loading 
                      ? 'bg-cyan-600/70 text-white cursor-not-allowed' 
                      : (resumeText.trim() !== '' || selectedFile)
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white cursor-pointer'
                        : 'bg-neutral-900 border border-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Auditing Resume...
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className='w-5 h-5' />
                      Review Resume
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recruiter Results Dashboard */}
            <div className='w-full lg:w-[65%] bg-neutral-950/80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-[620px] max-h-[900px] text-white'>
              
              {/* Header with Glassmorphic Sub-tabs */}
              <div className='bg-neutral-900/60 border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10'>
                <div className='flex items-center gap-3'>
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
                     <ClipboardCheck className='w-4 h-4 text-cyan-400' />
                  </div>
                  <h2 className='text-lg font-semibold text-white'>Recruiter ATS Dashboard</h2>
                </div>
                
                {reviewResult && (
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setSubTab('report')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        subTab === 'report'
                          ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      ATS Analysis
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubTab('preview')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        subTab === 'preview'
                          ? 'bg-purple-600/30 border border-purple-500/30 text-purple-400 font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      AI Rewrite Preview
                    </button>
                  </div>
                )}

                {reviewResult && !improvedResume && subTab === 'report' && (
                  <button 
                    type="button"
                    onClick={handleImproveResume}
                    disabled={isImproving}
                    className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {isImproving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Rewrite Resume
                      </>
                    )}
                  </button>
                )}
                {improvedResume && subTab === 'preview' && (
                  <button 
                    type="button"
                    onClick={() => downloadResume(improvedResume, 'improved_resume.md')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Markdown
                  </button>
                )}
              </div>

              {/* Scrollable Workspace */}
              <div className='flex-1 overflow-y-auto p-6 bg-black/20 custom-scrollbar'>
                 <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div 
                         key="loading"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="h-full flex flex-col justify-center items-center gap-4 text-center mt-20"
                      >
                         <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase animate-pulse">Running semantic recruiter analysis engines...</p>
                      </motion.div>
                    ) : reviewResult ? (
                      subTab === 'report' ? (
                        /* ================ REPORT SUB-TAB ================ */
                        <motion.div 
                           key="report-view"
                           initial={{ opacity: 0, y: 15 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -15 }}
                           className="space-y-8"
                        >
                          {/* Score Gauge & Match Info */}
                          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-neutral-900/60 border border-white/5 shadow-inner">
                            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                                <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="8" fill="transparent" 
                                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (reviewResult.atsScore || 0)) / 100}
                                        strokeLinecap="round" />
                              </svg>
                              <span className="absolute text-2xl font-black font-outfit text-white">{reviewResult.atsScore || 0}%</span>
                            </div>

                            <div className="text-center sm:text-left space-y-2">
                              <h3 className="text-xl font-bold font-outfit text-white">ATS Recruiter Match Index</h3>
                              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                                Your resume was analyzed against target keyword metrics and structure heuristics. Click **Rewrite Resume** or switch to the **AI Rewrite Preview** to modify your resume and fix issues live.
                              </p>
                            </div>
                          </div>

                          {/* Extracted Details & Keyword Metrics Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            
                            {/* Extracted Skills */}
                            <div className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 shadow-sm">
                              <h4 className="font-semibold text-cyan-400 flex items-center gap-2 mb-3.5 text-xs uppercase tracking-wider font-mono">
                                🔧 Extracted Tech Skills
                              </h4>
                              {reviewResult.skills && reviewResult.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {reviewResult.skills.map((skill, idx) => (
                                    <span key={idx} className="px-2.5 py-1 text-[10px] font-semibold bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 rounded-lg">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 font-light italic">No explicit skills extracted.</p>
                              )}
                            </div>

                            {/* Keywords Comparative Matrix */}
                            <div className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 shadow-sm space-y-4">
                              <div>
                                <h4 className="font-semibold text-green-400 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider font-mono">
                                  ✅ Keywords Found
                                </h4>
                                {reviewResult.keywords && reviewResult.keywords.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {reviewResult.keywords.map((kw, idx) => (
                                      <span key={idx} className="px-2 py-0.5 text-[9px] font-medium bg-green-950/30 border border-green-800/30 text-green-400 rounded-md">
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500 font-light italic">None detected.</p>
                                )}
                              </div>

                              <div>
                                <h4 className="font-semibold text-pink-400 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider font-mono">
                                  ❌ Missing Keywords
                                </h4>
                                {reviewResult.missingKeywords && reviewResult.missingKeywords.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {reviewResult.missingKeywords.map((kw, idx) => (
                                      <span key={idx} className="px-2 py-0.5 text-[9px] font-medium bg-pink-950/30 border border-pink-850/30 text-pink-400 rounded-md">
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-green-400 font-light italic">No missing core keywords! Perfect match.</p>
                                )}
                              </div>
                            </div>

                            {/* Extracted Profile Sections */}
                            <div className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 shadow-sm space-y-3">
                              <h4 className="font-semibold text-purple-400 flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wider font-mono">
                                🎓 Extracted Education
                              </h4>
                              {reviewResult.education && reviewResult.education.length > 0 ? (
                                <ul className="space-y-1.5">
                                  {reviewResult.education.map((item, idx) => (
                                    <li key={idx} className="text-xs text-slate-300 leading-normal font-light list-disc list-inside">
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-slate-500 font-light italic">Not extracted.</p>
                              )}
                            </div>

                            <div className="p-5 rounded-2xl bg-neutral-900/40 border border-white/5 shadow-sm space-y-3">
                              <h4 className="font-semibold text-indigo-400 flex items-center gap-2 mb-1.5 text-xs uppercase tracking-wider font-mono">
                                📂 Projects & Experience Highlights
                              </h4>
                              {((reviewResult.projects && reviewResult.projects.length > 0) || (reviewResult.experience && reviewResult.experience.length > 0)) ? (
                                <div className="space-y-3">
                                  {reviewResult.experience && reviewResult.experience.length > 0 && (
                                    <div>
                                      <span className="text-[10px] text-indigo-400 font-mono tracking-wider block mb-1">EXPERIENCE</span>
                                      <ul className="space-y-1">
                                        {reviewResult.experience.map((item, idx) => (
                                          <li key={idx} className="text-[11px] text-slate-300 font-light list-disc list-inside leading-snug">{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {reviewResult.projects && reviewResult.projects.length > 0 && (
                                    <div>
                                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider block mb-1">PROJECTS</span>
                                      <ul className="space-y-1">
                                        {reviewResult.projects.map((item, idx) => (
                                          <li key={idx} className="text-[11px] text-slate-300 font-light list-disc list-inside leading-snug">{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 font-light italic">Not extracted.</p>
                              )}
                            </div>
                          </div>

                          {/* Recruiter Strategy Reviews */}
                          <div className="space-y-4">
                            
                            {/* Strategic Action Items */}
                            {reviewResult.improvementSuggestions && reviewResult.improvementSuggestions.length > 0 && (
                              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/10 to-indigo-950/10 border-l-4 border-purple-500 bg-neutral-900/30 text-left shadow-sm">
                                <h4 className="font-semibold text-purple-400 flex items-center gap-2 mb-3 text-xs uppercase tracking-wider font-mono">
                                  💡 Strategic Action Items
                                </h4>
                                <ul className="space-y-2">
                                  {reviewResult.improvementSuggestions.map((item, index) => (
                                    <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed font-light">
                                      <ChevronRight className="w-4 h-4 text-purple-500/70 shrink-0 mt-0.5" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Formatting Issues */}
                            {reviewResult.formattingIssues && reviewResult.formattingIssues.length > 0 && (
                              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/10 to-orange-950/10 border-l-4 border-amber-500 bg-neutral-900/30 text-left shadow-sm">
                                <h4 className="font-semibold text-amber-400 flex items-center gap-2 mb-3 text-xs uppercase tracking-wider font-mono">
                                  ⚠️ Formatting Critiques
                                </h4>
                                <ul className="space-y-2">
                                  {reviewResult.formattingIssues.map((item, index) => (
                                    <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed font-light">
                                      <ChevronRight className="w-4 h-4 text-amber-500/70 shrink-0 mt-0.5" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Grammar Critiques */}
                            {reviewResult.grammarSuggestions && reviewResult.grammarSuggestions.length > 0 && (
                              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/10 to-blue-950/10 border-l-4 border-cyan-500 bg-neutral-900/30 text-left shadow-sm">
                                <h4 className="font-semibold text-cyan-400 flex items-center gap-2 mb-3 text-xs uppercase tracking-wider font-mono">
                                  📝 Copywriting & Grammar Suggestions
                                </h4>
                                <ul className="space-y-2">
                                  {reviewResult.grammarSuggestions.map((item, index) => (
                                    <li key={index} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed font-light">
                                      <ChevronRight className="w-4 h-4 text-cyan-500/70 shrink-0 mt-0.5" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        /* ================ PREVIEW & LIVE MODIFIER SUB-TAB ================ */
                        <motion.div 
                           key="preview-view"
                           initial={{ opacity: 0, y: 15 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -15 }}
                           className="space-y-6 text-left"
                        >
                          <div className="prose prose-invert max-w-none text-gray-300 p-5 border border-purple-500/20 rounded-2xl bg-purple-950/5 shadow-inner min-h-[350px]">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                              <span className="text-[10px] font-bold text-purple-400 uppercase font-mono tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                                Interactive AI-Optimized Resume Preview
                              </span>
                            </div>
                            <ReactMarkdown>{improvedResume || "# Optimized Resume Draft\n\nGenerate a draft by clicking Rewrite Resume or apply updates below."}</ReactMarkdown>
                          </div>
                        </motion.div>
                      )
                    ) : (
                      /* ================ EMPTY STATE ================ */
                      <motion.div 
                         key="empty"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className='h-full flex flex-col justify-center items-center text-center text-gray-500 gap-4 mt-20'
                      >
                         <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center mb-2 border border-white/5 shadow-inner">
                            <FileText className='w-10 h-10 text-gray-600 animate-pulse' />
                         </div>
                         <div>
                           <h3 className="text-lg font-medium text-gray-300">Resume Scoping Canvas</h3>
                           <p className="max-w-xs mt-1 text-sm text-gray-500">Provide resume file text and job targets parameters on the left sidebar to audit ATS index results.</p>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Dynamic Live Chat/Prompt Modifier Input Block */}
              {reviewResult && subTab === 'preview' && (
                <div className="bg-neutral-900/80 px-6 py-4 border-t border-white/10 flex flex-col gap-3">
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-[10px] font-bold text-purple-400 uppercase font-mono tracking-wider flex items-center gap-1">
                      ✨ AI Live Resume Modifier
                    </span>
                    <span className="text-[9px] text-slate-500 italic font-light">
                      Prompt modifications apply live to the preview above instantly
                    </span>
                  </div>
                  <form onSubmit={handleModifyResume} className="flex gap-2">
                    <input
                      type="text"
                      value={updatePrompt}
                      onChange={(e) => setUpdatePrompt(e.target.value)}
                      placeholder="e.g., 'Add a React project built at Google', 'Improve summary', 'Add internship experience'..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 text-xs text-white outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
                      disabled={isUpdating}
                    />
                    <button
                      type="submit"
                      disabled={isUpdating || !updatePrompt.trim()}
                      className="px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl flex items-center gap-1.5 transition duration-300 shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Modify</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
              
              <div className="bg-neutral-900/40 px-6 py-3.5 text-[10px] font-light text-slate-500 border-t border-white/5 flex items-center gap-2 justify-center shrink-0">
                <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
                Double check ATS matching report tabs to analyze missing keywords and strategic suggestions.
              </div>
            </div>
          </motion.div>
        ) : (
          // ================= TAB 2: AI RESUME BUILDER =================
          <motion.div 
            key="build-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className='flex flex-col lg:flex-row items-start gap-8'
          >
            {/* Input Form Card */}
            <div className='w-full lg:w-[40%] glass-card p-6 border border-white/10 bg-neutral-950/80 text-white rounded-2xl shadow-xl'>
              <form onSubmit={handleGenerateResume} className="space-y-5">
                <div className='flex items-center justify-between mb-4 border-b border-white/10 pb-4'>
                  <h2 className='text-lg font-semibold text-white'>Resume Parameters</h2>
                  <Sparkles className='w-5 h-5 text-purple-400' />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Full Name</label>
                    <input
                      type="text"
                      value={builderForm.name}
                      onChange={(e) => setBuilderForm({ ...builderForm, name: e.target.value })}
                      className="w-full p-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Target Role</label>
                    <input
                      type="text"
                      value={builderForm.jobTitle}
                      onChange={(e) => setBuilderForm({ ...builderForm, jobTitle: e.target.value })}
                      className="w-full p-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white"
                      placeholder="e.g. Senior Node Developer"
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Professional Skills</label>
                  <textarea
                    rows={2}
                    value={builderForm.skills}
                    onChange={(e) => setBuilderForm({ ...builderForm, skills: e.target.value })}
                    className="w-full p-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white resize-none"
                    placeholder="e.g. Node.js, Express, React, PostgreSQL, Docker, AWS, Git"
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Work Experience</label>
                  <textarea
                    rows={3}
                    value={builderForm.experience}
                    onChange={(e) => setBuilderForm({ ...builderForm, experience: e.target.value })}
                    className="w-full p-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white resize-none"
                    placeholder="e.g. Senior Engineer at Tech Corp (2022-Pres): Led migration of monolith to Node microservices. Improved response times by 40%."
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Key Projects</label>
                  <textarea
                    rows={3}
                    value={builderForm.projects}
                    onChange={(e) => setBuilderForm({ ...builderForm, projects: e.target.value })}
                    className="w-full p-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white resize-none"
                    placeholder="e.g. QuickAI: Multi-model AI SaaS suite built with React & Express, integrated Clerk Auth."
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2'>Education</label>
                  <textarea
                    rows={2}
                    value={builderForm.education}
                    onChange={(e) => setBuilderForm({ ...builderForm, education: e.target.value })}
                    className="w-full p-3 outline-none text-xs rounded-xl border border-white/10 bg-black/40 text-white resize-none"
                    placeholder="e.g. BS in Computer Science, State University (2018-2022)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={builderLoading || !builderForm.name.trim()}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md ${
                    builderLoading 
                      ? 'bg-purple-600/70 text-white cursor-not-allowed' 
                      : builderForm.name.trim() !== ''
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white cursor-pointer'
                        : 'bg-neutral-900 border border-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {builderLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating AI Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate AI Resume
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Resume Output */}
            <div className='w-full lg:w-[60%] bg-neutral-950/80 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-[580px] max-h-[800px] text-white'>
              <div className='bg-neutral-900/60 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10'>
                <div className='flex items-center gap-3'>
                  <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-center">
                     <FileText className='w-4 h-4 text-purple-400' />
                  </div>
                  <h2 className='text-lg font-semibold text-white'>AI Generated Resume Preview</h2>
                </div>
                {generatedResume && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => downloadResume(generatedResume, 'ai_resume.md')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Markdown
                    </button>
                    {generatedPdfBase64 && (
                      <button 
                        onClick={() => downloadPdf(generatedPdfBase64, 'ai_resume.pdf')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white px-3 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className='flex-1 overflow-y-auto p-6 bg-black/20 custom-scrollbar'>
                 <AnimatePresence mode="wait">
                    {builderLoading ? (
                      <motion.div 
                         key="loading"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="h-full flex flex-col justify-center items-center gap-4 text-center mt-20"
                      >
                         <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase animate-pulse">Running Neural Executive Copywriting engines...</p>
                      </motion.div>
                    ) : generatedResume ? (
                      <motion.div 
                         key="content"
                         initial={{ opacity: 0, y: 15 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="space-y-6 text-left prose prose-invert max-w-none text-gray-300 p-4 border border-purple-500/20 rounded-2xl bg-purple-950/5 shadow-inner"
                      >
                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                          <span className="text-xs font-bold text-purple-400 uppercase font-mono tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            Premium ATS-Optimized Resume Draft
                          </span>
                        </div>
                        <ReactMarkdown>{generatedResume}</ReactMarkdown>
                      </motion.div>
                    ) : (
                      <motion.div 
                         key="empty"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className='h-full flex flex-col justify-center items-center text-center text-gray-500 gap-4 mt-20'
                      >
                         <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center mb-2 border border-white/5 shadow-inner">
                            <FileText className='w-10 h-10 text-gray-600 animate-pulse' />
                         </div>
                         <div>
                           <h3 className="text-lg font-medium text-gray-300">Resume Builder Canvas</h3>
                           <p className="max-w-xs mt-1 text-sm text-gray-500">Provide details on the left parameters panel to synthesize a customized high-impact executive resume.</p>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
              
              <div className="bg-neutral-900/40 px-6 py-4 text-xs font-light text-slate-500 border-t border-white/5 flex items-center gap-2 justify-center">
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                Resume builder automatically compiles and returns an ATS-optimized typeset PDF.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewResume;

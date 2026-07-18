import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertTriangle, CheckCircle, Sliders, Layers, Activity, 
  FileText, ArrowLeft, BrainCircuit, Maximize2, X, Loader2 
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, Legend 
} from 'recharts';

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function App() {
  // State Management
  const [backendHealthy, setBackendHealthy] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [results, setResults] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Phase 17 Brand New Interactive UI States
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [showQuestionsPanel, setShowQuestionsPanel] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Dynamic Layout Metric Controls (Immersive Sliders)
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 40,
    cultural: 20
  });

  // Check Backend Connection on Load
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/health`);
      if (res.data.status === 'healthy') setBackendHealthy(true);
    } catch {
      setBackendHealthy(false);
    }
  };

  const handleWeightChange = (key, val) => {
    setWeights(prev => ({ ...prev, [key]: parseInt(val) || 0 }));
  };

  const handleFileChange = (e, type) => {
    if (type === 'resumes') {
      setResumes(Array.from(e.target.files));
    } else {
      setJobDescription(e.target.files[0]);
    }
  };

  const executePipelineRanking = async () => {
    if (!resumes.length || !jobDescription) {
      setUploadStatus('❌ Error: Please upload both resumes and a Job Description document.');
      return;
    }

    setIsCompiling(true);
    setUploadStatus('⚙️ Initializing dynamic compilation engines...');
    
    const formData = new FormData();
    resumes.forEach(file => formData.append('resumes', file));
    formData.append('job_description_file', jobDescription);
    formData.append('skills_weight', weights.skills);
    formData.append('experience_weight', weights.experience);
    formData.append('cultural_weight', weights.cultural);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/rank`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
      setUploadStatus('🟢 Matching system analysis execution successfully synced.');
    } catch (err) {
      setUploadStatus('❌ Execution broken. Please check backend network pipelines.');
    } finally {
      setIsCompiling(false);
    }
  };

  // Phase 17 Core Deep Context AI Questions Dispatcher
  const triggerAiQuestionGenerator = async (candidate) => {
    setIsGeneratingQuestions(true);
    setShowQuestionsPanel(true);
    setAiQuestions([]);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/generate-questions`, {
        candidate_name: candidate.name,
        matching_skills: candidate.matching_skills || [],
        missing_skills: candidate.missing_skills || [],
        experience_summary: candidate.position_rationale || "Intermediate production software stack development expert execution framework.",
        skills_weight: weights.skills,
        experience_weight: weights.experience,
        cultural_weight: weights.cultural
      });
      setAiQuestions(response.data.questions || []);
    } catch (err) {
      console.error("AI engine runtime failure:", err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const clearPipelineWorkspace = () => {
    setResumes([]);
    setJobDescription(null);
    setUploadStatus('');
    setResults([]);
    setSelectedCandidate(null);
    setAiQuestions([]);
    setShowQuestionsPanel(false);
    setShowPdfModal(false);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => { input.value = ''; });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Network Status Strip */}
      {!backendHealthy && (
        <div className="bg-rose-600 text-center py-2 text-sm font-semibold tracking-wider animate-pulse shadow-md">
          ⚠️ PIPELINE CRITICAL WARNING: CORE BACKEND DISCONNECTED. RUN BACKEND COMPILATION MATRIX BEFORE OPERATION.
        </div>
      )}

      {/* Main Structural Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-indigo-500 animate-pulse" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Ultimate AI Recruiter Suite</h1>
            <p className="text-xs text-slate-500">Quantum Structural Mapping & Match Framework v17.0</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-950/50 border border-emerald-800 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            AI Parser Core Active
          </span>
        </div>
      </header>

      {/* Main Container Control Flow */}
      <main className="max-w-[1600px] mx-auto p-8">
        {!selectedCandidate ? (
          /* ================= SCREEN A: LEADERBOARD COCKPIT WIDGET ================= */
          <div className="space-y-8">
            {/* Top Row: Dropzones + Control Sliders */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Document Dropzone Matrix */}
              <div className="xl:col-span-2 bg-slate-900/40 border border-slate-900 p-6 rounded-2xl backdrop-blur-sm space-y-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Document Upload Core</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resumes Input Block */}
                  <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition p-6 rounded-xl bg-slate-950/40 group relative">
                    <input type="file" multiple accept=".pdf" onChange={(e) => handleFileChange(e, 'resumes')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-lg bg-indigo-950/50 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">Upload Candidate Resumes</p>
                      <p className="text-xs text-slate-500">Multiple PDF processing arrays supported</p>
                      {resumes.length > 0 && <span className="inline-block mt-2 bg-indigo-550/20 text-indigo-400 text-xs px-2.5 py-1 rounded-md border border-indigo-800">{resumes.length} Files Selected</span>}
                    </div>
                  </div>

                  {/* JD Input Block */}
                  <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 transition p-6 rounded-xl bg-slate-950/40 group relative">
                    <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'jd')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-lg bg-cyan-950/50 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                        <Sliders className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">Target Job Description</p>
                      <p className="text-xs text-slate-500">Single master layout structural target PDF</p>
                      {jobDescription && <span className="inline-block mt-2 bg-cyan-950/50 text-cyan-400 text-xs px-2.5 py-1 rounded-md border border-cyan-800">{jobDescription.name}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Immersive Metric Control Matrix */}
              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl backdrop-blur-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Weighting Bias Grid</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${weights.skills + weights.experience + weights.cultural === 100 ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-rose-950 text-rose-400 border border-rose-900'}`}>
                    Total: {weights.skills + weights.experience + weights.cultural}%
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-400">Core Technical Skills Bias</span>
                      <span className="text-indigo-400 font-bold">{weights.skills}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={weights.skills} onChange={(e) => handleWeightChange('skills', e.target.value)} className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-400">Experience & Seniority Weight</span>
                      <span className="text-cyan-400 font-bold">{weights.experience}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={weights.experience} onChange={(e) => handleWeightChange('experience', e.target.value)} className="w-full accent-cyan-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-400">Cultural & Soft Traits Adaptability</span>
                      <span className="text-purple-400 font-bold">{weights.cultural}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={weights.cultural} onChange={(e) => handleWeightChange('cultural', e.target.value)} className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Control Station */}
            <div className="flex gap-4 items-center">
              <button onClick={executePipelineRanking} disabled={isCompiling} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-medium tracking-wide shadow-lg shadow-indigo-950/50 flex items-center gap-2 disabled:opacity-50 transition-all transform hover:-translate-y-0.5">
                {isCompiling ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Resumes...
                  </>
                ) : 'Run Match Engineering Pipeline'}
              </button>
              <button onClick={clearPipelineWorkspace} className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl font-medium transition">
                Clear Workspace
              </button>
            </div>

            {/* Status Notifications Output */}
            {uploadStatus && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${uploadStatus.includes('❌') ? 'bg-rose-950/30 border-rose-900/50 text-rose-400' : 'bg-slate-900/60 border-indigo-950 text-slate-300'}`}>
                {uploadStatus}
              </div>
            )}

            {/* Leaderboard Array Output Rendering */}
            {results.length > 0 && (
              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Evaluated Matching Standings</h2>
                  <p className="text-xs text-slate-500">Ranking sorted by dynamic mathematical multi-bias algorithm output matrices</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                        <th className="py-3 px-4">Rank No</th>
                        <th className="py-3 px-4">Candidate Identification</th>
                        <th className="py-3 px-4">Global Matrix Score</th>
                        <th className="py-3 px-4">Core Strengths Domain</th>
                        <th className="py-3 px-4 text-right">Action Interface</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-sm">
                      {results.map((candidate, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 group transition">
                          <td className="py-4 px-4 font-mono font-bold text-indigo-400">#{(idx + 1).toString().padStart(2, '0')}</td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-200">{candidate.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{candidate.id}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                                <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: `${candidate.score}%` }} />
                              </div>
                              <span className="font-mono font-bold text-slate-300">{candidate.score}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {candidate.matching_skills.slice(0, 3).map((sk, sIdx) => (
                                <span key={sIdx} className="bg-slate-950 text-slate-400 text-[11px] px-2 py-0.5 rounded border border-slate-800">{sk}</span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button onClick={() => setSelectedCandidate(candidate)} className="px-4 py-1.5 bg-indigo-950/60 hover:bg-indigo-600 border border-indigo-800 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold transition tracking-wide shadow-sm group-hover:scale-105 transform">
                              View Complex Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= SCREEN B: PHASE 17 BRAND NEW HALF-HALF SPLIT SCREEN INTERFACE ================= */
          <div className="space-y-8 animate-fadeIn">
            {/* Immersive High Integrity Profile Title Header */}
            <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-2xl backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Phase 17 Big Text Upgrade */}
                  <h2 className="text-4xl font-extrabold text-slate-100 tracking-tight">{selectedCandidate.name}</h2>
                  <span className="px-3 py-1 bg-indigo-950 text-indigo-400 text-xs font-mono font-bold rounded-md border border-indigo-900">{selectedCandidate.id}</span>
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-400 text-xs font-bold rounded-md border border-cyan-900">Rank Matched #{results.findIndex(c => c.id === selectedCandidate.id) + 1}</span>
                </div>
                {/* Full Integrity Database Synced Parameters */}
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-base text-slate-400 font-medium pt-1">
                  <span>📧 <span className="text-slate-200">{selectedCandidate.email || "not-found@recruiter.ai"}</span></span>
                  <span>📞 <span className="text-slate-200">{selectedCandidate.phone || "+91 XXXXX XXXXX"}</span></span>
                  {selectedCandidate.github && <span>🔗 <a href={selectedCandidate.github} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">GitHub Workspace</a></span>}
                  {selectedCandidate.linkedin && <span>🔗 <a href={selectedCandidate.linkedin} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">LinkedIn Verification</a></span>}
                </div>
              </div>
              
              <div className="bg-slate-950 px-6 py-4 rounded-xl border border-slate-900 text-center min-w-[160px] shadow-inner">
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-0.5">Cumulative Index</div>
                <div className="text-4xl font-black font-mono text-gradient bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{selectedCandidate.score}%</div>
              </div>
            </div>

            {/* Phase 17 Main 50-50 Screen Division Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* LEFT 50% PANEL LAYER: Dynamic Tables & Bio Information */}
              <div className="space-y-8 bg-slate-900/20 border border-slate-900/60 p-6 rounded-2xl">
                
                {/* Section A: Position Rationale */}
                <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-900 space-y-3">
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" /> Position Rationale Analysis
                  </h3>
                  <p className="text-base text-slate-300 leading-relaxed font-normal">
                    {selectedCandidate.position_rationale}
                  </p>
                </div>

                {/* Section B: Matching Skills Table */}
                <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-900 space-y-4">
                  <h3 className="text-base font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Verified Core Stack Match
                  </h3>
                  <div className="overflow-hidden border border-slate-950 rounded-lg">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950 text-slate-400 font-bold text-sm tracking-wide">
                        <tr>
                          <th className="py-2.5 px-4 w-16">Index</th>
                          <th className="py-2.5 px-4">Skill Matrix Dimension</th>
                          <th className="py-2.5 px-4 text-center w-20">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-950 text-base font-medium">
                        {selectedCandidate.matching_skills.map((skill, index) => (
                          <tr key={index} className="hover:bg-slate-950/30 transition">
                            <td className="py-3 px-4 text-slate-500 font-mono">{(index + 1).toString().padStart(2, '0')}</td>
                            <td className="py-3 px-4 text-slate-200">{skill}</td>
                            <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section C: Missing Skills Table */}
                <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-900 space-y-4">
                  <h3 className="text-base font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Missing Structural Skill Gaps
                  </h3>
                  <div className="overflow-hidden border border-slate-950 rounded-lg">
                    <table className="w-full text-left">
                      <thead className="bg-slate-950 text-slate-400 font-bold text-sm tracking-wide">
                        <tr>
                          <th className="py-2.5 px-4 w-16">Index</th>
                          <th className="py-2.5 px-4">Identified Pipeline Gap</th>
                          <th className="py-2.5 px-4 text-center w-20">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-950 text-base font-medium">
                        {selectedCandidate.missing_skills.length > 0 ? (
                          selectedCandidate.missing_skills.map((skill, index) => (
                            <tr key={index} className="hover:bg-slate-950/30 transition">
                              <td className="py-3 px-4 text-slate-500 font-mono">{(index + 1).toString().padStart(2, '0')}</td>
                              <td className="py-3 px-4 text-rose-300/90">{skill}</td>
                              <td className="py-3 px-4 text-center text-rose-400 font-bold">✗</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="py-4 px-4 text-center text-slate-500 font-mono text-sm">No conceptual missing tracking nodes detected.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* RIGHT 50% PANEL LAYER: Huge High-Fidelity Radar Graph Representation */}
              <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-2xl sticky top-28 space-y-6">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-400">Requirement Curve vs Candidate Capability</h3>
                  <p className="text-xs text-slate-500">Dual-plot geometric array distribution analysis mapping metrics</p>
                </div>
                
                {/* Phase 17 Massive Radar Mapping Container */}
                <div className="w-full h-[520px] bg-slate-950/50 rounded-xl border border-slate-900 p-2 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" radius="80%" data={selectedCandidate.radar_analytics}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} axisLine={false} />
                      <Radar name="Candidate Evaluation Profile" dataKey="candidate_score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                      <Radar name="JD Target Demand Profile" dataKey="jd_demand" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} strokeDasharray="4 4" />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* ================= PHASE 17 UNIFIED COCKPIT CONTROL FOOTER ================= */}
            <footer className="bg-slate-950 border border-slate-900 p-4 rounded-2xl flex justify-between items-center gap-4 shadow-xl z-30 sticky bottom-4 backdrop-blur-md">
              {/* Left Action Elements */}
              <div className="flex items-center gap-3">
                <button onClick={() => triggerAiQuestionGenerator(selectedCandidate)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold tracking-wide flex items-center gap-2 transition shadow-lg shadow-indigo-950/50">
                  <BrainCircuit className="w-4 h-4" />
                  Generate Interview Questions 🪄
                </button>
              </div>

              {/* Right System Command Control Elements */}
              <div className="flex items-center gap-3">
                <button onClick={() => setShowPdfModal(true)} className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold tracking-wide flex items-center gap-2 transition">
                  <Maximize2 className="w-4 h-4" />
                  View PDF 📄
                </button>
                <button onClick={() => setSelectedCandidate(null)} className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold tracking-wide flex items-center gap-2 transition">
                  <ArrowLeft className="w-4 h-4" />
                  Return to Leaderboard ↩️
                </button>
              </div>
            </footer>
          </div>
        )}
      </main>

      {/* ================= PHASE 17 COMPONENT MODE A: FULL SCREEN IMMERSIVE PDF OVERLAY LIGHTBOX ================= */}
      {showPdfModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col animate-fadeIn">
          {/* Header Controls */}
          <div className="bg-slate-950/90 border-b border-slate-900 p-4 flex justify-between items-center px-8">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span className="font-semibold text-sm tracking-wide text-slate-200">PDF Sandbox Framework Vault // {selectedCandidate.name}</span>
            </div>
            <button onClick={() => setShowPdfModal(false)} className="p-2 bg-slate-900 border border-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 rounded-lg transition shadow-md">
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Native High-Performance PDF Frame Layer */}
          <div className="flex-1 w-full bg-slate-950 p-6 flex justify-center items-center">
            <object data={`${BACKEND_URL}/api/resume/${selectedCandidate.id}`} type="application/pdf" className="w-full h-full max-w-[1200px] border border-slate-900 rounded-xl shadow-2xl bg-slate-900">
              <iframe src={`${BACKEND_URL}/api/resume/${selectedCandidate.id}`} title="PDF Sandbox Fallback" className="w-full h-full rounded-xl" />
            </object>
          </div>
        </div>
      )}

      {/* ================= PHASE 17 COMPONENT MODE B: DEEP CONTEXT INTERVIEW QUESTIONS DYNAMIC SLIDE PANEL ================= */}
      {showQuestionsPanel && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
          {/* Background overlay click-off handler */}
          <div className="absolute inset-0 -z-10" onClick={() => setShowQuestionsPanel(false)} />
          
          {/* Main sliding panel core with glassmorphism architecture */}
          <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-900 h-full shadow-2xl p-8 flex flex-col justify-between overflow-hidden relative">
            
            {/* Upper Frame Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h3 className="text-lg font-bold">Deep Context AI Copilot</h3>
                    <p className="text-xs text-slate-500">Targeted Scenario-Based Interview Calibration</p>
                  </div>
                </div>
                <button onClick={() => setShowQuestionsPanel(false)} className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic Loading Overlay State */}
              {isGeneratingQuestions ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-wide text-slate-200">Running Deep Structural Analysis Pipeline...</p>
                    <p className="text-xs text-slate-500 max-w-sm">Gemini is mapping candidate experience levels, active project scope, and job missing gaps targets.</p>
                  </div>
                </div>
              ) : (
                /* Output Scroll Container Matrix */
                <div className="overflow-y-auto max-h-[75vh] pr-2 space-y-6 scrollbar-thin">
                  {aiQuestions.map((qNode, qIdx) => (
                    <div key={qIdx} className="bg-slate-900/40 border border-slate-900/80 p-5 rounded-xl space-y-3 hover:border-indigo-900/50 transition">
                      <div className="flex gap-3 items-start">
                        <span className="w-6 h-6 rounded bg-indigo-950 border border-indigo-800 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {(qIdx + 1)}
                        </span>
                        <p className="text-base text-slate-200 font-medium leading-relaxed">{qNode.question}</p>
                      </div>
                      
                      {/* Talking Guidelines Pointer Context */}
                      <div className="bg-slate-950/80 border border-slate-900/60 p-3.5 rounded-lg space-y-1.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruiter Evaluation Gauge:</div>
                        <p className="text-sm text-slate-400 font-normal leading-relaxed">{qNode.talking_points}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Status Block */}
            <div className="border-t border-slate-900 pt-4 flex justify-end">
              <button onClick={() => setShowQuestionsPanel(false)} className="px-5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 font-medium text-sm rounded-lg transition border border-slate-800">
                Close Copilot Vault
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
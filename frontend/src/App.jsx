// frontend/src/App.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './context/AppContext';
import { aiRecruiterAPI } from './services/api';
import { 
  Briefcase, 
  Sliders, 
  Sun, 
  Moon, 
  UploadCloud, 
  Search, 
  FileText, 
  Download, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  CheckSquare, 
  Square,
  Cpu,
  Layers,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';

function App() {
  const { 
    theme, 
    currentScreen, 
    setCurrentScreen, 
    weights, 
    toggleGlobalTheme, 
    updateWeightParameter 
  } = useContext(AppContext);

  const [resumeBatch, setResumeBatch] = useState([]);
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorUI, setErrorUI] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState({ total_matches: 0 });

  // Detailed analysis view states configuration
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [localNotes, setLocalNotes] = useState("");
  const [isFlagged, setIsFlagged] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" or "metrics" or "questions"

  const refreshDataHub = () => {
    aiRecruiterAPI.fetchHistory(weights).then(data => setHistory(Array.isArray(data) ? data : []));
    aiRecruiterAPI.fetchAnalytics().then(data => data && setAnalytics(data));
  };

  useEffect(() => {
    refreshDataHub();
  }, [weights]);

  useEffect(() => {
    refreshDataHub();
  }, []);

  const handleBatchProcessingTrigger = async () => {
    setErrorUI(null);
    if (resumeBatch.length === 0 || !jobFile) {
      setErrorUI("Please select valid candidate profiles and destination operational requirements context.");
      return;
    }
    setLoading(true);
    try {
      await aiRecruiterAPI.submitBatchMatch(resumeBatch, jobFile);
      setResumeBatch([]);
      alert("PDF/TXT pipeline targets safely sent to Gemini worker stream threads!");
      setTimeout(() => { refreshDataHub(); }, 2500);
    } catch {
      setErrorUI("Connection Interrupt: Failed to map records safely across local systems nodes.");
    } finally {
      setLoading(false);
    }
  };

  const handleWipeHistoryTrigger = async () => {
    if (!window.confirm("Confirm radical wipe of stored candidate index streams?")) return;
    try {
      await aiRecruiterAPI.clearHistory();
      setSelectedInsight(null);
      refreshDataHub();
    } catch {
      alert("Purge database operational transaction aborted.");
    }
  };

  const handleRowClickEngine = async (candidateName) => {
    setInsightLoading(true);
    setActiveTab("overview"); // Default tab view initialization route
    try {
      const data = await aiRecruiterAPI.fetchCandidateInsights(candidateName, weights);
      setSelectedInsight(data);
      setLocalNotes(data.notes || "");
      setIsFlagged(data.is_flagged === 1);
    } catch {
      alert("Failed parsing remote structured JSON records assets clusters.");
    } finally {
      setInsightLoading(false);
    }
  };

  const handleSaveStatusState = async () => {
    if (!selectedInsight) return;
    try {
      await aiRecruiterAPI.updateCandidateStatus(selectedInsight.candidate, localNotes, isFlagged);
      refreshDataHub();
      setSelectedInsight(prev => ({ ...prev, notes: localNotes, is_flagged: isFlagged ? 1 : 0 }));
      alert("Audit evaluation indices synced into permanent server tracking state storage.");
    } catch {
      alert("Error logging system update sequence parameters.");
    }
  };

  const processedHistory = history.filter(item =>
    (item?.candidate_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWeightBubble = weights.w_sem + weights.w_exp + weights.w_ski + weights.w_proj + weights.w_beh;

  const containerClass = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900';
  const sidebarClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200';
  const elementCardClass = theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900';
  const inputControlClass = theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900';
  const tableHeaderClass = theme === 'dark' ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-200 text-slate-600 border-slate-300';
  const tableRowClass = theme === 'dark' ? 'hover:bg-slate-800/50 border-slate-800/60' : 'hover:bg-slate-100/70 border-slate-200';

  return (
    <div className={`flex h-screen w-screen overflow-hidden text-base ${containerClass}`}>
      
      {/* 🧭 NAVIGATION SIDEBAR DRAWER CONTROLS */}
      <div className={`w-80 flex flex-col justify-between border-r p-7 ${sidebarClass}`}>
        <div className="space-y-10">
          <div>
            <div className="flex items-center space-x-3">
              <Cpu className="text-blue-950 dark:text-blue-400 animate-spin" size={24} />
              <h2 className="text-2xl font-black tracking-tight text-blue-950 dark:text-blue-400">GEMINI ATS</h2>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-2">Deep Intelligence Layer v13</p>
          </div>

          <nav className="space-y-3">
            <button onClick={() => setCurrentScreen('workspace')} className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl font-bold transition-all text-lg ${currentScreen === 'workspace' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}>
              <Briefcase size={22} />
              <span>Workspace Matrix</span>
            </button>
            <button onClick={() => setCurrentScreen('parameters')} className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl font-bold transition-all text-lg ${currentScreen === 'parameters' ? 'bg-blue-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}>
              <Sliders size={22} />
              <span>Immersive Sliders</span>
            </button>
          </nav>
        </div>

        <div>
          <button onClick={toggleGlobalTheme} className="w-full flex items-center justify-between px-5 py-4 rounded-xl border font-bold text-sm bg-transparent border-slate-300 dark:border-slate-700 hover:bg-slate-200/40 dark:hover:bg-slate-800 transition-all">
            <span className="text-slate-500 dark:text-slate-400">Dynamic UI Theme:</span>
            <div className="flex items-center space-x-2 text-blue-950 dark:text-amber-400">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="uppercase text-xs font-mono font-black">{theme}</span>
            </div>
          </button>
        </div>
      </div>

      {/* 🖥️ PRIMARY DATA ROUTER CORE GRID SYSTEM DISPLAY WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-y-auto p-8 md:p-12 space-y-10">
        
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {currentScreen === 'workspace' ? "Neural Pipeline Hub" : "Dynamic Weight Calibrations"}
            </h1>
            <p className="text-slate-400 text-base mt-1">
              {currentScreen === 'workspace' ? "Automated Gemini PDF deep structural scanning tracking layout active" : "Adjust algebraic equation parameters indices values"}
            </p>
          </div>
          <div className={`px-6 py-4 rounded-2xl border text-right shadow-xs ${elementCardClass}`}>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">Total Resumes Scanned</span>
            <span className="text-3xl font-black tracking-tight text-blue-950 dark:text-blue-400">{analytics?.total_matches || 0} Nodes</span>
          </div>
        </div>

        {errorUI && (
          <div className="bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 p-5 rounded-xl font-mono text-sm flex items-center space-x-3">
            <AlertTriangle size={20} />
            <span>{errorUI}</span>
          </div>
        )}

        {/* WORKSPACE CONTENT SCREEN VIEW SLOTS LAYOUT PANEL */}
        {currentScreen === 'workspace' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer block hover:border-blue-900 transition-all ${elementCardClass}`}>
                <input type="file" accept=".pdf,.txt" multiple className="hidden" onChange={(e) => setResumeBatch(Array.from(e.target.files))} />
                <UploadCloud className="mx-auto text-slate-400 mb-3" size={36} />
                <span className="block font-bold text-lg text-slate-700 dark:text-slate-300">Stage Documents (PDF Supported)</span>
                <span className="block text-sm text-slate-400 mt-1">{resumeBatch.length > 0 ? `📁 {resumeBatch.length} Resumes Staged For Extraction` : "Accepts native binary document structures"}</span>
              </label>

              <label className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer block hover:border-blue-900 transition-all ${elementCardClass}`}>
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => setJobFile(e.target.files[0])} />
                <FileText className="mx-auto text-slate-400 mb-3" size={36} />
                <span className="block font-bold text-lg text-slate-700 dark:text-slate-300">Stage Job Target Specifications</span>
                <span className="block text-sm text-slate-400 mt-1">{jobFile ? `📄 {jobFile.name}` : "Upload targeting requirements structural template"}</span>
              </label>
            </div>

            <div className={`p-8 rounded-2xl border shadow-sm ${elementCardClass}`}>
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Search size={18} /></span>
                  <input type="text" placeholder="Search target profiles names..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:border-blue-950 ${inputControlClass}`} />
                </div>
                
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <a href={aiRecruiterAPI.getExportUrl()} download className="flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl text-sm transition-all shadow-xs">
                    <Download size={18} />
                    <span>Export CSV Summary</span>
                  </a>
                  <button onClick={handleWipeHistoryTrigger} className="flex items-center justify-center space-x-2 bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-600 hover:text-white font-bold px-4 py-3 rounded-xl text-sm transition-all">
                    <Trash2 size={18} />
                    <span>Clear Relational History</span>
                  </button>
                  <button onClick={handleBatchProcessingTrigger} disabled={loading} className="bg-blue-950 hover:bg-blue-900 text-white font-black px-6 py-3 rounded-xl text-sm transition-all shadow-md ml-auto">
                    {loading ? "Parsing PDF via Gemini..." : "Compile Alignment Ranks"}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className={`font-mono text-xs uppercase tracking-wider ${tableHeaderClass}`}>
                    <tr>
                      <th className="py-4 px-5 text-center w-20">Rank</th>
                      <th className="py-4 px-5 w-32">Audit State</th>
                      <th className="py-4 px-5">Candidate Extraction Node</th>
                      <th className="py-4 px-5">Target Mapping Core Link</th>
                      <th className="py-4 px-5 text-center w-40">Weighted Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40">
                    {processedHistory.map((row, idx) => (
                      <tr key={idx} onClick={() => handleRowClickEngine(row.candidate_name)} className={`cursor-pointer transition-all border-l-4 border-transparent hover:border-blue-950 ${tableRowClass}`}>
                        <td className="py-4 px-5 text-center font-black text-blue-950 dark:text-blue-400 text-lg">#{idx + 1}</td>
                        <td className="py-4 px-5">
                          {row.is_flagged === 1 ? (
                            <span className="flex items-center text-red-600 font-bold bg-red-500/10 border border-red-500/20 text-[11px] px-2.5 py-0.5 rounded-md w-fit"><AlertTriangle size={12} className="mr-1" /> AUDIT</span>
                          ) : <span className="text-slate-400 font-mono">--</span>}
                        </td>
                        <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200 text-lg">👤 {row.candidate_name}</td>
                        <td className="py-4 px-5 text-slate-500 dark:text-slate-400 font-mono text-xs">{row.job_filename}</td>
                        <td className="py-4 px-5 text-center">
                          <span className="bg-blue-950 text-white px-3 py-1.5 rounded-lg font-black text-sm">{(row.score * 100).toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                    {processedHistory.length === 0 && (
                      <tr><td colSpan="5" className="text-center p-12 text-slate-400 font-medium">No candidate matrices logged within memory clusters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* IMMERSIVE CONFIGURATION SLIDERS PANEL ELEMENT LAYOUT CONTROLS */}
        {currentScreen === 'parameters' && (
          <div className={`p-10 rounded-2xl border shadow-md space-y-8 ${elementCardClass}`}>
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Parametric Calibration Board</h3>
                <p className="text-slate-400 text-sm mt-0.5">Control individual weights mapping factors definitions instantly</p>
              </div>
              <div className={`px-4 py-2 rounded-xl font-mono text-base font-black border ${totalWeightBubble === 100 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                Sum Matrix Check: {totalWeightBubble}% / 100%
              </div>
            </div>

            <div className="space-y-8 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span>Semantic Integration Weights (Vector Distance Engine)</span>
                  <span className="text-blue-950 font-mono text-xl">{weights.w_sem}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_sem} onChange={(e) => updateWeightParameter('w_sem', e.target.value)} className="w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span>Corporate Experience Seniority Fit Metrics</span>
                  <span className="text-purple-700 font-mono text-xl">{weights.w_exp}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_exp} onChange={(e) => updateWeightParameter('w_exp', e.target.value)} className="w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span>Hard Skills Tokens Verification Scope Check</span>
                  <span className="text-amber-600 font-mono text-xl">{weights.w_ski}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_ski} onChange={(e) => updateWeightParameter('w_ski', e.target.value)} className="w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span>Project Vertical Domain Structural Alignments</span>
                  <span className="text-cyan-600 font-mono text-xl">{weights.w_proj}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_proj} onChange={(e) => updateWeightParameter('w_proj', e.target.value)} className="w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span>Recruiter Feedback Loop & Dormancy Exponential Decay</span>
                  <span className="text-pink-600 font-mono text-xl">{weights.w_beh}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_beh} onChange={(e) => updateWeightParameter('w_beh', e.target.value)} className="w-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 📊 INTERACTIVE CANDIDATE ANALYSIS DASHBOARD PANEL DRAWER */}
      {insightLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-slate-900 text-blue-400 font-mono p-6 border border-slate-800 rounded-2xl flex items-center space-x-3 text-sm tracking-wide">
            <span className="animate-pulse">🔄 Activating Gemini Parsing Intelligence Framework Streams...</span>
          </div>
        </div>
      )}

      {selectedInsight && (
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[600px] border-l shadow-2xl p-8 z-50 overflow-y-auto flex flex-col justify-between ${sidebarClass}`}>
          <div>
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5 mb-5">
              <div>
                <span className="text-xs font-bold bg-blue-950 text-white px-3 py-1 rounded-md uppercase tracking-wider font-mono">Gemini Structural Extraction View</span>
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2">👤 {selectedInsight.candidate}</h3>
              </div>
              <button onClick={() => { setSelectedInsight(null); refreshDataHub(); }} className="text-sm font-mono font-bold border px-4 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">[ ESC ]</button>
            </div>

            {/* 📑 TAB ACTION ROUTERS CONTROL DOCK BAR ELEMENT STRIP */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2 text-sm font-bold">
              <button onClick={() => setActiveTab("overview")} className={`pb-3 px-3 border-b-2 transition-all ${activeTab === 'overview' ? 'border-blue-950 text-blue-950 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-slate-400'}`}>Executive Summary</button>
              <button onClick={() => setActiveTab("metrics")} className={`pb-3 px-3 border-b-2 transition-all ${activeTab === 'metrics' ? 'border-blue-950 text-blue-950 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-slate-400'}`}>5-Slider Metrics Breakdown</button>
              <button onClick={() => setActiveTab("questions")} className={`pb-3 px-3 border-b-2 transition-all ${activeTab === 'questions' ? 'border-blue-950 text-blue-950 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-slate-400'}`}>Generated Questions</button>
            </div>

            {/* TAB CONTAINER CONTENT SELECTION METRICS BLOCK AREA */}
            <div className="space-y-6">
              
              {/* TAB CONTAINER SLOT 1: SUMMARY OVERVIEW BLOCKS LAYOUT */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${elementCardClass}`}>
                      <span className="text-slate-400 block text-xs font-mono uppercase mb-1">Status Recommendation</span>
                      <span className={`font-black text-xs px-3 py-1 rounded-md inline-block ${selectedInsight.status === 'SHORTLIST' ? 'bg-emerald-500/10 text-emerald-600' : selectedInsight.status === 'REJECT' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>{selectedInsight.status}</span>
                    </div>
                    <div className={`p-4 rounded-xl border ${elementCardClass}`}>
                      <span className="text-slate-400 block text-xs font-mono uppercase mb-1">Total Compound Index Score</span>
                      <span className="font-black text-emerald-600 text-lg">{(selectedInsight.calculated_score * 100).toFixed(1)}% Match</span>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border leading-relaxed font-medium italic ${elementCardClass}`}>
                    <span className="text-slate-400 block text-xs font-mono uppercase not-italic mb-2">Executive Abstract Context</span>
                    "{selectedInsight.pitch}"
                  </div>

                  <div className="space-y-3">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                      <span className="text-emerald-600 font-bold block mb-1 text-sm uppercase tracking-wider font-mono">🟢 Extracted Core Strengths</span>
                      <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-300 font-medium">{selectedInsight.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                      <span className="text-amber-600 font-bold block mb-1 text-sm uppercase tracking-wider font-mono">🟡 Identified Technical Deficits/Gaps</span>
                      <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-300 font-medium">{selectedInsight.gaps?.map((g, i) => <li key={i}>{g}</li>)}</ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTAINER SLOT 2: 5-SLIDER METRICS BREAKDOWN VIEW WITH GRAPHICAL BARS */}
              {activeTab === "metrics" && (
                <div className={`p-6 rounded-2xl border space-y-6 ${elementCardClass}`}>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">Individual Component Alignment Logs</h4>
                  
                  <div className="space-y-4">
                    {/* Visual Progress Bar Item A */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-400"><span>Semantic Context Core Match:</span><span className="font-bold text-blue-950 dark:text-blue-400">{(selectedInsight.breakdown?.semantic_score * 100).toFixed(0)}%</span></div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-blue-900 h-full rounded-full" style={{ width: `${selectedInsight.breakdown?.semantic_score * 100}%` }} /></div>
                    </div>

                    {/* Visual Progress Bar Item B */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-400"><span>Seniority Experience Fit Index:</span><span className="font-bold text-purple-600">{(selectedInsight.breakdown?.experience_score * 100).toFixed(0)}%</span></div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-purple-600 h-full rounded-full" style={{ width: `${selectedInsight.breakdown?.experience_score * 100}%` }} /></div>
                    </div>

                    {/* Visual Progress Bar Item C */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-400"><span>Hard Skills Exact Verification Checkage:</span><span className="font-bold text-amber-500">{(selectedInsight.breakdown?.skills_score * 100).toFixed(0)}%</span></div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-full rounded-full" style={{ width: `${selectedInsight.breakdown?.skills_score * 100}%` }} /></div>
                    </div>

                    {/* Visual Progress Bar Item D */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-400"><span>Project Domain Vertical Mapping Alignment:</span><span className="font-bold text-cyan-600">{(selectedInsight.breakdown?.domain_score * 100).toFixed(0)}%</span></div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-cyan-600 h-full rounded-full" style={{ width: `${selectedInsight.breakdown?.domain_score * 100}%` }} /></div>
                    </div>

                    {/* Visual Progress Bar Item E */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-400"><span>Behavioral Login Signal Response Decay:</span><span className="font-bold text-pink-600">{(selectedInsight.breakdown?.behavioral_score * 100).toFixed(0)}%</span></div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-pink-600 h-full rounded-full" style={{ width: `${selectedInsight.breakdown?.behavioral_score * 100}%` }} /></div>
                    </div>
                  </div>

                  <div className="bg-blue-950/10 border border-blue-900/30 p-4 rounded-xl text-xs text-blue-900 dark:text-blue-300 font-medium leading-relaxed">
                    <strong>📦 Calibration Note:</strong> {selectedInsight.pool_benchmark}
                  </div>
                </div>
              )}

              {/* TAB CONTAINER SLOT 3: GENERATED QUESTIONS VIEW LAYOUT */}
              {activeTab === "questions" && (
                <div className={`p-5 rounded-2xl border space-y-4 ${elementCardClass}`}>
                  <span className="text-blue-950 dark:text-blue-400 font-bold block uppercase text-xs font-mono tracking-wider">🤖 Cloud Gemini Target Screening Interview Questions</span>
                  <ol className="space-y-4 list-decimal list-inside text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {selectedInsight.interview_questions?.map((q, i) => <li key={i} className="pl-1 border-b border-slate-200 dark:border-slate-800 pb-2 last:border-0">"{q}"</li>)}
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* AUDITOR INTERFACE REVIEW ACTION BUTTONS ZONE CONTAINER LAYER */}
          <div className={`p-5 rounded-xl border space-y-4 mt-6 ${elementCardClass}`}>
            <label className="flex items-center space-x-3 cursor-pointer text-slate-700 dark:text-slate-300">
              <div onClick={() => setIsFlagged(!isFlagged)} className="text-blue-950 dark:text-blue-400">
                {isFlagged ? <CheckSquare size={22} /> : <Square size={22} />}
              </div>
              <span className="text-sm font-bold">Flag this candidate record for technical committee review</span>
            </label>
            <textarea value={localNotes} onChange={(e) => setLocalNotes(e.target.value)} placeholder="Type localized reviewer notes here..." className={`w-full h-20 rounded-xl border p-3 text-sm focus:outline-none focus:border-blue-950 font-medium ${inputControlClass}`} />
            <button onClick={handleSaveStatusState} className="w-full bg-blue-950 hover:bg-blue-900 text-white font-black py-3 rounded-xl text-sm transition-all shadow-md">Sync Evaluation State Decision</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
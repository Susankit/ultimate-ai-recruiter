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
  HelpCircle,
  TrendingUp
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

  const [selectedInsight, setSelectedInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [localNotes, setLocalNotes] = useState("");
  const [isFlagged, setIsFlagged] = useState(false);

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
      setErrorUI("Please stage both candidate logs and matching specifications profile sheet.");
      return;
    }
    setLoading(true);
    try {
      await aiRecruiterAPI.submitBatchMatch(resumeBatch, jobFile);
      setResumeBatch([]);
      alert("Batch dispatched into background async vector pools!");
      setTimeout(() => { refreshDataHub(); }, 2000);
    } catch {
      setErrorUI("Network Fault: Connection termination on internal local endpoints pipeline.");
    } finally {
      setLoading(false);
    }
  };

  const handleWipeHistoryTrigger = async () => {
    if (!window.confirm("Confirm initialization wipe of old records history ledger?")) return;
    try {
      await aiRecruiterAPI.clearHistory();
      setSelectedInsight(null);
      refreshDataHub();
    } catch {
      alert("Purge runtime failure encountered.");
    }
  };

  const handleRowClickEngine = async (candidateName) => {
    setInsightLoading(true);
    try {
      const data = await aiRecruiterAPI.fetchCandidateInsights(candidateName, weights);
      setSelectedInsight(data);
      setLocalNotes(data.notes || "");
      setIsFlagged(data.is_flagged === 1);
    } catch {
      alert("Error linking profile diagnostic records context blocks.");
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
      alert("Audit decision successfully synchronized with backend database.");
    } catch {
      alert("Error saving record configurations.");
    }
  };

  const processedHistory = history.filter(item =>
    (item?.candidate_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWeightBubble = weights.w_sem + weights.w_exp + weights.w_ski + weights.w_proj + weights.w_beh;

  // Thematic Dynamic System Classes Resolver Matrix mapping variables
  const containerClass = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900';
  const sidebarClass = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200';
  const elementCardClass = theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900';
  const inputControlClass = theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900';
  const tableHeaderClass = theme === 'dark' ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-200 text-slate-600 border-slate-300';
  const tableRowClass = theme === 'dark' ? 'hover:bg-slate-800/50 border-slate-800/60' : 'hover:bg-slate-100/70 border-slate-200';

  return (
    <div className={`flex h-screen w-screen overflow-hidden text-base ${containerClass}`}>
      
      {/* 🧭 LEFT SIDEBAR INTERFACE: Clean Single Action Navigation Controls Router */}
      <div className={`w-80 flex flex-col justify-between border-r p-7 ${sidebarClass}`}>
        <div className="space-y-10">
          <div>
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 bg-blue-900 rounded-full animate-pulse" />
              <h2 className="text-2xl font-black tracking-tight text-blue-900 dark:text-blue-400">MATRIX ATS</h2>
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-2">Enterprise Edition v12</p>
          </div>

          {/* Navigation Action Screen State Slots Buttons */}
          <nav className="space-y-3">
            <button 
              onClick={() => setCurrentScreen('workspace')}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl font-bold transition-all text-lg ${currentScreen === 'workspace' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
            >
              <Briefcase size={22} />
              <span>Pipeline Work</span>
            </button>
            
            <button 
              onClick={() => setCurrentScreen('parameters')}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl font-bold transition-all text-lg ${currentScreen === 'parameters' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
            >
              <Sliders size={22} />
              <span>Criteria Config</span>
            </button>
          </nav>
        </div>

        {/* Global Functional Theme Toggle Component */}
        <div className="space-y-4">
          <button 
            onClick={toggleGlobalTheme} 
            className="w-full flex items-center justify-between px-5 py-4 rounded-xl border font-bold text-sm bg-transparent border-slate-300 dark:border-slate-700 hover:bg-slate-200/40 dark:hover:bg-slate-800 transition-all"
          >
            <span className="text-slate-500 dark:text-slate-400">Visual Interface State:</span>
            <div className="flex items-center space-x-2 text-blue-900 dark:text-amber-400">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="uppercase text-xs font-mono font-black">{theme}</span>
            </div>
          </button>
        </div>
      </div>

      {/* 🖥️ DYNAMIC WORKSPACE COMPONENT PANEL SHEET */}
      <div className="flex-1 flex flex-col overflow-y-auto p-8 md:p-12 space-y-10">
        
        {/* Global Minimal Metrics Header Bar Block */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {currentScreen === 'workspace' ? "Talent Workspace Matrix" : "Recruitment Weight Configuration"}
            </h1>
            <p className="text-slate-400 text-base mt-1">
              {currentScreen === 'workspace' ? "Execute real-time pipeline index transformations" : "Balance localized scoring metrics equations logic"}
            </p>
          </div>

          {/* Focused Metric Display Block (Only active variable retained) */}
          <div className={`px-6 py-4 rounded-2xl border text-right shadow-xs ${elementCardClass}`}>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">Total Resumes Scanned</span>
            <span className="text-3xl font-black tracking-tight text-blue-900 dark:text-blue-400">{analytics?.total_matches || 0} Assets</span>
          </div>
        </div>

        {errorUI && (
          <div className="bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 p-5 rounded-xl font-mono text-sm flex items-center space-x-3">
            <AlertTriangle size={20} />
            <span>{errorUI}</span>
          </div>
        )}

        {/* 1. SCREEN OPTION A: REALTIME WORKSPACE FLOW PIPELINE */}
        {currentScreen === 'workspace' && (
          <div className="space-y-10">
            {/* Structured File Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer block hover:border-blue-700 transition-all ${elementCardClass}`}>
                <input type="file" accept=".pdf,.txt" multiple className="hidden" onChange={(e) => setResumeBatch(Array.from(e.target.files))} />
                <UploadCloud className="mx-auto text-slate-400 mb-3" size={36} />
                <span className="block font-bold text-lg text-slate-700 dark:text-slate-300">Stage Candidate Resumes</span>
                <span className="block text-sm text-slate-400 mt-1">{resumeBatch.length > 0 ? `🔥 ${resumeBatch.length} Document Vectors Buffered` : "Accepts raw bulk data streams"}</span>
              </label>

              <label className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer block hover:border-blue-700 transition-all ${elementCardClass}`}>
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => setJobFile(e.target.files[0])} />
                <FileText className="mx-auto text-slate-400 mb-3" size={36} />
                <span className="block font-bold text-lg text-slate-700 dark:text-slate-300">Stage Job Description</span>
                <span className="block text-sm text-slate-400 mt-1">{jobFile ? `📄 ${jobFile.name}` : "Upload targeting requirements sheet"}</span>
              </label>
            </div>

            {/* Ingestion Table Matrix Segment Wrapper */}
            <div className={`p-8 rounded-2xl border shadow-sm ${elementCardClass}`}>
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div className="relative w-full sm:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Search size={18} /></span>
                  <input type="text" placeholder="Search processed names..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:border-blue-900 ${inputControlClass}`} />
                </div>
                
                {/* Relocated Utility Operations Command Strip Block */}
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <a href={aiRecruiterAPI.getExportUrl()} download className="flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl text-sm transition-all shadow-xs">
                    <Download size={18} />
                    <span>Export CSV</span>
                  </a>
                  <button onClick={handleWipeHistoryTrigger} className="flex items-center justify-center space-x-2 bg-red-950/20 text-red-600 border border-red-500/20 hover:bg-red-600 hover:text-white font-bold px-4 py-3 rounded-xl text-sm transition-all">
                    <Trash2 size={18} />
                    <span>Purge Ledger</span>
                  </button>
                  <button onClick={handleBatchProcessingTrigger} disabled={loading} className="bg-blue-900 hover:bg-blue-800 text-white font-black px-6 py-3 rounded-xl text-sm transition-all shadow-md ml-auto">
                    {loading ? "Syncing Clusters..." : "Compute System Ranks"}
                  </button>
                </div>
              </div>

              {/* Responsive Layout Grid Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className={`font-mono text-xs uppercase tracking-wider ${tableHeaderClass}`}>
                    <tr>
                      <th className="py-4 px-5 text-center w-20">Rank</th>
                      <th className="py-4 px-5 w-32">Auditor Flag</th>
                      <th className="py-4 px-5">Candidate Node ID</th>
                      <th className="py-4 px-5">Target Specifications File</th>
                      <th className="py-4 px-5 text-center w-40">System Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/40">
                    {processedHistory.map((row, idx) => (
                      <tr key={idx} onClick={() => handleRowClickEngine(row.candidate_name)} className={`cursor-pointer transition-all border-l-4 border-transparent hover:border-blue-900 ${tableRowClass}`}>
                        <td className="py-4 px-5 text-center font-black text-blue-900 dark:text-blue-400 text-base">#{idx + 1}</td>
                        <td className="py-4 px-5">
                          {row.is_flagged === 1 ? (
                            <span className="flex items-center text-red-600 font-bold bg-red-500/10 border border-red-500/20 text-[11px] px-2 py-0.5 rounded-md w-fit"><AlertTriangle size={12} className="mr-1" /> AUDIT</span>
                          ) : <span className="text-slate-400">--</span>}
                        </td>
                        <td className="py-4 px-5 font-bold text-slate-800 dark:text-slate-200 text-base">👤 {row.candidate_name}</td>
                        <td className="py-4 px-5 text-slate-500 dark:text-slate-400 font-mono text-xs">{row.job_filename}</td>
                        <td className="py-4 px-5 text-center">
                          <span className="bg-blue-900 text-white px-3 py-1 rounded-lg font-black text-sm">{(row.score * 100).toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                    {processedHistory.length === 0 && (
                      <tr><td colSpan="5" className="text-center p-12 text-slate-400 font-medium">No candidate matrices indexed within active relational tracking buffers.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. SCREEN OPTION B: IMMERSIVE WEIGHT CONFIGURATION PANEL */}
        {currentScreen === 'parameters' && (
          <div className={`p-10 rounded-2xl border shadow-md space-y-8 ${elementCardClass}`}>
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Parametric Calibration Board</h3>
                <p className="text-slate-400 text-sm mt-0.5">Control operational scaling factors weights parameters on the fly</p>
              </div>
              <div className={`px-4 py-2 rounded-xl font-mono text-base font-black border ${totalWeightBubble === 100 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                Current Aggregation: {totalWeightBubble}% / 100%
              </div>
            </div>

            {/* Enlarged Sliders Cluster Block Grid Layout */}
            <div className="space-y-8 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="flex items-center space-x-2"><TrendingUp size={18} className="text-blue-900" /> <span>Semantic Context Integration (Vector Core)</span></span>
                  <span className="text-blue-900 font-mono text-lg">{weights.w_sem}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_sem} onChange={(e) => updateWeightParameter('w_sem', e.target.value)} className="w-full" />
                <p className="text-xs text-slate-400">Maps contextual matching parameters via dense structural neural network values weights.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="flex items-center space-x-2"><Briefcase size={18} className="text-purple-600" /> <span>Corporate Experience Fit Metrics</span></span>
                  <span className="text-purple-600 font-mono text-lg">{weights.w_exp}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_exp} onChange={(e) => updateWeightParameter('w_exp', e.target.value)} className="w-full" />
                <p className="text-xs text-slate-400">Evaluates baseline duration blocks specified across technical leadership fields nodes.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="flex items-center space-x-2"><CheckSquare size={18} className="text-amber-600" /> <span>Hard Skills Token Match Protection (Sparse Filters)</span></span>
                  <span className="text-amber-600 font-mono text-lg">{weights.w_ski}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_ski} onChange={(e) => updateWeightParameter('w_ski', e.target.value)} className="w-full" />
                <p className="text-xs text-slate-400">Validates clear keyword match exact strings presence inside raw documentation blocks.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="flex items-center space-x-2"><FileText size={18} className="text-cyan-600" /> <span>Project Domain Relevance Mapping (e.g., Fintech Terms)</span></span>
                  <span className="text-cyan-600 font-mono text-lg">{weights.w_proj}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_proj} onChange={(e) => updateWeightParameter('w_proj', e.target.value)} className="w-full" />
                <p className="text-xs text-slate-400">Scans contextual projects layout files for specified corporate vertical alignments.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="flex items-center space-x-2"><Sliders size={18} className="text-pink-600" /> <span>Behavioral Signals & Availability Half-Life Decay</span></span>
                  <span className="text-pink-600 font-mono text-lg">{weights.w_beh}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.w_beh} onChange={(e) => updateWeightParameter('w_beh', e.target.value)} className="w-full" />
                <p className="text-xs text-slate-400">Downweights platform dormancy indices using algorithmic half-life decay mathematical parameters.</p>
              </div>
            </div>

            {totalWeightBubble !== 100 && (
              <div className="bg-amber-500/10 border border-amber-500 text-amber-700 dark:text-amber-400 p-4 rounded-xl text-sm font-medium animate-pulse">
                ⚠️ Balanced Equation Notice: Ensure global parameters totals settle at 100% to protect rank stability layers.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📊 DRAWER SPECIFIC INSIGHTS PANEL LAYER REVIEWS */}
      {insightLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 px-8 py-5 rounded-2xl text-sm font-mono text-blue-400 animate-pulse flex items-center space-x-3">
            <span>⚙️ Synthesizing Thematic Pipeline Vectors...</span>
          </div>
        </div>
      )}

      {selectedInsight && (
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[540px] border-l shadow-2xl p-8 z-50 overflow-y-auto ${sidebarClass}`}>
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
            <div>
              <span className="text-xs font-bold bg-blue-900 text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider font-mono">Profile Insights Summary</span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">👤 {selectedInsight.candidate}</h3>
            </div>
            <button onClick={() => { setSelectedInsight(null); refreshDataHub(); }} className="text-xs font-mono font-bold border px-3 py-2 rounded-xl bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">[ ESCAPE ]</button>
          </div>

          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${elementCardClass}`}>
                <span className="text-slate-400 block text-xs font-mono uppercase mb-1">Status Recommendation</span>
                <span className={`font-black text-xs px-2.5 py-0.5 rounded-md inline-block ${selectedInsight.status === 'SHORTLIST' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : selectedInsight.status === 'REJECT' ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>{selectedInsight.status}</span>
              </div>
              <div className={`p-4 rounded-xl border ${elementCardClass}`}>
                <span className="text-slate-400 block text-xs font-mono uppercase mb-1">Recalculated Score</span>
                <span className="font-black text-emerald-600 text-base">{(selectedInsight.calculated_score * 100).toFixed(1)}% Match</span>
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl text-blue-900 dark:text-blue-300 leading-relaxed font-medium">
              <strong>📈 Metric Distribution Check:</strong> {selectedInsight.pool_benchmark}
            </div>

            <div className={`p-5 rounded-xl border ${elementCardClass}`}>
              <span className="text-slate-400 block text-xs font-mono uppercase mb-2">Executive Overview Summary</span>
              <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed font-medium">"{selectedInsight.pitch}"</p>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl">
                <span className="text-emerald-600 font-bold block mb-2 uppercase text-xs font-mono tracking-wider">🟢 Core Strengths Verified</span>
                <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{selectedInsight.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl">
                <span className="text-amber-600 font-bold block mb-2 uppercase text-xs font-mono tracking-wider">🟡 Core Structural Skill Gaps</span>
                <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{selectedInsight.gaps?.map((g, i) => <li key={i}>{g}</li>)}</ul>
              </div>
            </div>

            <div className={`p-5 rounded-xl border ${elementCardClass}`}>
              <span className="text-blue-900 dark:text-blue-400 font-bold block mb-2 uppercase text-xs font-mono tracking-wider">🤖 Target Diagnostic Questions</span>
              <ol className="space-y-3 list-decimal list-inside text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{selectedInsight.interview_questions?.map((q, i) => <li key={i} className="pl-1">"{q}"</li>)}</ol>
            </div>

            {/* Auditor Inputs Frame */}
            <div className={`p-5 rounded-xl border space-y-4 ${elementCardClass}`}>
              <span className="text-slate-800 dark:text-slate-200 font-bold block uppercase text-xs font-mono tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">✏️ Audit Evaluation Assessment</span>
              
              <label className="flex items-center space-x-3 cursor-pointer text-slate-700 dark:text-slate-300">
                <div onClick={() => setIsFlagged(!isFlagged)} className="text-blue-900 dark:text-blue-400">
                  {isFlagged ? <CheckSquare size={20} /> : <Square size={20} />}
                </div>
                <span className="text-sm font-medium">Flag profile node for priority audit oversight review</span>
              </label>

              <textarea value={localNotes} onChange={(e) => setLocalNotes(e.target.value)} placeholder="Type localized reviewer notes here..." className={`w-full h-24 rounded-xl border p-3 text-sm focus:outline-none focus:border-blue-900 font-medium ${inputControlClass}`} />
              
              <button onClick={handleSaveStatusState} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md">
                Synchronize Audit Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
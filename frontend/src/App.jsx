// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { aiRecruiterAPI } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [resumeBatch, setResumeBatch] = useState([]); 
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorUI, setErrorUI] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState({ total_matches: 0, avg_score: 0, highest_score: 0 });
  
  // 5-Parameter Sliders Customization Control Panel Matrix States
  const [weights, setWeights] = useState({
    w_sem: 30,
    w_exp: 20,
    w_ski: 20,
    w_proj: 20,
    w_beh: 10
  });

  const [selectedInsight, setSelectedInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [localNotes, setLocalNotes] = useState("");
  const [isFlagged, setIsFlagged] = useState(false);

  const handleSliderAdjustment = (parameter, targetValue) => {
    setWeights(prev => ({
      ...prev,
      [parameter]: parseFloat(targetValue)
    }));
  };

  const refreshDataHub = () => {
    aiRecruiterAPI.fetchHistory(weights).then(data => setHistory(Array.isArray(data) ? data : []));
    aiRecruiterAPI.fetchAnalytics().then(data => data && setAnalytics(data));
  };

  // Automatically refresh ranks whenever any of the 5 sliders are adjusted by the recruiter
  useEffect(() => {
    refreshDataHub();
  }, [weights]);

  useEffect(() => {
    aiRecruiterAPI.checkHealth().then(d => setServerStatus(d?.status === "healthy" ? "CONNECTED ✅" : "OFFLINE ❌"));
    refreshDataHub();
  }, []);

  const handleBatchProcessingTrigger = async () => {
    setErrorUI(null);
    if (resumeBatch.length === 0 || !jobFile) {
      setErrorUI("Validation Error: Please select both resumes and a JD sheet.");
      return;
    }
    setLoading(true);
    try {
      await aiRecruiterAPI.submitBatchMatch(resumeBatch, jobFile);
      setResumeBatch([]); 
      alert("Batch dispatched into background async processing pool!");
      setTimeout(() => { refreshDataHub(); }, 2500);
    } catch { setErrorUI("Network Error: Local backend processing aborted."); }
    finally { setLoading(false); }
  };

  const handleWipeHistoryTrigger = async () => {
    if(!window.confirm("Are you sure you want to clear old ranks and start fresh?")) return;
    try {
      await aiRecruiterAPI.clearHistory();
      setSelectedInsight(null);
      refreshDataHub();
    } catch { alert("Failed to purge database."); }
  };

  const handleRowClickEngine = async (candidateName) => {
    setInsightLoading(true);
    try {
      const data = await aiRecruiterAPI.fetchCandidateInsights(candidateName, weights);
      setSelectedInsight(data);
      setLocalNotes(data.notes || "");
      setIsFlagged(data.is_flagged === 1);
    } catch { alert("Failed to fetch evaluation layout metrics."); }
    finally { setInsightLoading(false); }
  };

  const handleSaveStatusState = async () => {
    if (!selectedInsight) return;
    try {
      await aiRecruiterAPI.updateCandidateStatus(selectedInsight.candidate, localNotes, isFlagged);
      refreshDataHub();
      setSelectedInsight(prev => ({ ...prev, notes: localNotes, is_flagged: isFlagged ? 1 : 0 }));
      alert("Changes saved to local database.");
    } catch { alert("Error saving parameters."); }
  };

  const processedHistory = history.filter(item => 
    (item?.candidate_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWeightBubble = weights.w_sem + weights.w_exp + weights.w_ski + weights.w_proj + weights.w_beh;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* Sidebar Controls Panel Frame */}
      <div className="w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden lg:flex overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-wider text-blue-400">ENTERPRISE ATX</h2>
            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-widest mt-1">Algorithmic Match Core</span>
          </div>

          {/* 5-Slider Parametric Control Center Dashboard Block */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300">🎛️ CRITERIA CONFIG</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-black ${totalWeightBubble === 100 ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>{totalWeightBubble}%</span>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div>
                <div className="flex justify-between text-slate-400 mb-1"><span>Semantic Context</span><span className="text-blue-400 font-bold">{weights.w_sem}%</span></div>
                <input type="range" min="0" max="100" value={weights.w_sem} onChange={(e) => handleSliderAdjustment('w_sem', e.target.value)} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-slate-400 mb-1"><span>Experience Fit</span><span className="text-purple-400 font-bold">{weights.w_exp}%</span></div>
                <input type="range" min="0" max="100" value={weights.w_exp} onChange={(e) => handleSliderAdjustment('w_exp', e.target.value)} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
              </div>
              <div>
                <div className="flex justify-between text-slate-400 mb-1"><span>Hard Skills Exact</span><span className="text-amber-400 font-bold">{weights.w_ski}%</span></div>
                <input type="range" min="0" max="100" value={weights.w_ski} onChange={(e) => handleSliderAdjustment('w_ski', e.target.value)} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              </div>
              <div>
                <div className="flex justify-between text-slate-400 mb-1"><span>Project Domain</span><span className="text-cyan-400 font-bold">{weights.w_proj}%</span></div>
                <input type="range" min="0" max="100" value={weights.w_proj} onChange={(e) => handleSliderAdjustment('w_proj', e.target.value)} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
              </div>
              <div>
                <div className="flex justify-between text-slate-400 mb-1"><span>Behavioral Signals</span><span className="text-pink-400 font-bold">{weights.w_beh}%</span></div>
                <input type="range" min="0" max="100" value={weights.w_beh} onChange={(e) => handleSliderAdjustment('w_beh', e.target.value)} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500" />
              </div>
            </div>
            {totalWeightBubble !== 100 && <p className="text-[9px] text-red-400 italic font-mono animate-pulse">Warning: Target total parameters weight should aggregate to 100%.</p>}
          </div>

          <div className="space-y-2">
            <a href={aiRecruiterAPI.getExportUrl()} download className="block text-center bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black py-2 rounded text-xs tracking-wide transition-all">
              📥 EXPORT REPORT CSV
            </a>
            <button onClick={handleWipeHistoryTrigger} className="w-full bg-red-950/60 border border-red-900/60 text-red-400 hover:bg-red-900 hover:text-white font-bold py-2 rounded text-xs transition-all">
              🗑️ PURGE HISTORY LEDGER
            </button>
          </div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-950 p-3 rounded border border-slate-800 font-mono mt-4">
          Node Connection: <span className="text-emerald-400 font-bold">{serverStatus}</span>
        </div>
      </div>

      {/* Main Board Frame */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Adaptive Rank Matrix</h1>
          <p className="text-slate-400 text-sm">Real-time localized hybrid vector compilation engine logs</p>
        </div>

        {errorUI && <div className="bg-red-950/40 border border-red-900 text-red-400 p-4 rounded-lg font-mono text-xs">{errorUI}</div>}

        {/* Analytical Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800"><span className="text-slate-500 text-xs font-mono block uppercase">Ingested Files</span><span className="text-3xl font-black text-blue-400">{analytics?.total_matches || 0}</span></div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800"><span className="text-slate-500 text-xs font-mono block uppercase">Avg Benchmark</span><span className="text-3xl font-black text-amber-400">{(analytics?.avg_score * 100).toFixed(1)}%</span></div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800"><span className="text-slate-500 text-xs font-mono block uppercase">Peak Cluster Match</span><span className="text-3xl font-black text-emerald-400">{(analytics?.highest_score * 100).toFixed(1)}%</span></div>
        </div>

        {/* Staging Binary Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="border-2 border-dashed border-slate-800 hover:border-blue-500/40 p-6 text-center cursor-pointer block text-slate-400 text-sm rounded-xl bg-slate-900/40"><input type="file" accept=".pdf,.txt" multiple className="hidden" onChange={(e) => setResumeBatch(Array.from(e.target.files))} />{resumeBatch.length > 0 ? `📁 ${resumeBatch.length} Vectors Staged` : "Drop Raw Resumes (PDF Bulk)"}</label>
          <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/40 p-6 text-center cursor-pointer block text-slate-400 text-sm rounded-xl bg-slate-900/40"><input type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => setJobFile(e.target.files[0])} />{jobFile ? `📄 ${jobFile.name}` : "Drop Job Blueprint File"}</label>
        </div>

        {/* Table View Layout Matrix */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <input type="text" placeholder="🔍 Search database rows..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:border-blue-500 text-xs font-mono" />
            <button onClick={handleBatchProcessingTrigger} disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs font-mono transition-all ml-auto">
              {loading ? "Processing Engine Async Threads..." : "⚡ Execute Realtime Score Indexing"}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Ledger Flag</th>
                  <th className="py-3 px-4">Profile node Id</th>
                  <th className="py-3 px-4">Target Deployment Hub</th>
                  <th className="py-3 px-4 text-center">Configured Weighted Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {processedHistory.map((row, idx) => (
                  <tr key={idx} onClick={() => handleRowClickEngine(row.candidate_name)} className="hover:bg-blue-950/20 cursor-pointer border-l-2 border-transparent hover:border-blue-500 transition-all">
                    <td className="py-3 px-4 text-center font-black text-amber-400">#{idx + 1}</td>
                    <td className="py-3 px-4">{row.is_flagged === 1 ? <span className="text-red-500 font-bold bg-red-950/30 px-2 py-0.5 rounded border border-red-900/40 text-[10px]">⚠️ FLAGGED</span> : <span className="text-slate-600">--</span>}</td>
                    <td className="py-3 px-4 font-bold text-slate-200">👤 {row.candidate_name}</td>
                    <td className="py-3 px-4 text-slate-400">{row.job_filename}</td>
                    <td className="py-3 px-4 text-center"><span className="bg-slate-950 text-emerald-400 px-2 py-1 rounded font-bold border border-emerald-900/30">{(row.score * 100).toFixed(1)}%</span></td>
                  </tr>
                ))}
                {processedHistory.length === 0 && (
                  <tr><td colSpan="5" className="text-center p-8 text-slate-600">No active matrix indexes cached inside database streams.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {insightLoading && <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50"><div className="bg-slate-950 border border-slate-800 px-6 py-4 rounded-xl text-xs font-mono text-blue-400 animate-pulse">⚙️ Recalculating Dynamic Weight Vectors...</div></div>}

      {/* Drawer Details Panel Panel Layout */}
      {selectedInsight && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl p-8 z-50 overflow-y-auto">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-900/50 px-2 py-0.5 rounded uppercase tracking-wider">Dynamic Slider Evaluation Log</span>
              <h3 className="text-lg font-black text-slate-100 mt-1">👤 {selectedInsight.candidate}</h3>
            </div>
            <button onClick={() => { setSelectedInsight(null); refreshDataHub(); }} className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded bg-slate-950 font-mono transition-all">[ CLOSE ]</button>
          </div>

          <div className="space-y-6 text-xs font-mono">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase mb-1">Status Recommendation</span>
                <span className={`font-black px-2 py-0.5 rounded text-[11px] inline-block ${selectedInsight.status === 'SHORTLIST' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : selectedInsight.status === 'REJECT' ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-amber-950 text-amber-400 border border-amber-900'}`}>{selectedInsight.status}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase mb-1">Weighted Runtime Score</span>
                <span className="text-slate-300 font-bold text-[11px] text-emerald-400">{(selectedInsight.calculated_score * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-900/40 p-3 rounded-lg text-blue-300 leading-relaxed">
              <strong>📈 Structural Ledger Context Check:</strong> {selectedInsight.pool_benchmark}
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
              <span className="text-slate-500 block text-[10px] font-bold uppercase mb-2">📋 Executive Abstract Summary</span>
              <p className="text-slate-300 italic leading-relaxed text-xs">"{selectedInsight.pitch}"</p>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-lg">
                <span className="text-emerald-400 font-bold block mb-2 uppercase text-[11px] tracking-wide">🟢 Hybrid Strengths Verified</span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed">{selectedInsight.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>

              <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-lg">
                <span className="text-amber-400 font-bold block mb-2 uppercase text-[11px] tracking-wide">🟡 Extracted Missing Skill Gaps</span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300 leading-relaxed">{selectedInsight.gaps?.map((g, i) => <li key={i}>{g}</li>)}</ul>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-blue-400 font-bold block mb-2 uppercase text-[11px] tracking-wide">🤖 Suggested Local Interview Questions</span>
              <ol className="space-y-3 list-decimal list-inside text-slate-300 leading-relaxed">{selectedInsight.interview_questions?.map((q, i) => <li key={i} className="pl-1">"{q}"</li>)}</ol>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/30 space-y-3 shadow-inner">
              <span className="text-slate-200 font-bold block uppercase text-[11px] tracking-wide border-b border-slate-800 pb-2">✏️ Action Review Field Layer</span>
              <label className="flex items-center space-x-2 cursor-pointer text-slate-300 py-1">
                <input type="checkbox" checked={isFlagged} onChange={(e) => setIsFlagged(e.target.checked)} className="rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0 w-4 h-4" />
                <span className="text-xs text-slate-400">Flag profile for multi-user audit</span>
              </label>
              <textarea value={localNotes} onChange={(e) => setLocalNotes(e.target.value)} placeholder="Enter localized evaluation assessment..." className="w-full h-20 bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-blue-500 text-xs" />
              <button onClick={handleSaveStatusState} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-xs tracking-wider transition-all shadow-md">
                💾 RECORD MODERATION DECISION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
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

  // Phase 9 UI State triggers
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const refreshDataHub = () => {
    aiRecruiterAPI.fetchHistory().then(data => setHistory(Array.isArray(data) ? data : []));
    aiRecruiterAPI.fetchAnalytics().then(data => data && setAnalytics(data));
  };

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
      setResumeBatch([]); refreshDataHub();
    } catch { setErrorUI("Network Error: Local backend processing aborted."); }
    finally { setLoading(false); }
  };

  const handleRowClickEngine = async (candidateName) => {
    setInsightLoading(true);
    setSelectedInsight(null);
    try {
      const data = await aiRecruiterAPI.fetchCandidateInsights(candidateName);
      setSelectedInsight(data);
    } catch { alert("Failed to fetch evaluation layout metrics."); }
    finally { setInsightLoading(false); }
  };

  const filteredHistory = history.filter(item =>
    (item?.candidate_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* Sidebar UI */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-blue-400 mb-8">LOCAL RECRUITER</h2>
          <div className="bg-slate-800 px-4 py-2 rounded-lg font-medium">Dashboard Suite</div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-950 p-3 rounded border border-slate-800">
          Status: <span className="text-emerald-400 font-bold">{serverStatus}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto p-10 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Offline Screening Matrix</h1>
            <p className="text-slate-400 text-sm">Phase 9: Local NLP Token Heuristics Active</p>
          </div>
          <button onClick={handleBatchProcessingTrigger} disabled={loading} className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-bold text-sm transition-all">
            {loading ? "Processing..." : "Execute Bulk Match"}
          </button>
        </div>

        {errorUI && <div className="bg-red-950/40 border border-red-900 text-red-400 p-4 rounded-lg font-mono text-xs">{errorUI}</div>}

        {/* Analytics Display Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800"><span className="text-slate-500 text-xs font-mono block uppercase">Total Resumes</span><span className="text-3xl font-black text-blue-400">{analytics?.total_matches || 0}</span></div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800"><span className="text-slate-500 text-xs font-mono block uppercase">Avg Score</span><span className="text-3xl font-black text-amber-400">{(analytics?.avg_score * 100).toFixed(1)}%</span></div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800"><span className="text-slate-500 text-xs font-mono block uppercase">Highest Peak</span><span className="text-3xl font-black text-emerald-400">{(analytics?.highest_score * 100).toFixed(1)}%</span></div>
        </div>

        {/* Local File Storage Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="border-2 border-dashed border-slate-800 hover:border-blue-500/40 p-6 text-center cursor-pointer block text-slate-400 text-sm rounded-xl bg-slate-900/40"><input type="file" accept=".pdf" multiple className="hidden" onChange={(e) => setResumeBatch(Array.from(e.target.files))} />{resumeBatch.length > 0 ? `📁 ${resumeBatch.length} Resumes Ready` : "Staging Resumes (PDF Bulk)"}</label>
          <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/40 p-6 text-center cursor-pointer block text-slate-400 text-sm rounded-xl bg-slate-900/40"><input type="file" accept=".pdf" className="hidden" onChange={(e) => setJobFile(e.target.files[0])} />{jobFile ? `📄 ${jobFile.name}` : "Staging Role Matrix (Single PDF)"}</label>
        </div>

        {/* Candidate Ledger Grid */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <input type="text" placeholder="🔍 Filter database rows locally..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm mb-4 w-full sm:w-64 focus:outline-none focus:border-blue-500" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-500 border-b border-slate-800">
                <tr><th className="py-3 px-4">Candidate Spec</th><th className="py-3 px-4">Ledger Email</th><th className="py-3 px-4">Job File Source</th><th className="py-3 px-4 text-center">Score Metric</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredHistory.map((row, idx) => (
                  <tr key={idx} onClick={() => handleRowClickEngine(row.candidate_name)} className="hover:bg-blue-950/20 cursor-pointer border-l-2 border-transparent hover:border-blue-500 transition-all">
                    <td className="py-3 px-4 font-bold text-blue-400">👤 {row.candidate_name}</td>
                    <td className="py-3 px-4 text-slate-400">{row.candidate_email}</td>
                    <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{row.job_filename}</td>
                    <td className="py-3 px-4 text-center"><span className="bg-slate-950 text-emerald-400 px-2 py-0.5 rounded font-bold">{(row.score * 100).toFixed(1)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      {insightLoading && <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50"><div className="bg-slate-950 border border-slate-800 px-6 py-4 rounded-xl text-xs font-mono text-blue-400 animate-pulse">⚙️ Accessing Local Core Matrix Streams...</div></div>}

      {/* 🔥 THE INTERACTIVE SLIDING DRAWER PANEL */}
      {selectedInsight && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl p-8 z-50 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="text-sm font-black text-blue-400 uppercase tracking-wider">Evaluation Metrics</h3>
              <p className="text-xs text-slate-400 font-mono">{selectedInsight.candidate}</p>
            </div>
            <button onClick={() => setSelectedInsight(null)} className="text-xs text-slate-500 hover:text-white border border-slate-700 px-2 py-1 rounded bg-slate-950 font-mono">[CLOSE]</button>
          </div>

          <div className="space-y-6 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-500">Status Vector:</span>
              <span className={`font-black px-2 py-0.5 rounded ${selectedInsight.status === 'SHORTLIST' ? 'bg-emerald-950 text-emerald-400' : selectedInsight.status === 'REJECT' ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'}`}>{selectedInsight.status}</span>
            </div>

            <div className="border border-slate-800 p-3 rounded bg-blue-950/10 text-slate-300 italic">" {selectedInsight.pitch} "</div>
            <div><span className="text-emerald-400 font-bold block mb-2 uppercase tracking-wide">🟢 Local Strengths</span><ul className="space-y-1.5 list-disc list-inside text-slate-400">{selectedInsight.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
            <div><span className="text-amber-400 font-bold block mb-2 uppercase tracking-wide">🟡 Delta Skill Gaps</span><ul className="space-y-1.5 list-disc list-inside text-slate-400">{selectedInsight.gaps?.map((g, i) => <li key={i}>{g}</li>)}</ul></div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800"><span className="text-blue-400 font-bold block mb-2 uppercase tracking-wide">🤖 Target Questions</span><ol className="space-y-2 list-decimal list-inside text-slate-400">{selectedInsight.interview_questions?.map((q, i) => <li key={i}>"{q}"</li>)}</ol></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
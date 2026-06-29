import React, { useState, useEffect } from 'react';
import { aiRecruiterAPI } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [resumeBatch, setResumeBatch] = useState([]); 
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchSummary, setBatchSummary] = useState(null);
  const [errorUI, setErrorUI] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState({ total_matches: 0, avg_score: 0, highest_score: 0 });
  
  // 🔥 Phase 9 States
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const refreshDataHub = () => {
    aiRecruiterAPI.fetchHistory()
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]));
      
    aiRecruiterAPI.fetchAnalytics()
      .then(data => setAnalytics(data || { total_matches: 0, avg_score: 0, highest_score: 0 }))
      .catch(() => setAnalytics({ total_matches: 0, avg_score: 0, highest_score: 0 }));
  };

  useEffect(() => {
    aiRecruiterAPI.checkHealth()
      .then(data => setServerStatus(data?.status === "healthy" ? "CONNECTED ✅" : "OFFLINE ❌"))
      .catch(() => setServerStatus("OFFLINE ❌"));
    refreshDataHub();
  }, []);

  const handleBatchProcessingTrigger = async () => {
    setErrorUI(null);
    setBatchSummary(null);
    if (resumeBatch.length === 0 || !jobFile) {
      setErrorUI("Validation Error: Please select at least one Resume and a Job Description PDF.");
      return;
    }
    setLoading(true);
    try {
      const response = await aiRecruiterAPI.submitBatchMatch(resumeBatch, jobFile);
      if (response && (response.status === "error" || response.error)) {
        setErrorUI(`Backend Error: ${response.message || response.error}`);
      } else {
        setBatchSummary(response);
        setResumeBatch([]); 
        refreshDataHub();
      }
    } catch (err) {
      setErrorUI("Network Error: Dynamic array batch processing matrix aborted.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Phase 9 Trigger Insight Fetch Engine
  const handleRowClickEngine = async (candidateName) => {
    setInsightLoading(true);
    setSelectedInsight(null);
    try {
      const data = await aiRecruiterAPI.fetchCandidateInsights(candidateName);
      if(!data.error) {
        setSelectedInsight(data);
      }
    } catch(e) {
      console.error("Insight loading broken.");
    } finally {
      setInsightLoading(false);
    }
  };

  const filteredHistory = Array.isArray(history) 
    ? history.filter(item => {
        const name = item?.candidate_name || "";
        const jobFile = item?.job_filename || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               jobFile.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-blue-400 mb-8">RECRUITER AI</h2>
          <div className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium">Dashboard Suite</div>
        </div>
        <div className="text-xs text-slate-500 bg-slate-950 p-3 rounded border border-slate-800">
          Status: <span className="text-emerald-400 font-bold">{serverStatus}</span>
        </div>
      </div>

      {/* Main Interface Wrapper */}
      <div className="flex-1 flex flex-col overflow-y-auto p-10 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold">Enterprise Analytics Hub</h1>
            <p className="text-slate-400 text-sm">Phase 9: AI Evaluation Insights Matrix</p>
          </div>
          <button onClick={handleBatchProcessingTrigger} disabled={loading} className="bg-blue-600 hover:bg-blue-500 font-bold px-6 py-3 rounded-lg transition-all text-sm">
            {loading ? "Processing..." : "Execute Bulk Match"}
          </button>
        </div>

        {errorUI && (
          <div className="bg-red-950/60 border border-red-800 text-red-300 p-4 rounded-xl text-xs font-mono">
            {errorUI}
          </div>
        )}

        {/* Telemetry Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-xs font-mono block uppercase">Total Scanned Candidates</span>
            <span className="text-3xl font-black text-blue-400">{analytics?.total_matches || 0}</span>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-xs font-mono block uppercase">Average Alignment Rating</span>
            <span className="text-3xl font-black text-amber-400">
              {analytics?.avg_score ? (analytics.avg_score * 100).toFixed(1) : "0.0"}%
            </span>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-xs font-mono block uppercase">Highest System Peak</span>
            <span className="text-3xl font-black text-emerald-400">
              {analytics?.highest_score ? (analytics.highest_score * 100).toFixed(1) : "0.0"}%
            </span>
          </div>
        </div>

        {/* File Drop Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block mb-3">Bulk Candidates Staging Box</span>
            <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 p-6 text-center cursor-pointer block text-sm text-slate-400 rounded-lg transition-all">
              {resumeBatch.length > 0 ? `📁 ${resumeBatch.length} Resumes In Queue` : "Select Multiple Resumes (PDF Only)"}
              <input type="file" accept=".pdf" multiple className="hidden" onChange={(e) => setResumeBatch(Array.from(e.target.files))} />
            </label>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase block mb-3">Target Profile Bounds</span>
              <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 p-6 text-center cursor-pointer block text-sm text-slate-400 rounded-lg transition-all">
                {jobFile ? `📄 ${jobFile.name}` : "Upload Role Matrix Sheet (PDF)"}
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setJobFile(e.target.files[0])} />
              </label>
            </div>
          </div>
        </div>

        {/* Historical Log Grid */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="🔍 Search files or names..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm w-full sm:w-72 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Candidate Identity (Click for Insights)</th>
                  <th className="py-3 px-4">Contact Mapping</th>
                  <th className="py-3 px-4">Target Job File</th>
                  <th className="py-3 px-4 text-center">AI Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((row, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => handleRowClickEngine(row?.candidate_name || "Unknown Candidate")}
                      className="hover:bg-blue-950/20 cursor-pointer transition-all border-l-2 border-transparent hover:border-blue-500"
                    >
                      <td className="py-3 px-4 text-blue-400 font-bold">👤 {row?.candidate_name || "Unknown Candidate"}</td>
                      <td className="py-3 px-4 text-slate-400">{row?.candidate_email || "N/A"}</td>
                      <td className="py-3 px-4 truncate max-w-xs">{row?.job_filename || "N/A"}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-slate-950 px-2 py-0.5 rounded text-emerald-400 font-bold">
                          {row?.score ? (row.score * 100).toFixed(1) : "66.1"}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr onClick={() => handleRowClickEngine("Rahul Verma")}>
                    <td className="py-3 px-4 text-blue-400 font-bold">👤 Rahul Verma (Click Mock Test)</td>
                    <td className="py-3 px-4 text-slate-400">rahul@example.com</td>
                    <td className="py-3 px-4">job_description.pdf</td>
                    <td className="py-3 px-4 text-center"><span className="text-emerald-400 font-bold">66.1%</span></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🔥 PHASE 9: ADVANCED AI INSIGHT DRAWER MODAL OVERLAY */}
      {insightLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-xl font-mono text-sm">
            ⚡ Decrypting Neural Alignment Parameters...
          </div>
        </div>
      )}

      {selectedInsight && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-slate-900 border-l border-slate-800 shadow-2xl p-8 z-50 overflow-y-auto transform transition-transform duration-300">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-blue-400 uppercase tracking-wider">AI Insight Matrix</h3>
              <p className="text-xs text-slate-400">{selectedInsight.candidate}</p>
            </div>
            <button 
              onClick={() => setSelectedInsight(null)}
              className="text-slate-400 hover:text-white font-bold font-mono border border-slate-700 px-2 py-1 rounded bg-slate-950 text-xs"
            >
              [CLOSE]
            </button>
          </div>

          <div className="space-y-6 font-mono text-xs">
            {/* Core Strengths */}
            <div>
              <span className="text-emerald-400 font-bold uppercase block mb-2">🟢 Core Strengths</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {selectedInsight.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            {/* Gap Analysis */}
            <div>
              <span className="text-amber-400 font-bold uppercase block mb-2">🟡 Identified Tech Gaps</span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {selectedInsight.gaps?.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>

            {/* Tailored Interview Questions */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/60">
              <span className="text-blue-400 font-bold uppercase block mb-2">🤖 Recommended Tech Questions</span>
              <ol className="space-y-2 list-decimal list-inside text-slate-400 italic">
                {selectedInsight.interview_questions?.map((q, i) => <li key={i} className="pl-1">"{q}"</li>)}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
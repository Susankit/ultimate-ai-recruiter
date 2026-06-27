import React, { useState, useEffect } from 'react';
import { aiRecruiterAPI } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [resumeBatch, setResumeBatch] = useState([]); // Array format state for Phase 8 Bulk uploads
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchSummary, setBatchSummary] = useState(null);
  const [errorUI, setErrorUI] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState({ total_matches: 0, avg_score: 0, highest_score: 0 });

  const refreshDataHub = () => {
    aiRecruiterAPI.fetchHistory().then(data => setHistory(data || []));
    aiRecruiterAPI.fetchAnalytics().then(data => setAnalytics(data));
  };

  useEffect(() => {
    aiRecruiterAPI.checkHealth()
      .then(data => setServerStatus(data.status === "healthy" ? "CONNECTED ✅" : "OFFLINE ❌"))
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
      if (response && response.status === "error") {
        setErrorUI(`Backend Error: ${response.message}`);
      } else {
        setBatchSummary(response);
        setResumeBatch([]); // Clearing staging queue state upon success
        refreshDataHub();
      }
    } catch (err) {
      setErrorUI("Network Error: Dynamic array batch processing matrix aborted.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => 
    item.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.job_filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
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
            <p className="text-slate-400 text-sm">Phase 8: Tokenized Parallel Embedding Batch Engine</p>
          </div>
          <button onClick={handleBatchProcessingTrigger} disabled={loading} className="bg-blue-600 hover:bg-blue-500 font-bold px-6 py-3 rounded-lg transition-all text-sm">
            {loading ? "Processing Batch Matrix..." : "Execute Bulk Match"}
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
            <span className="text-3xl font-black text-blue-400">{analytics.total_matches}</span>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-xs font-mono block uppercase">Average Alignment Rating</span>
            <span className="text-3xl font-black text-amber-400">{(analytics.avg_score * 100).toFixed(1)}%</span>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-xs font-mono block uppercase">Highest System Peak</span>
            <span className="text-3xl font-black text-emerald-400">{(analytics.highest_score * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Multi-File Core File Drop Controllers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase block mb-3">Bulk Candidates Staging Box</span>
            <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 p-6 text-center cursor-pointer block text-sm text-slate-400 rounded-lg transition-all">
              {resumeBatch.length > 0 ? `📁 ${resumeBatch.length} Resumes In Queue` : "Select Multiple Resumes (PDF Only)"}
              {/* Added multiple tags for batch execution */}
              <input type="file" accept=".pdf" multiple className="hidden" onChange={(e) => setResumeBatch(Array.from(e.target.files))} />
            </label>
            {resumeBatch.length > 0 && (
              <div className="mt-3 space-y-1 max-h-24 overflow-y-auto bg-slate-950 p-2 rounded border border-slate-800/60 font-mono text-[10px] text-slate-400">
                {resumeBatch.map((f, i) => <div key={i} className="truncate">✓ {f.name}</div>)}
              </div>
            )}
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

        {/* Phase 8 Live Processing Summary Tracker Banner */}
        {batchSummary && (
          <div className="bg-slate-900 border border-emerald-900/60 p-5 rounded-xl font-mono text-xs">
            <span className="text-emerald-400 font-bold block mb-2">🎉 BATCH TRANSACTION COMPLETED:</span>
            <div className="text-slate-400 mb-3">Processed Count: <span className="text-white font-bold">{batchSummary.processed_count} Candidates</span></div>
            <div className="space-y-1 max-h-32 overflow-y-auto bg-slate-950 p-3 rounded border border-slate-800">
              {batchSummary.results.map((res, i) => (
                <div key={i} className="flex justify-between border-b border-slate-900 pb-1 text-slate-300">
                  <span>{res.candidate}</span>
                  <span className="text-emerald-400 font-bold">{(res.score * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical Log Grid */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <input 
              type="text" 
              placeholder="🔍 Live filter data rows..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm w-full sm:w-72 focus:outline-none focus:border-blue-500"
            />
            <a href="http://127.0.0.1:8000/api/export" download className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2">
              📥 Export Database to CSV
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-500 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Candidate Identity</th>
                  <th className="py-3 px-4">Contact Mapping</th>
                  <th className="py-3 px-4">Target Job File</th>
                  <th className="py-3 px-4 text-center">AI Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/40">
                      <td className="py-3 px-4 text-blue-400 font-bold">{row.candidate_name}</td>
                      <td className="py-3 px-4 text-slate-400">{row.candidate_email}</td>
                      <td className="py-3 px-4 truncate max-w-xs">{row.job_filename}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-slate-950 px-2 py-0.5 rounded text-emerald-400 font-bold">
                          {(row.score * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-600 italic">No corresponding records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
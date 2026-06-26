import React, { useState, useEffect } from 'react';
import { aiRecruiterAPI } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
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

  const handleMatchCalculation = async () => {
    setErrorUI(null);
    if (!resumeFile || !jobFile) {
      setErrorUI("Validation Error: Dono PDF files select karna mandatory hai.");
      return;
    }
    setLoading(true);
    try {
      const response = await aiRecruiterAPI.submitMatch(resumeFile, jobFile);
      if (response && response.status === "error") {
        setErrorUI(`Backend Error: ${response.message}`);
      } else {
        setResult(response);
        refreshDataHub();
      }
    } catch (err) {
      setErrorUI("Network Error: Computation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Front-end Live Client Filtering
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

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto p-10 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold">Enterprise Analytics Hub</h1>
            <p className="text-slate-400 text-sm">Phase 7: Real-time Stats aggregation & CSV Export</p>
          </div>
          <button onClick={handleMatchCalculation} disabled={loading} className="bg-blue-600 hover:bg-blue-500 font-bold px-6 py-3 rounded-lg transition-all text-sm">
            {loading ? "Processing..." : "Run AI Matrix"}
          </button>
        </div>

        {/* Phase 7 Feature: Top Analytics Cards */}
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

        {/* File Input Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <label className="border-2 border-dashed border-slate-700 p-4 text-center cursor-pointer block text-sm text-slate-400 rounded-lg">
              {resumeFile ? `📄 ${resumeFile.name}` : "Upload Resume PDF"}
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
            </label>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <label className="border-2 border-dashed border-slate-700 p-4 text-center cursor-pointer block text-sm text-slate-400 rounded-lg">
              {jobFile ? `📄 ${jobFile.name}` : "Upload Job Description PDF"}
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setJobFile(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* Live Result Feedback */}
        {result && (
          <div className="bg-slate-900 p-5 rounded-xl border border-blue-900/40 font-mono text-xs">
            <span className="text-blue-400 font-bold block mb-2">LIVE PROCESSING COMPLETED:</span>
            <div>Match Score: <span className="text-emerald-400 font-bold">{(result.match_score * 100).toFixed(1)}%</span></div>
          </div>
        )}

        {/* Ledger Table with Search & Export features */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <input
              type="text"
              placeholder="🔍 Search candidate name or document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-sm w-full sm:w-72 focus:outline-none focus:border-blue-500"
            />
            <a
              href="http://127.0.0.1:8000/api/export"
              download
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2"
            >
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
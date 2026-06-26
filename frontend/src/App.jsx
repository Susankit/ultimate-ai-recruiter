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

  // Fetch server status and past matching logs on mount
  const loadHistoryData = () => {
    aiRecruiterAPI.fetchHistory().then(data => setHistory(data || []));
  };

  useEffect(() => {
    aiRecruiterAPI.checkHealth()
      .then(data => setServerStatus(data.status === "healthy" ? "CONNECTED ✅" : "OFFLINE ❌"))
      .catch(() => setServerStatus("OFFLINE ❌"));
    
    loadHistoryData();
  }, []);

  const handleMatchCalculation = async () => {
    setErrorUI(null);
    if (!resumeFile || !jobFile) {
      setErrorUI("Validation Error: Please supply both PDF files.");
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await aiRecruiterAPI.submitMatch(resumeFile, jobFile);
      if (response && response.status === "error") {
        setErrorUI(`Backend Exception: ${response.message}`);
      } else {
        setResult(response);
        loadHistoryData(); // Smoothly trigger re-fetch to show new log in table instantly
      }
    } catch (err) {
      setErrorUI("Network Error: Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-blue-400 mb-8">RECRUITER AI</h2>
          <nav className="space-y-3">
            <div className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium">Workspace Engine</div>
          </nav>
        </div>
        <div className="text-xs text-slate-500 bg-slate-950 p-3 rounded border border-slate-800">
          Backend Link: <span className={`font-mono font-bold ${serverStatus.includes('CONNECTED') ? 'text-emerald-400' : 'text-rose-500'}`}>{serverStatus}</span>
        </div>
      </div>

      {/* Main Container Divided Into Input Panel & Historic Database Ledger */}
      <div className="flex-1 flex flex-col overflow-y-auto p-10 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">AI Matching Workspace</h1>
            <p className="text-slate-400">Phase 6: Relational DB Logs & Intelligent Profile Extraction</p>
          </div>
          <button 
            onClick={handleMatchCalculation}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-6 py-3 rounded-lg transition-all"
          >
            {loading ? "Parsing & Storing..." : "Run AI Matrix"}
          </button>
        </div>

        {errorUI && (
          <div className="bg-rose-950/40 border border-rose-800/80 text-rose-200 p-4 rounded-xl text-sm">
            <span className="font-bold">⚠️ Notice:</span> {errorUI}
          </div>
        )}
        
        {/* File Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-between h-44">
            <h3 className="text-lg font-semibold text-blue-400">Candidate Resume PDF</h3>
            <label className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-950/40 rounded-lg p-3 text-center cursor-pointer block truncate text-sm text-slate-400">
              {resumeFile ? `📄 ${resumeFile.name}` : "Select Resume PDF"}
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
            </label>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-between h-44">
            <h3 className="text-lg font-semibold text-emerald-400">Target Job Profile PDF</h3>
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/40 rounded-lg p-3 text-center cursor-pointer block truncate text-sm text-slate-400">
              {jobFile ? `📄 ${jobFile.name}` : "Select Job Description PDF"}
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setJobFile(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* Live Calculation Output Display with Profile Information */}
        {result && (
          <div className="bg-slate-900 p-6 rounded-xl border border-blue-900/50">
            <h3 className="text-lg font-bold mb-4 text-slate-200">Latest Live Results</h3>
            {result.candidate_profile && (
              <div className="mb-4 bg-slate-950 p-4 rounded-lg border border-slate-800 grid grid-cols-3 gap-2 text-xs font-mono">
                <div><span className="text-slate-500 block">EXTRACTED NAME:</span> <span className="text-blue-400 font-bold">{result.candidate_profile.name}</span></div>
                <div><span className="text-slate-500 block">EMAIL ID:</span> <span className="text-slate-300">{result.candidate_profile.email}</span></div>
                <div><span className="text-slate-500 block">CONTACT TELEPHONE:</span> <span className="text-slate-300">{result.candidate_profile.phone}</span></div>
              </div>
            )}
            <div className="text-center bg-slate-950 p-4 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-500 block">SEMANTIC MATCHING SCORE</span>
              <span className="text-4xl font-black text-emerald-400">{(result.match_score * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {/* Phase 6 Feature: Relational Match History Ledger Table */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold mb-4 text-slate-300 tracking-wide">Historical Match Database Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs uppercase bg-slate-950 text-slate-500 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Candidate Identity</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Job Document Filename</th>
                  <th className="py-3 px-4 text-center">AI Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {history.length > 0 ? (
                  history.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-950/40">
                      <td className="py-3 px-4 text-blue-400 font-bold">{row.candidate_name}</td>
                      <td className="py-3 px-4 text-slate-300">{row.candidate_email}</td>
                      <td className="py-3 px-4 text-slate-400 truncate max-w-xs">{row.job_filename}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded font-bold ${row.score >= 0.7 ? 'bg-emerald-950 text-emerald-400' : row.score >= 0.4 ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'}`}>
                          {(row.score * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-600 italic">No persistent match records found inside SQLite database.</td>
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
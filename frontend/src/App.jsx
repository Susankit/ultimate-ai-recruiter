import React, { useState, useEffect } from 'react';
import { aiRecruiterAPI } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    aiRecruiterAPI.checkHealth().then(data => {
      setServerStatus(data.status === "healthy" ? "CONNECTED ✅" : "OFFLINE ❌");
    });
  }, []);

  const handleMatchCalculation = async () => {
    if (!resumeText.trim() || !jobText.trim()) {
      alert("Please fill out both the resume and job description text fields.");
      return;
    }
    setLoading(true);
    setResult(null);
    
    const response = await aiRecruiterAPI.submitMatch(resumeText, jobText);
    setLoading(false);
    setResult(response);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-blue-400 mb-8">RECRUITER AI</h2>
          <nav className="space-y-3">
            <div className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium">Dashboard</div>
          </nav>
        </div>
        <div className="text-xs text-slate-500 bg-slate-950 p-3 rounded border border-slate-800">
          Backend Link: <span className="font-mono font-bold text-emerald-400">{serverStatus}</span>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Workspace Match Sandbox</h1>
            <p className="text-slate-400">Phase 3: Live Semantic Matching Operations</p>
          </div>
          <button 
            onClick={handleMatchCalculation}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-lg shadow-blue-900/40"
          >
            {loading ? "Analyzing Core Matrices..." : "Compute Match Matrix"}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Candidate Resume Profile</h3>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-blue-500 resize-none" 
              placeholder="Paste candidate raw resume string text data here..."
            ></textarea>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-3 text-emerald-400">Target Job Description</h3>
            <textarea 
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-emerald-500 resize-none" 
              placeholder="Paste structural role specifications text requirements here..."
            ></textarea>
          </div>
        </div>

        {/* Dynamic AI Results Panel */}
        {result && (
          <div className="bg-slate-900 p-6 rounded-xl border border-blue-900/50 animation-fade-in">
            <h3 className="text-xl font-bold mb-4 text-slate-200">AI Assessment Analytics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">SEMANTIC MATCH SCORE</span>
                <span className="text-4xl font-black text-blue-400">
                  {typeof result.match_score === 'number' ? `${(result.match_score * 100).toFixed(1)}%` : "Error"}
                </span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">RESUME TOKENS</span>
                <span className="text-2xl font-bold text-slate-300">{result.diagnostics?.resume_words || 0} words</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">KEYWORD GAP COVERAGE</span>
                <span className="text-md font-medium text-emerald-400 block mt-2">
                  {result.keyword_analysis?.matching_skills?.length || 0} Key Skills Identified
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
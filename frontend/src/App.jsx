import React, { useState, useEffect } from 'react';
import { aiRecruiterAPI } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorUI, setErrorUI] = useState(null);

  // Helper counters for edge-case tracking
  const getWordCount = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;

  useEffect(() => {
    aiRecruiterAPI.checkHealth()
      .then(data => {
        setServerStatus(data.status === "healthy" ? "CONNECTED ✅" : "OFFLINE ❌");
      })
      .catch(() => {
        setServerStatus("OFFLINE ❌");
      });
  }, []);

  const handleMatchCalculation = async () => {
    setErrorUI(null);
    
    // Strict Input Validation Guardrails
    if (!resumeText.trim() || !jobText.trim()) {
      setErrorUI("Validation Error: Neither the Resume nor Job Description fields can be left empty or filled purely with whitespace.");
      return;
    }

    if (getWordCount(resumeText) < 5 || getWordCount(jobText) < 5) {
      setErrorUI("Context Insufficiency: Please supply a more substantial text context (minimum 5 words per field) for AI analysis.");
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await aiRecruiterAPI.submitMatch(resumeText, jobText);
      
      if (response && response.status === "error") {
        setErrorUI(`Backend Exception: ${response.message}`);
      } else {
        setResult(response);
      }
    } catch (err) {
      setErrorUI("Network Error: Failed to communicate with the AI engine backend server. Ensure your FastAPI app is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar navigation element */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-blue-400 mb-8">RECRUITER AI</h2>
          <nav className="space-y-3">
            <div className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium">Dashboard Suite</div>
          </nav>
        </div>
        <div className="text-xs text-slate-500 bg-slate-950 p-3 rounded border border-slate-800">
          Backend Link: <span className={`font-mono font-bold ${serverStatus.includes('CONNECTED') ? 'text-emerald-400' : 'text-rose-500'}`}>{serverStatus}</span>
        </div>
      </div>

      {/* Primary Analytics Console */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Workspace Match Sandbox</h1>
            <p className="text-slate-400">Phase 4: Resilient Edge Validation & UX Guardrails</p>
          </div>
          <button 
            onClick={handleMatchCalculation}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-lg shadow-blue-900/40"
          >
            {loading ? "Analyzing Core Matrices..." : "Compute Match Matrix"}
          </button>
        </div>

        {/* Error Alert Display Module */}
        {errorUI && (
          <div className="mb-6 bg-rose-950/40 border border-rose-800/80 text-rose-200 p-4 rounded-xl text-sm flex items-center gap-2">
            <span className="font-bold">⚠️ status:</span> {errorUI}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-400">Candidate Resume Profile</h3>
              <span className="text-xs text-slate-500 font-mono">{getWordCount(resumeText)} words</span>
            </div>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-blue-500 resize-none" 
              placeholder="Paste candidate raw resume string text data here..."
            ></textarea>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-emerald-400">Target Job Description</h3>
              <span className="text-xs text-slate-500 font-mono">{getWordCount(jobText)} words</span>
            </div>
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
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 transition-all">
            <h3 className="text-xl font-bold mb-4 text-slate-200">AI Assessment Analytics</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">SEMANTIC MATCH SCORE</span>
                <span className="text-4xl font-black text-blue-400">
                  {typeof result.match_score === 'number' ? `${(result.match_score * 100).toFixed(1)}%` : "0.0%"}
                </span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">RESUME TOKENS</span>
                <span className="text-2xl font-bold text-slate-300">{result.diagnostics?.resume_words || 0} words</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">COMPUTATION STATUS</span>
                <span className="text-md font-semibold text-emerald-400 block mt-2 uppercase">
                  {result.status || "SUCCESS"}
                </span>
              </div>
            </div>

            {/* Keyword Skill Analysis Dashboard Elements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Matching Skills Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keyword_analysis?.matching_skills?.length > 0 ? (
                    result.keyword_analysis.matching_skills.map((skill, i) => (
                      <span key={i} className="bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded text-xs font-mono font-semibold">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600 italic">No semantic skill intersections identified.</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">Missing Critical Gaps</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keyword_analysis?.missing_skills?.length > 0 ? (
                    result.keyword_analysis.missing_skills.map((skill, i) => (
                      <span key={i} className="bg-rose-950/50 text-rose-300 border border-rose-800/60 px-2.5 py-1 rounded text-xs font-mono font-semibold">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-600 italic">Zero skill gaps found relative to system vocabulary.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
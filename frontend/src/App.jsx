import React, { useState, useEffect } from 'react';
import { aiRecruiterAPI } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorUI, setErrorUI] = useState(null);

  useEffect(() => {
    aiRecruiterAPI.checkHealth()
      .then(data => setServerStatus(data.status === "healthy" ? "CONNECTED ✅" : "OFFLINE ❌"))
      .catch(() => setServerStatus("OFFLINE ❌"));
  }, []);

  const handleMatchCalculation = async () => {
    setErrorUI(null);
    
    // Phase 5 File Type Guardrails
    if (!resumeFile || !jobFile) {
      setErrorUI("Validation Error: Please select or upload both files to trigger AI processing.");
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
      }
    } catch (err) {
      setErrorUI("Network Error: Upload failed. Ensure the FastAPI application server is online.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
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

      {/* Main Panel */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Workspace Match Sandbox</h1>
            <p className="text-slate-400">Phase 5: Binary PDF Upload & Extraction System</p>
          </div>
          <button 
            onClick={handleMatchCalculation}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-lg shadow-blue-900/40"
          >
            {loading ? "Parsing Binary Buffers..." : "Upload & Compute Match"}
          </button>
        </div>

        {errorUI && (
          <div className="mb-6 bg-rose-950/40 border border-rose-800/80 text-rose-200 p-4 rounded-xl text-sm flex items-center gap-2">
            <span className="font-bold">⚠️ status:</span> {errorUI}
          </div>
        )}
        
        {/* File Selectors replacing the old textareas */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-between h-52">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-1">Candidate Resume</h3>
              <p className="text-xs text-slate-500 mb-4">Accepts production standard vector .pdf formats</p>
            </div>
            <label className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-950/40 rounded-lg p-4 text-center cursor-pointer block transition-all">
              <span className="text-sm text-slate-400 block truncate">
                {resumeFile ? `📄 ${resumeFile.name}` : "Click to select Candidate Resume PDF"}
              </span>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => setResumeFile(e.target.files[0])} 
              />
            </label>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col justify-between h-52">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-1">Target Job Description</h3>
              <p className="text-xs text-slate-500 mb-4">Accepts corporate benchmark role profiles (.pdf)</p>
            </div>
            <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/40 rounded-lg p-4 text-center cursor-pointer block transition-all">
              <span className="text-sm text-slate-400 block truncate">
                {jobFile ? `📄 ${jobFile.name}` : "Click to select Job Description PDF"}
              </span>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => setJobFile(e.target.files[0])} 
              />
            </label>
          </div>
        </div>

        {/* Analytics Display Module */}
        {result && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 transition-all">
            <h3 className="text-xl font-bold mb-4 text-slate-200">AI File Assessment Analytics</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">SEMANTIC MATCH SCORE</span>
                <span className="text-4xl font-black text-blue-400">
                  {typeof result.match_score === 'number' ? `${(result.match_score * 100).toFixed(1)}%` : "0.0%"}
                </span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">RESUME WORD EXTRACTS</span>
                <span className="text-2xl font-bold text-slate-300">{result.diagnostics?.resume_words || 0} words</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <span className="text-xs text-slate-500 block mb-1">PARSING PIPELINE</span>
                <span className="text-md font-semibold text-emerald-400 block mt-2 uppercase">
                  {result.status || "SUCCESS"}
                </span>
              </div>
            </div>

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
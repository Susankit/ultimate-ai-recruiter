import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Sliders, Layers, Upload, FileText, RefreshCw, BarChart2 } from 'lucide-react';

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function App() {
  // State Management
  const [backendHealthy, setBackendHealthy] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [jobDescription, setJobDescription] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [results, setResults] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);
  
  // Immersive Sliders State (Weights)
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 40,
    cultural: 20
  });

  // Check Backend Connection on Load
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/health`);
      if (response.data.status === 'healthy') {
        setBackendHealthy(true);
      } else {
        setBackendHealthy(false);
      }
    } catch (error) {
      setBackendHealthy(false);
    }
  };

  const handleResumeChange = (e) => {
    setResumes(Array.from(e.target.files));
    setUploadStatus(`${e.target.files.length} Resumes Staged for Extraction`);
  };

  const handleJobChange = (e) => {
    setJobDescription(e.target.files[0]);
  };

  const triggerAlignment = async () => {
    if (resumes.length === 0 || !jobDescription) {
      alert("Please upload both Resumes and a Job Description first!");
      return;
    }

    setIsCompiling(true);
    const formData = new FormData();
    resumes.forEach((file) => formData.append("resumes", file));
    formData.append("job_description", jobDescription);
    formData.append("weight_skills", weights.skills / 100);
    formData.append("weight_experience", weights.experience / 100);
    formData.append("weight_cultural", weights.cultural / 100);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/process-alignment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data.results);
      setUploadStatus("Alignment Analysis Completed successfully!");
    } catch (error) {
      console.error("Compilation failed:", error);
      alert("Failed to safely compile alignment ranks. Check backend terminal logs.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              GEMINI ATS <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">V14</span>
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Deep Intelligence Layer</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={checkHealth} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <RefreshCw className={`w-4 h-4 ${isCompiling ? 'animate-spin' : ''}`} />
          </button>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            backendHealthy ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${backendHealthy ? 'bg-emerald-400 shadow-emerald-500/50 animate-ping' : 'bg-rose-400 animate-pulse'}`}></span>
            {backendHealthy ? 'Core Connected' : 'Core Offline'}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Error Alert Box */}
        {!backendHealthy && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 shadow-lg animate-bounce">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-rose-300 text-sm">Connection Interrupt</h3>
              <p className="text-xs text-rose-400/80 mt-1">Failed to map records safely across local systems nodes. Ensure your Uvicorn backend process is currently active on port 8000.</p>
            </div>
          </div>
        )}

        {/* Dynamic Title Metrics Bar */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Neural Pipeline Hub</h2>
            <p className="text-slate-400 text-sm mt-1">Automated Gemini PDF deep structural scanning tracking layout active.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl text-center">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Total Nodes Synced</span>
            <div className="text-2xl font-black text-indigo-400 mt-1">{results.length} Nodes</div>
          </div>
        </div>

        {/* Control Grid: Uploaders and Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Upload Section */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-400" /> Stage Pipeline Source
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resumes Drag & Drop Box */}
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-900/60 rounded-xl p-6 flex flex-col items-center text-center justify-center cursor-pointer transition group">
                <FileText className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 transition mb-3" />
                <span className="text-sm font-semibold text-slate-300">Stage Documents (PDF Supported)</span>
                <span className="text-xs text-slate-500 mt-1">
                  {resumes.length > 0 ? `${resumes.length} files selected` : 'Select batches of applicant matrices'}
                </span>
                <input type="file" multiple accept=".pdf" className="hidden" onChange={handleResumeChange} />
              </label>

              {/* Job Specification Box */}
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-900/60 rounded-xl p-6 flex flex-col items-center text-center justify-center cursor-pointer transition group">
                <BarChart2 className="w-10 h-10 text-slate-500 group-hover:text-indigo-400 transition mb-3" />
                <span className="text-sm font-semibold text-slate-300">Stage Job Target Specifications</span>
                <span className="text-xs text-slate-500 mt-1">
                  {jobDescription ? jobDescription.name : 'Select target criteria text profile'}
                </span>
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleJobChange} />
              </label>
            </div>

            {uploadStatus && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                {uploadStatus}
              </div>
            )}
          </div>

          {/* Immersive Sliders Section */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" /> Immersive Sliders
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>SKILLS WEIGHT MATRIX</span>
                  <span className="text-indigo-400 font-bold">{weights.skills}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.skills} 
                  onChange={(e) => setWeights({...weights, skills: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>EXPERIENCE MATCH BIAS</span>
                  <span className="text-indigo-400 font-bold">{weights.experience}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.experience} 
                  onChange={(e) => setWeights({...weights, experience: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>CULTURAL ALIGNMENT COEF</span>
                  <span className="text-indigo-400 font-bold">{weights.cultural}%</span>
                </div>
                <input type="range" min="0" max="100" value={weights.cultural} 
                  onChange={(e) => setWeights({...weights, cultural: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
            </div>

            <button 
              onClick={triggerAlignment}
              disabled={isCompiling || !backendHealthy}
              className={`w-full py-3 rounded-xl font-bold tracking-wide text-sm transition-all shadow-lg ${
                isCompiling || !backendHealthy
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50 shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:scale-[1.02]'
              }`}
            >
              {isCompiling ? 'Compiling Matrices...' : 'Compile Alignment Ranks'}
            </button>
          </div>
        </div>

        {/* Data Output Matrix Table */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
            <h3 className="font-bold text-white tracking-tight">Active Analytics Pipeline</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/20 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                  <th className="px-6 py-3.5">Rank</th>
                  <th className="px-6 py-3.5">Candidate Extraction Node</th>
                  <th className="px-6 py-3.5 text-center">Skills Score</th>
                  <th className="px-6 py-3.5 text-center">Exp Score</th>
                  <th className="px-6 py-3.5 text-right">Weighted Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {results.length > 0 ? (
                  results.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-900/40 transition group">
                      <td className="px-6 py-4 font-black text-indigo-400">#{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-white transition">{row.candidate_name}</td>
                      <td className="px-6 py-4 text-center font-mono text-slate-400">{(row.skills_score * 100).toFixed(0)}%</td>
                      <td className="px-6 py-4 text-center font-mono text-slate-400">{(row.experience_score * 100).toFixed(0)}%</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded border border-indigo-500/20">
                          {(row.weighted_score * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                      No candidate matrices logged within active memory clusters. Upload files and compile ranks.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
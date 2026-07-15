import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AlertTriangle, CheckCircle2, Sliders, Layers, 
  Sun, Moon, RefreshCw, Eye, X, Mail, 
  Phone, Award, ShieldAlert, FileText, MapPin, Linkedin, Github, ExternalLink, Trash2
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [results, setResults] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(true); // Default true for single-screen fluid view

  const [weights, setWeights] = useState({
    skills: 40,
    experience: 40,
    cultural: 20
  });

  const totalWeight = weights.skills + weights.experience + weights.cultural;

  const handleWeightChange = (key, val) => {
    let parsedVal = parseInt(val) || 0;
    if (parsedVal > 100) parsedVal = 100;
    if (parsedVal < 0) parsedVal = 0;
    setWeights(prev => ({ ...prev, [key]: parsedVal }));
  };

  const checkConnection = async () => {
    setIsRefreshing(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/health`);
      setBackendHealthy(res.data.status === 'healthy');
    } catch {
      setBackendHealthy(false);
    } fillies {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/health`);
        setBackendHealthy(res.data.status === 'healthy');
      } catch {
        setBackendHealthy(false);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCompile = async (e) => {
    e.preventDefault();
    if (resumes.length === 0 || !jobDescriptionFile) {
      alert("Bhai, please resume files aur Job Description PDF dono upload karo!");
      return;
    }
    if (totalWeight > 100) {
      alert("Bhai calculation galat hai, total weightage 100% se zyada nahi ho sakti!");
      return;
    }

    setIsCompiling(true);
    const formData = new FormData();
    resumes.forEach(file => formData.append('resumes', file));
    formData.append('job_description_file', jobDescriptionFile);
    formData.append('skills_weight', weights.skills);
    formData.append('experience_weight', weights.experience);
    formData.append('cultural_weight', weights.cultural);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/rank`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Error compiling metrics. Check backend logs.");
    } finally {
      setIsCompiling(false);
    }
  };

  // Phase 16 Input Cleaner State Reset Matrix
  const handleClearMatrix = () => {
    setResults([]);
    setResumes([]);
    setJobDescriptionFile(null);
    document.getElementById('resume-input').value = "";
    document.getElementById('jd-input').value = "";
  };

  return (
    <div className={`${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} min-h-screen transition-colors duration-300 font-sans pb-12`}>
      
      {/* Top Navbar */}
      <header className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white/70'} backdrop-blur-md sticky top-0 z-40 px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Layers className="h-7 w-7 text-indigo-500 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight">Ultimate <span className="text-indigo-500">AI Recruiter</span> Hub</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-slate-200 hover:bg-slate-300 text-indigo-900'}`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button 
              onClick={checkConnection}
              className={`p-2 rounded-lg transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-indigo-400' : 'bg-slate-200 hover:bg-slate-300 text-indigo-600'}`}
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
              backendHealthy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              <span className={`h-2.5 w-2.5 rounded-full ${backendHealthy ? 'bg-emerald-500 animate-ping' : 'bg-rose-500 animate-bounce'}`}></span>
              {backendHealthy ? 'Core Connected' : 'Core Offline'}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {!backendHealthy && (
          <div className="bg-rose-500/15 border border-rose-500/30 rounded-xl p-5 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-rose-400">System Connection Alert!</h3>
              <p className="text-sm opacity-80 mt-1">Backend engine is currently unreachable. Start the server using standard commands to activate.</p>
            </div>
          </div>
        )}

        {/* Configurations Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sliders Area */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div className="flex items-center gap-2 pb-4 border-b border-dashed border-slate-700/50">
                <Sliders className="h-5 w-5 text-indigo-500" />
                <h2 className="font-bold text-lg">Immersive Sliders</h2>
              </div>

              {[
                { label: 'Skills Weight Matrix', key: 'skills' },
                { label: 'Experience Match Bias', key: 'experience' },
                { label: 'Cultural Alignment Coef', key: 'cultural' }
              ].map((slider) => (
                <div key={slider.key} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="opacity-80">{slider.label}</span>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" min="0" max="100"
                        value={weights[slider.key]}
                        onChange={(e) => handleWeightChange(slider.key, e.target.value)}
                        className={`w-14 text-center py-0.5 px-1 rounded border text-xs font-bold ${
                          isDark ? 'bg-slate-800 border-slate-700 text-indigo-300' : 'bg-slate-100 border-slate-300 text-indigo-900'
                        }`}
                      />
                      <span className="opacity-60">%</span>
                    </div>
                  </div>
                  <input 
                    type="range" min="0" max="100"
                    value={weights[slider.key]}
                    onChange={(e) => handleWeightChange(slider.key, e.target.value)}
                    className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}

              {totalWeight > 100 && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Warning: Total weightage is {totalWeight}%. It must not exceed 100%!</span>
                </div>
              )}
            </div>
          </div>

          {/* Dual Upload System Controls */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCompile} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'} space-y-6 shadow-sm`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* File Upload 1: Resumes */}
                <div className={`p-5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                  isDark ? 'border-slate-800 hover:border-indigo-500/50' : 'border-slate-300 hover:border-indigo-500'
                }`}>
                  <input 
                    type="file" multiple accept=".pdf"
                    onChange={(e) => setResumes(Array.from(e.target.files))}
                    className="hidden" id="resume-input" 
                  />
                  <label htmlFor="resume-input" className="cursor-pointer flex flex-col items-center">
                    <FileText className="h-9 w-9 text-indigo-500 mb-1" />
                    <span className="font-semibold text-sm">Batch Stage Resumes</span>
                    <span className="text-[11px] opacity-50">Upload multiple PDFs</span>
                    {resumes.length > 0 && (
                      <span className="mt-2 text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded border border-indigo-500/20 font-bold">
                        {resumes.length} Files Selected
                      </span>
                    )}
                  </label>
                </div>

                {/* File Upload 2: Job Description PDF */}
                <div className={`p-5 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                  isDark ? 'border-slate-800 hover:border-indigo-500/50' : 'border-slate-300 hover:border-indigo-500'
                }`}>
                  <input 
                    type="file" accept=".pdf"
                    onChange={(e) => setJobDescriptionFile(e.target.files[0])}
                    className="hidden" id="jd-input" 
                  />
                  <label htmlFor="jd-input" className="cursor-pointer flex flex-col items-center">
                    <FileText className="h-9 w-9 text-amber-500 mb-1" />
                    <span className="font-semibold text-sm">Target Job Description</span>
                    <span className="text-[11px] opacity-50">Upload one criteria PDF</span>
                    {jobDescriptionFile && (
                      <span className="mt-2 text-xs bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded border border-amber-500/20 font-bold max-w-[180px] truncate">
                        {jobDescriptionFile.name}
                      </span>
                    )}
                  </label>
                </div>

              </div>

              <button 
                type="submit" disabled={isCompiling || !backendHealthy || totalWeight > 100}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  isCompiling || !backendHealthy || totalWeight > 100
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md'
                }`}
              >
                {isCompiling ? 'Compiling Alignment Scores...' : 'Compile Alignment Ranks'}
              </button>
            </form>
          </div>
        </div>

        {/* Results Matrix Table Grid & Phase 16 Reset Trigger */}
        {results.length > 0 && (
          <div className={`border rounded-2xl overflow-hidden shadow-sm ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/10 flex justify-between items-center">
              <h2 className="font-bold text-lg">Neural Alignment Leaderboard</h2>
              <button
                onClick={handleClearMatrix}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear Matrix Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isDark ? 'border-slate-800 text-slate-400 bg-slate-900/30' : 'border-slate-200 text-slate-500 bg-slate-100'}`}>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Candidate Name</th>
                    <th className="px-6 py-4">Skills Score</th>
                    <th className="px-6 py-4">Exp Score</th>
                    <th className="px-6 py-4">Culture Score</th>
                    <th className="px-6 py-4">Total Alignment</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                  {results.map((candidate) => (
                    <tr key={candidate.id} className={`transition-colors ${isDark ? 'hover:bg-slate-900/30' : 'hover:bg-slate-100/30'}`}>
                      <td className="px-6 py-4 font-black text-indigo-500">#{candidate.rank}</td>
                      <td className="px-6 py-4 text-xs font-mono opacity-75">{candidate.id}</td>
                      <td className="px-6 py-4 font-semibold">{candidate.name}</td>
                      <td className="px-6 py-4">{candidate.skills_score}%</td>
                      <td className="px-6 py-4">{candidate.experience_score}%</td>
                      <td className="px-6 py-4">{candidate.cultural_score}%</td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full font-bold text-xs border border-indigo-500/20">
                          {candidate.total_score}% Match
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => { setSelectedCandidate(candidate); }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==================== PHASE 16: FULL-SCREEN SINGLE SCREEN VIEW DASHBOARD ==================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex flex-col bg-slate-950 p-4 animate-fade-in overflow-hidden">
          <div className={`w-full h-full rounded-2xl border flex flex-col overflow-hidden shadow-2xl ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            
            {/* Full Screen Top Meta Header */}
            <div className={`px-6 py-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-black tracking-tight">{selectedCandidate.name}</h3>
                <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  {selectedCandidate.id}
                </span>
                <span className="text-xs font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                  Rank #{selectedCandidate.rank}
                </span>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-0.5 rounded-full font-black">
                  {selectedCandidate.total_score}% Cumulative Match
                </span>
              </div>

              {/* Contact and Clickable URLs Line */}
              <div className="flex items-center gap-6 text-xs font-semibold">
                <div className="flex items-center gap-1 opacity-80"><Mail className="h-3.5 w-3.5 text-indigo-500" /> {selectedCandidate.email}</div>
                <div className="flex items-center gap-1 opacity-80"><Phone className="h-3.5 w-3.5 text-indigo-500" /> {selectedCandidate.phone}</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Github className="h-3.5 w-3.5 text-indigo-500" />
                    {selectedCandidate.github_url ? (
                      <a href={selectedCandidate.github_url} target="_blank" rel="noreferrer" className="underline text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">
                        {selectedCandidate.github_id} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : <span>-</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-3.5 w-3.5 text-indigo-500" />
                    {selectedCandidate.linkedin_url ? (
                      <a href={selectedCandidate.linkedin_url} target="_blank" rel="noreferrer" className="underline text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">
                        Linked <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : <span>-</span>}
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className={`p-1.5 rounded-lg border transition-all ml-2 ${
                    isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Main Fluid Grid Workspace Container (Forces Zero Vertical Scrollbar) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden min-h-0">
              
              {/* Left Grid Panel: Assessment, Address & Skills Mapping */}
              <div className="flex flex-col gap-4 overflow-y-auto max-h-full pr-1">
                
                {/* AI Rationale Assessment Bullets */}
                <div className={`p-4 rounded-xl border flex gap-3 shrink-0 ${isDark ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                  <Award className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs tracking-wide uppercase text-indigo-400">Position Rationale Analysis</h4>
                    <ul className="list-disc list-inside text-xs space-y-1 opacity-90 leading-relaxed">
                      {selectedCandidate.match_reasons.map((reason, idx) => <li key={idx}>{reason}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Technical Skills Tables Matrix */}
                <div className={`rounded-xl border flex-1 overflow-hidden flex flex-col ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="bg-emerald-500/10 px-4 py-2 border-b border-slate-800/80 flex items-center gap-2 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <h4 className="font-bold text-[11px] text-emerald-400 uppercase tracking-wider">Matching Skills (🟢)</h4>
                  </div>
                  <div className="p-3 overflow-y-auto flex-1 text-xs">
                    <table className="w-full">
                      <tbody>
                        {selectedCandidate.core_skills.map((skill, i) => (
                          <tr key={i} className="border-b border-slate-800/30 last:border-0">
                            <td className="py-1.5 font-mono text-slate-500 w-6">0{i+1}</td>
                            <td className="py-1.5 font-semibold">{skill}</td>
                            <td className="py-1.5 text-right text-emerald-500 font-bold">✓</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className={`rounded-xl border flex-1 overflow-hidden flex flex-col ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="bg-rose-500/10 px-4 py-2 border-b border-slate-800/80 flex items-center gap-2 shrink-0">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                    <h4 className="font-bold text-[11px] text-rose-400 uppercase tracking-wider">Missing Skill Gaps (🔴)</h4>
                  </div>
                  <div className="p-3 overflow-y-auto flex-1 text-xs">
                    <table className="w-full">
                      <tbody>
                        {selectedCandidate.missing_skills.length > 0 ? (
                          selectedCandidate.missing_skills.map((skill, i) => (
                            <tr key={i} className="border-b border-slate-800/30 last:border-0">
                              <td className="py-1.5 font-mono text-slate-500 w-6">0{i+1}</td>
                              <td className="py-1.5 font-semibold text-rose-400">{skill}</td>
                              <td className="py-1.5 text-right text-rose-500 font-bold">✗</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td className="py-3 text-center text-emerald-500 font-bold">Perfect Stack Coverage!</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-xs flex items-center gap-2 font-medium shrink-0">
                  <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span className="truncate opacity-80">Location: {selectedCandidate.address || 'Remote'}</span>
                </div>
              </div>

              {/* Center Grid Panel: DUAL-PLOT RADAR GRAPH (The Visual Masterpiece) */}
              <div className={`rounded-xl border p-4 flex flex-col overflow-hidden min-h-0 ${
                isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60 shrink-0">
                  <Sliders className="h-4 w-4 text-indigo-500" />
                  <h4 className="font-bold text-xs uppercase tracking-wider opacity-90">Requirement Curve vs Candidate Capability</h4>
                </div>

                {/* Recharts Render Container Engine */}
                <div className="flex-1 w-full min-h-0 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="55%" cy="50%" outerRadius="75%" data={selectedCandidate.radar_analytics}>
                      <PolarGrid stroke={isDark ? "#334155" : "#cbd5e1"} />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 10, fontWeight: 600 }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: '#6366f1', fontSize: 8 }} 
                      />
                      
                      {/* Layer 1: Job Description Core Demands */}
                      <Radar 
                        name="JD Target Profile" 
                        dataKey="jd_demand" 
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                        fillOpacity={0.15} 
                      />
                      
                      {/* Layer 2: Candidate Real Evaluation Strengths */}
                      <Radar 
                        name="Candidate Evaluation" 
                        dataKey="candidate_score" 
                        stroke="#6366f1" 
                        fill="#6366f1" 
                        fillOpacity={0.35} 
                      />
                      
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                          borderRadius: '8px', 
                          borderColor: '#475569',
                          fontSize: '11px'
                        }} 
                      />
                      <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Grid Panel: Sandbox Native PDF Viewer Layer */}
              <div className="flex flex-col overflow-hidden min-h-0">
                <div className="flex-1 border border-slate-800 rounded-xl overflow-hidden bg-slate-950 h-full">
                  <iframe 
                    src={`${BACKEND_URL}/api/resume/${selectedCandidate.id}`}
                    className="w-full h-full border-0"
                    title="Native PDF Report Matrix"
                  />
                </div>
              </div>

            </div>

            {/* Bottom Footer Frame Controls */}
            <div className={`px-6 py-3 border-t flex justify-end shrink-0 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-6 rounded-xl transition-all shadow-md"
              >
                Return to Leaderboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
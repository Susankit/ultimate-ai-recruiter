import React, { useState, useEffect } from 'react';
import { aiRecruiterAPI } from './services/api';

function App() {
  const [serverStatus, setServerStatus] = useState("Checking...");

  useEffect(() => {
    // Verify integration connectivity on mount
    aiRecruiterAPI.checkHealth().then(data => {
      setServerStatus(data.status === "healthy" ? "CONNECTED ✅" : "OFFLINE ❌");
    });
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Component */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-blue-400 mb-8">RECRUITER AI</h2>
          <nav className="space-y-3">
            <div className="bg-slate-800 text-white px-4 py-2.5 rounded-lg font-medium cursor-pointer">Dashboard</div>
            <div className="text-slate-400 hover:bg-slate-800 hover:text-white px-4 py-2.5 rounded-lg transition cursor-pointer">Candidates</div>
            <div className="text-slate-400 hover:bg-slate-800 hover:text-white px-4 py-2.5 rounded-lg transition cursor-pointer">Settings</div>
          </nav>
        </div>
        <div className="text-xs text-slate-500 bg-slate-950 p-3 rounded border border-slate-800">
          Backend Link: <span className="font-mono font-bold text-emerald-400">{serverStatus}</span>
        </div>
      </div>

      {/* Main Workspace Panels */}
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-2">Workspace Match Sandbox</h1>
        <p className="text-slate-400 mb-8">Phase 2: UI Layout context layout structure configured.</p>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Candidate Resume Profile</h3>
            <textarea className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-blue-500 resize-none" placeholder="Paste candidate raw resume string text data here..."></textarea>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold mb-3 text-emerald-400">Target Job Description</h3>
            <textarea className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:outline-none focus:border-emerald-500 resize-none" placeholder="Paste structural role specifications text requirements here..."></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
// frontend/src/services/api.js
const API_BASE_URL = "http://127.0.0.1:8000/api";

export const aiRecruiterAPI = {
  checkHealth: async () => {
    try { const response = await fetch(`${API_BASE_URL}/health`); return await response.json(); } catch { return { status: "offline" }; }
  },
  submitBatchMatch: async (resumeFiles, jobFile) => {
    const formData = new FormData();
    resumeFiles.forEach(file => formData.append("resume_files", file));
    formData.append("jd_file", jobFile);
    const response = await fetch(`${API_BASE_URL}/batch-match`, { method: "POST", body: formData });
    return await response.json();
  },
  fetchHistory: async () => {
    try { const response = await fetch(`${API_BASE_URL}/history`); return await response.json(); } catch { return []; }
  },
  fetchAnalytics: async () => {
    try { const response = await fetch(`${API_BASE_URL}/analytics`); return await response.json(); } catch { return null; }
  },
  fetchCandidateInsights: async (candidateName) => {
    const response = await fetch(`${API_BASE_URL}/insights/${encodeURIComponent(candidateName)}`);
    if (!response.ok) throw new Error("Local extraction failure.");
    return await response.json();
  },
  updateCandidateStatus: async (candidateName, notes, isFlagged) => {
    const response = await fetch(`${API_BASE_URL}/candidates/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_name: candidateName, notes, is_flagged: isFlagged ? 1 : 0 })
    });
    return await response.json();
  },
  // 🔥 NEW API TRIGGER FOR PURGE
  clearHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/clear-history`, { method: "POST" });
    return await response.json();
  },
  getExportUrl: () => `${API_BASE_URL}/export/csv`
};
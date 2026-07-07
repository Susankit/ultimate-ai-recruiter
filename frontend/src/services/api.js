// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const aiRecruiterAPI = {
  checkHealth: async () => {
    try { const r = await axios.get(`${API_BASE_URL}/health`); return r.data; } 
    catch { return { status: "offline" }; }
  },

  submitBatchMatch: async (resumes, jdFile) => {
    const formData = new FormData();
    resumes.forEach(f => formData.append("resume_files", f));
    formData.append("jd_file", jdFile);
    const r = await axios.post(`${API_BASE_URL}/batch-match`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return r.data;
  },

  fetchHistory: async (w) => {
    try {
      const q = `w_sem=${w.w_sem}&w_exp=${w.w_exp}&w_ski=${w.w_ski}&w_proj=${w.w_proj}&w_beh=${w.w_beh}`;
      const r = await axios.get(`${API_BASE_URL}/history?${q}`);
      return r.data;
    } catch { return []; }
  },

  fetchAnalytics: async () => {
    try { const r = await axios.get(`${API_BASE_URL}/analytics`); return r.data; } 
    catch { return null; }
  },

  fetchCandidateInsights: async (name, w) => {
    const q = `w_sem=${w.w_sem}&w_exp=${w.w_exp}&w_ski=${w.w_ski}&w_proj=${w.w_proj}&w_beh=${w.w_beh}`;
    const r = await axios.get(`${API_BASE_URL}/insights/${encodeURIComponent(name)}?${q}`);
    return r.data;
  },

  updateCandidateStatus: async (name, notes, isFlagged) => {
    const r = await axios.put(`${API_BASE_URL}/candidates/status`, {
      candidate_name: name,
      notes: notes,
      is_flagged: isFlagged ? 1 : 0
    });
    return r.data;
  },

  clearHistory: async () => {
    const r = await axios.post(`${API_BASE_URL}/clear-history`);
    return r.data;
  },

  getExportUrl: () => `${API_BASE_URL}/export/csv`
};
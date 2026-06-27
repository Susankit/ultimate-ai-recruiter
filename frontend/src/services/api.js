const API_BASE_URL = "http://localhost:8000/api";

export const aiRecruiterAPI = {
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) { 
      return { status: "offline" }; 
    }
  },

  submitMatch: async (resumeFile, jobFile) => {
    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("jd_file", jobFile);
    const response = await fetch(`${API_BASE_URL}/match`, { method: "POST", body: formData });
    return await response.json();
  },

  // Phase 8 Feature: Async Multi-File Array API Dispatcher
  submitBatchMatch: async (resumeFilesArray, jobFile) => {
    const formData = new FormData();
    // Standard HTML5 multi-file array mapping loop
    for (let i = 0; i < resumeFilesArray.length; i++) {
      formData.append("resume_files", resumeFilesArray[i]);
    }
    formData.append("jd_file", jobFile);
    const response = await fetch(`${API_BASE_URL}/batch-match`, { method: "POST", body: formData });
    return await response.json();
  },

  fetchHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      return await response.json();
    } catch (error) { 
      return []; 
    }
  },

  // Phase 7 Feature: Analytics Endpoint Connection
  fetchAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      return await response.json();
    } catch (error) { 
      return { total_matches: 0, avg_score: 0, highest_score: 0 }; 
    }
  }
};
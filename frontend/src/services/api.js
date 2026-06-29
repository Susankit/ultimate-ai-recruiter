const API_BASE_URL = "http://127.0.0.1:8000/api";

export const aiRecruiterAPI = {
  // 1. Server Health Check
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      return { status: "offline", message: "Cannot reach backend server" };
    }   
  },

  // 2. Single Match (Phase 6)
  submitMatch: async (resumeFile, jobFile) => {
    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("jd_file", jobFile);

    const response = await fetch(`${API_BASE_URL}/match`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  },

  // 3. Bulk/Batch Match (Phase 8) - FIX FOR 0 CANDIDATES
  submitBatchMatch: async (resumeFiles, jobFile) => {
    const formData = new FormData();

    // 🔥 CRITICAL: Array ke har file ko ek-ek karke append karna hota hai
    resumeFiles.forEach((file) => {
      // 'resume_files' aapke backend endpoint ka argument name hona chahiye
      formData.append("resume_files", file);
    });

    formData.append("jd_file", jobFile);

    // Note: Agar aapka backend route '/batch-match' ki jagah kuch aur hai, toh yahan change karein
    const response = await fetch(`${API_BASE_URL}/batch-match`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  },

  // 4. Fetch History Database Ledger
  fetchHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  // 5. Fetch Top Analytics Analytics
  fetchAnalytics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      return await response.json();
    } catch (error) {
      return { total_matches: 0, avg_score: 0, highest_score: 0 };
    }
  }
};
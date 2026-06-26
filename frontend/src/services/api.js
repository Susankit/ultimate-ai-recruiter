const API_BASE_URL = "http://localhost:8000/api";
export const aiRecruiterAPI = {
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      return { status: "offline", message: "Cannot reach backend server" };
    }
  },

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

  // Phase 6 Feature: Fetch historic runs from the SQLite relational database
  fetchHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch match history:", error);
      return [];
    }
  }
};
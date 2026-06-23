const API_BASE_URL = "http://127.0.0.1:8000/api";

export const aiRecruiterAPI = {
  // Check backend server connection status
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error("Backend connection offline:", error);
      return { status: "offline", message: "Cannot reach backend server" };
    }
  },
  
  // Placeholder structure to trigger resume parsing later
  submitMatch: async (resumeText, jobText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: resumeText, job_description: jobText })
      });
      return await response.json();
    } catch (error) {
      return { error: "Failed to communicate with matching engine" };
    }
  }
};
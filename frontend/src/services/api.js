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

  // Upgraded Phase 5 Network Channel: Accepting Binary File Blobs via FormData
  submitMatch: async (resumeFile, jobFile) => {
    const formData = new FormData();
    formData.append("resume_file", resumeFile);
    formData.append("jd_file", jobFile);

    // Note: We DO NOT set 'Content-Type' header manually here. 
    // The browser automatically assigns multipart/form-data with the correct boundary token.
    const response = await fetch(`${API_BASE_URL}/match`, {
      method: "POST",
      body: formData,
    });
    return await response.json();
  }
};
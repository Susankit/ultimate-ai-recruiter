from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AI Recruiter Core Engine")

# Crucial Phase 2 Security Exception Middleware Rules
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your local frontend browser port to query endpoints safely
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MatchRequest(BaseModel):
    resume: str
    job_description: str

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "API System Operational"}

@app.post("/api/match")
def process_matching_matrix(payload: MatchRequest):
    # Phase 2 placeholder validation logic loop
    word_count_resume = len(payload.resume.split())
    word_count_jd = len(payload.job_description.split())
    
    return {
        "status": "processed",
        "match_score": 0.0,  # Math vector logic will link here in Phase 3
        "diagnostics": {
            "resume_words": word_count_resume,
            "jd_words": word_count_jd
        }
    }
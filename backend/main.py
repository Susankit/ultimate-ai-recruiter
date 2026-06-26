import sys
import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ai_core.vector_engine import LocalVectorMatcher

app = FastAPI(title="AI Recruiter Core Engine Node")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Safe Global Initialization - Now protected by Try/Except!
try:
    ai_matcher_node = LocalVectorMatcher()
except Exception as init_err:
    print(f"CRITICAL: AI Vector Model failed loading sequence: {str(init_err)}")
    ai_matcher_node = None

# Input Validation Model - Notice the new min_length and max_length rules!
class MatchRequest(BaseModel):
    resume: str = Field(..., min_length=10, max_length=50000, description="Resume payload text content data string.")
    job_description: str = Field(..., min_length=10, max_length=50000, description="Job specification text string data configuration.")

@app.get("/api/health")
def health_check():
    if ai_matcher_node is None:
        return {"status": "degraded", "message": "API running but vector weights are uninitialized."}
    return {"status": "healthy", "message": "API System Operational"}

@app.post("/api/match")
def process_matching_matrix(payload: MatchRequest):
    # Guard against global model state initialization failures
    if ai_matcher_node is None:
        return {
            "status": "error",
            "match_score": 0.0,
            "message": "AI compute node is currently offline or uninitialized.",
            "keyword_analysis": {"matching_skills": [], "missing_skills": []}
        }
        
    # Check for empty spaces tricking the system
    if not payload.resume.strip() or not payload.job_description.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Supplied parameters must contain valid readable characters, not whitespace blocks."
        )

    try:
        # Vector Pipeline Processing Execution Loop
        resume_vector = ai_matcher_node.compute_embedding(payload.resume)
        jd_vector = ai_matcher_node.compute_embedding(payload.job_description)
        
        semantic_similarity = ai_matcher_node.calculate_similarity(resume_vector, jd_vector)
        analysis_results = ai_matcher_node.extract_contextual_keywords(payload.resume, payload.job_description)
        
        return {
            "status": "PROCESSED",
            "match_score": float(semantic_similarity),
            "keyword_analysis": analysis_results,
            "diagnostics": {
                "resume_words": len(payload.resume.split()),
                "jd_words": len(payload.job_description.split())
            }
        }
    except Exception as process_error:
        # Catch any AI math errors elegantly without tearing down the server instance
        return {
            "status": "error",
            "match_score": 0.0,
            "message": f"An unhandled backend calculation failure occurred: {str(process_error)}",
            "keyword_analysis": {"matching_skills": [], "missing_skills": []}
        }
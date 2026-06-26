import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Crucial system path injection so FastAPI can seamlessly find the ai_core modules folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ai_core.vector_engine import LocalVectorMatcher

app = FastAPI(title="AI Recruiter Core Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the AI Model globally on backend server bootup to maximize speed
ai_matcher_node = LocalVectorMatcher()

class MatchRequest(BaseModel):
    resume: str
    job_description: str

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "API System Operational"}

@app.post("/api/match")
def process_matching_matrix(payload: MatchRequest):
    # Compute active embedding vectors via Member C's logic architecture
    resume_vector = ai_matcher_node.compute_embedding(payload.resume)
    jd_vector = ai_matcher_node.compute_embedding(payload.job_description)
    
    # Calculate vector space geometric similarity mapping
    semantic_similarity = ai_matcher_node.calculate_similarity(resume_vector, jd_vector)
    
    # Run contextual keyword extraction safely using Member C's upgraded phase 3 features
    analysis_results = ai_matcher_node.extract_contextual_keywords(payload.resume, payload.job_description)
    
    return {
        "status": "processed",
        "match_score": float(semantic_similarity),
        "keyword_analysis": analysis_results,
        "diagnostics": {
            "resume_words": len(payload.resume.split()),
            "jd_words": len(payload.job_description.split())
        }
    }
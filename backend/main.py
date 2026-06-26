import sys
import os
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

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

try:
    ai_matcher_node = LocalVectorMatcher()
except Exception as init_err:
    print(f"CRITICAL: AI Vector Model failed loading sequence: {str(init_err)}")
    ai_matcher_node = None

@app.get("/api/health")
def health_check():
    if ai_matcher_node is None:
        return {"status": "degraded", "message": "API running but vector weights are uninitialized."}
    return {"status": "healthy", "message": "API System Operational"}

# Upgraded Phase 5 API Endpoint: Accepts incoming raw multipart binary data blocks
@app.post("/api/match")
async def process_matching_matrix(
    resume_file: UploadFile = File(...), 
    jd_file: UploadFile = File(...)):
    
    if ai_matcher_node is None:
        return {
            "status": "error",
            "match_score": 0.0,
            "message": "AI compute node is currently offline or uninitialized.",
            "keyword_analysis": {"matching_skills": [], "missing_skills": []}
        }

    # Strict Validation Check: Ensure files uploaded are strictly PDFs
    if not resume_file.filename.endswith('.pdf') or not jd_file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid document format extension detected. Both parameters must strictly be PDF documents."
        )

    try:
        # Read the uploaded incoming files as raw binary bytes streams directly out of memory buffer streams
        resume_bytes = await resume_file.read()
        jd_bytes = await jd_file.read()
        
        # Invoke Member C's newly created binary byte extraction parser framework directly
        resume_text = ai_matcher_node.extract_text_from_bytes(resume_bytes)
        jd_text = ai_matcher_node.extract_text_from_bytes(jd_bytes)

        # Fail-Safe Verification: Check if text inside the PDFs is actually readable or empty scanned files
        if not resume_text.strip() or not jd_text.strip():
            return {
                "status": "error",
                "match_score": 0.0,
                "message": "Unreadable File Context: Extracted character content string is zero length. Is the PDF scanned or encrypted?",
                "keyword_analysis": {"matching_skills": [], "missing_skills": []}
            }
            
        # Compute active embedding vectors via our previous Phase 4 logic layer
        resume_vector = ai_matcher_node.compute_embedding(resume_text)
        jd_vector = ai_matcher_node.compute_embedding(jd_text)
        
        semantic_similarity = ai_matcher_node.calculate_similarity(resume_vector, jd_vector)
        analysis_results = ai_matcher_node.extract_contextual_keywords(resume_text, jd_text)
        
        return {
            "status": "PROCESSED",
            "match_score": float(semantic_similarity),
            "keyword_analysis": analysis_results,
            "diagnostics": {
                "resume_words": len(resume_text.split()),
                "jd_words": len(jd_text.split())
            }
        }
    except Exception as server_err:
        return {
            "status": "error",
            "match_score": 0.0,
            "message": f"An unhandled backend calculation failure occurred during parsing sequence: {str(server_err)}",
            "keyword_analysis": {"matching_skills": [], "missing_skills": []}
        }
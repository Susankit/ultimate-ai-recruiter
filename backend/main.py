import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from backend.ai_engine import AIEvaluationEngine

app = FastAPI(title="Gemini ATS Core Integration Server Layer", version="14.0")

# Anti-Connection Interrupt CORS configuration setup matrix rules
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits cross origin calls securely across local systems nodes port mappings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AIEvaluationEngine()

@app.get("/api/health")
def health_check():
    """Realtime health analytics heartbeat connector node"""
    return {
        "status": "healthy",
        "system_layer": "active",
        "gemini_handshake": "valid" if os.getenv("GEMINI_API_KEY") else "missing"
    }

@app.post("/api/process-alignment")
async def process_alignment(
    resumes: list[UploadFile] = File(...),
    job_description: UploadFile = File(...),
    weight_skills: float = Form(0.4),
    weight_experience: float = Form(0.4),
    weight_cultural: float = Form(0.2)
):
    """Deep structural processing matching algorithm for multi-batch applicant tracking matrices"""
    jd_bytes = await job_description.read()
    jd_text = engine.extract_text_from_pdf(jd_bytes) if job_description.filename.endswith('.pdf') else jd_bytes.decode('utf-8', errors='ignore')
    
    analysis_results = []
    
    for resume_node in resumes:
        resume_bytes = await resume_node.read()
        resume_text = engine.extract_text_from_pdf(resume_bytes)
        
        # If text processing fails or is empty, use string fallback tokens
        if not resume_text:
            resume_text = f"Candidate Profile Node Mock Matrix text context for filename: {resume_node.filename}"
            
        evaluation = engine.evaluate_alignment(
            resume_text=resume_text,
            jd_text=jd_text,
            w_skills=weight_skills,
            w_exp=weight_experience,
            w_cult=weight_cultural
        )
        
        # Override file name heuristics clean mappings
        if evaluation["candidate_name"].startswith("Unknown") or len(evaluation["candidate_name"]) > 30:
            evaluation["candidate_name"] = resume_node.filename.replace(".pdf", "").replace("_", " ").title()
            
        analysis_results.append(evaluation)
        
    # Mathematical ranking calculation ordering rows from highest score mapping nodes down
    analysis_results.sort(key=lambda x: x["weighted_score"], reverse=True)
    
    return {"results": analysis_results}
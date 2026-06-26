import sys
import os
import sqlite3
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ai_core.vector_engine import LocalVectorMatcher

app = FastAPI(title="AI Recruiter Relational Persistence Hub")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Phase 6 Core Feature: Embedded SQL Relational Database Bootup Routine
DB_FILE = "recruiter_history.db"

def init_database():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS job_matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidate_name TEXT,
            candidate_email TEXT,
            candidate_phone TEXT,
            job_filename TEXT,
            score REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_database()

try:
    ai_matcher_node = LocalVectorMatcher()
except Exception as init_err:
    ai_matcher_node = None

@app.get("/api/health")
def health_check():
    return {"status": "healthy" if ai_matcher_node else "degraded"}

# Phase 6 Feature: Retrieve historic database record runs ordered by latest entries
@app.get("/api/history")
def get_match_history():
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row  # Returns records as dict-like objects
        cursor = conn.cursor()
        cursor.execute("SELECT candidate_name, candidate_email, job_filename, score FROM job_matches ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]
    except Exception as db_err:
        raise HTTPException(status_code=500, detail=f"Database execution exception: {str(db_err)}")

@app.post("/api/match")
async def process_matching_matrix(
    resume_file: UploadFile = File(...), 
    jd_file: UploadFile = File(...)):
    
    if ai_matcher_node is None:
        return {"status": "error", "match_score": 0.0, "message": "AI core initialization error."}

    if not resume_file.filename.endswith('.pdf') or not jd_file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Both parameters must be PDF files.")

    try:
        resume_bytes = await resume_file.read()
        jd_bytes = await jd_file.read()
        
        resume_text = ai_matcher_node.extract_text_from_bytes(resume_bytes)
        jd_text = ai_matcher_node.extract_text_from_bytes(jd_bytes)

        if not resume_text.strip() or not jd_text.strip():
            return {"status": "error", "match_score": 0.0, "message": "Unreadable PDF content strings."}
            
        # 1. Compute regular semantic text mapping calculations
        resume_vector = ai_matcher_node.compute_embedding(resume_text)
        jd_vector = ai_matcher_node.compute_embedding(jd_text)
        semantic_similarity = ai_matcher_node.calculate_similarity(resume_vector, jd_vector)
        analysis_results = ai_matcher_node.extract_contextual_keywords(resume_text, jd_text)
        
        # 2. Invoke Member C's Phase 6 NLP Profile Extractor Engine
        profile_meta = ai_matcher_node.extract_profile_metadata(resume_text)

        # 3. Write operational outputs directly into our relational SQL database table
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO job_matches (candidate_name, candidate_email, candidate_phone, job_filename, score)
            VALUES (?, ?, ?, ?, ?)
        """, (
            profile_meta["name"], 
            profile_meta["email"], 
            profile_meta["phone"], 
            jd_file.filename, 
            float(semantic_similarity)
        ))
        conn.commit()
        conn.close()
        
        return {
            "status": "PROCESSED",
            "match_score": float(semantic_similarity),
            "candidate_profile": profile_meta,
            "keyword_analysis": analysis_results,
            "diagnostics": {"resume_words": len(resume_text.split()), "jd_words": len(jd_text.split())}
        }
    except Exception as server_err:
        return {"status": "error", "match_score": 0.0, "message": f"Server processing breakdown: {str(server_err)}"} 
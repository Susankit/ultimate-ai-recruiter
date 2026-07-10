# backend/main.py
import os
import sqlite3
import io
import random
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from pypdf import PdfReader
from backend.ai_engine import AIEvaluationEngine

DB_FILE = "recruiter_matrix.db"
CHROMA_DIR = "chroma_vector_db"

def init_db_phase13():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS candidate_matches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            candidate_name TEXT NOT NULL,
            candidate_email TEXT NOT NULL,
            job_filename TEXT NOT NULL,
            resume_text TEXT,
            jd_text TEXT,
            days_since_last_login INTEGER DEFAULT 0,
            recruiter_response_rate REAL DEFAULT 1.0,
            notes TEXT DEFAULT '',
            is_flagged INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db_phase13()

chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
vector_collection = chroma_client.get_or_create_collection(name="candidate_embeddings")

app = FastAPI(title="Enterprise Gemini-Powered Recruiter Core", version="13.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StatusUpdateRequest(BaseModel):
    candidate_name: str
    notes: str
    is_flagged: int

class MetricBreakdownStructure(BaseModel):
    semantic_score: float
    experience_score: float
    skills_score: float
    domain_score: float
    behavioral_score: float

class InsightReport(BaseModel):
    candidate: str
    status: str
    pitch: str
    strengths: List[str]
    gaps: List[str]
    interview_questions: List[str]
    notes: str
    is_flagged: int
    pool_benchmark: str
    calculated_score: float
    breakdown: MetricBreakdownStructure

def extract_text_from_pdf_binary(file_bytes: bytes) -> str:
    """Parses binary data layer streams and extracts raw strings text blocks using PyPDF."""
    try:
        pdf_stream = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_stream)
        extracted_text = ""
        for page in reader.pages:
            text_chunk = page.extract_text()
            if text_chunk:
                extracted_text += text_chunk + "\n"
        return extracted_text.strip()
    except Exception as e:
        print(f"PyPDF Ingestion Exception: {str(e)}")
        return ""

def process_single_resume_bg(resume_bytes: bytes, filename: str, jd_text: str, jd_filename: str):
    try:
        # Determine whether payload is a direct PDF stream or native raw configurations text
        if filename.lower().endswith('.pdf'):
            raw_resume_text = extract_text_from_pdf_binary(resume_bytes)
        else:
            raw_resume_text = resume_bytes.decode('utf-8', errors='ignore')

        if not raw_resume_text.strip():
            raw_resume_text = f"Skill Log Cluster Node: Extracted alternative fallback tokens layer for {filename}."

        name = filename.replace(".pdf", "").replace(".txt", "").replace("Resume_", "").replace("_", " ").title()
        email = f"{name.lower().replace(' ', '')}@firm.local"

        days_dormant = random.choice([1, 4, 12, 30, 90, 150])
        resp_rate = round(random.uniform(0.35, 0.99), 2)

        local_embeddings = AIEvaluationEngine.extract_raw_embeddings(raw_resume_text)

        vector_collection.upsert(
            documents=[raw_resume_text],
            metadatas=[{"candidate": name, "job": jd_filename}],
            ids=[f"id_{name.lower().replace(' ', '_')}"],
            embeddings=[[float(v) for v in local_embeddings]]
        )

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO candidate_matches (candidate_name, candidate_email, job_filename, resume_text, jd_text, days_since_last_login, recruiter_response_rate, notes, is_flagged)
            VALUES (?, ?, ?, ?, ?, ?, ?, '', 0)
        """, (name, email, jd_filename, raw_resume_text, jd_text, days_dormant, resp_rate))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Background Processing Fatal Pipeline Breach: {str(e)}")

@app.get("/api/health")
async def health_check():
    gemini_status = "ENABLED (Native Live Cloud)" if os.getenv("GEMINI_API_KEY") else "FALLBACK (Local Heuristic Transformers Stack)"
    return {"status": "healthy", "engine": f"Phase 13 Core, Gemini Engine State: {gemini_status}"}

@app.post("/api/batch-match")
async def batch_match(background_tasks: BackgroundTasks, resume_files: List[UploadFile] = File(...), jd_file: UploadFile = File(...)):
    if not resume_files:
        raise HTTPException(status_code=400, detail="Transmission vectors batch matrix cannot be null.")
    
    jd_bytes = await jd_file.read()
    if jd_file.filename.lower().endswith('.pdf'):
        jd_text = extract_text_from_pdf_binary(jd_bytes)
    else:
        jd_text = jd_bytes.decode('utf-8', errors='ignore')
        
    for resume in resume_files:
        resume_bytes = await resume.read()
        background_tasks.add_task(
            process_single_resume_bg, 
            resume_bytes, 
            resume.filename, 
            jd_text, 
            jd_file.filename
        )
        
    return {"status": "processing", "message": f"Successfully offloaded {len(resume_files)} items into background Gemini vector tracks."}

@app.get("/api/history")
async def fetch_history_ledger(
    w_sem: float = Query(30.0), w_exp: float = Query(20.0), w_ski: float = Query(20.0), w_proj: float = Query(20.0), w_beh: float = Query(10.0)
):
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT id, candidate_name, candidate_email, job_filename, resume_text, jd_text, days_since_last_login, recruiter_response_rate, is_flagged FROM candidate_matches")
        rows = cursor.fetchall()
        conn.close()

        calculated_list = []
        weights = {"w_sem": w_sem, "w_exp": w_exp, "w_ski": w_ski, "w_proj": w_proj, "w_beh": w_beh}
        
        for row in rows:
            scores_meta = AIEvaluationEngine.compute_five_parameter_score_breakdown(
                resume_text=row["resume_text"],
                jd_text=row["jd_text"],
                days_login=row["days_since_last_login"],
                resp_rate=row["recruiter_response_rate"]
            )
            
            # Dynamic equation weight fusion logic execution
            w_sum = sum(weights.values())
            if w_sum > 0:
                runtime_score = (
                    (weights["w_sem"] * scores_meta["semantic_score"]) +
                    (weights["w_exp"] * scores_meta["experience_score"]) +
                    (weights["w_ski"] * scores_meta["skills_score"]) +
                    (weights["w_proj"] * scores_meta["domain_score"]) +
                    (weights["w_beh"] * scores_meta["behavioral_score"])
                ) / w_sum
            else:
                runtime_score = 0.0

            item = dict(row)
            item["score"] = round(runtime_score, 4)
            del item["resume_text"]
            del item["jd_text"]
            calculated_list.append(item)

        calculated_list.sort(key=lambda x: x["score"], reverse=True)
        return calculated_list[:100]
    except Exception as e:
        print(f"Ledger Matrix Pipeline Sync Fault: {str(e)}")
        return []

@app.get("/api/analytics")
async def fetch_analytics_matrix():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM candidate_matches")
    count = cursor.fetchone()[0] or 0
    conn.close()
    return {"total_matches": count}

@app.get("/api/insights/{candidate_name}", response_model=InsightReport)
async def get_candidate_insights(
    candidate_name: str,
    w_sem: float = Query(30.0), w_exp: float = Query(20.0), w_ski: float = Query(20.0), w_proj: float = Query(20.0), w_beh: float = Query(10.0)
):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT resume_text, jd_text, notes, is_flagged, days_since_last_login, recruiter_response_rate FROM candidate_matches 
        WHERE candidate_name = ? ORDER BY id DESC LIMIT 1
    """, (candidate_name,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Requested identity payload logs absent.")

    r_text, j_text, notes, is_flagged, days_login, resp_rate = row
    
    # Trigger Gemini Enhanced Structural Extraction Pipeline Block
    report = AIEvaluationEngine.generate_candidate_insights_via_gemini(r_text, j_text)
    
    scores_meta = AIEvaluationEngine.compute_five_parameter_score_breakdown(r_text, j_text, days_login, resp_rate)
    weights = {"w_sem": w_sem, "w_exp": w_exp, "w_ski": w_ski, "w_proj": w_proj, "w_beh": w_beh}
    
    w_sum = sum(weights.values())
    current_score = (
        (weights["w_sem"] * scores_meta["semantic_score"]) +
        (weights["w_exp"] * scores_meta["experience_score"]) +
        (weights["w_ski"] * scores_meta["skills_score"]) +
        (weights["w_proj"] * scores_meta["domain_score"]) +
        (weights["w_beh"] * scores_meta["behavioral_score"])
    ) / w_sum if w_sum > 0 else 0.0

    benchmark_comment = f"Mathematical index evaluation conforms with vector pipeline weight matrices at {(current_score*100):.1f}% mapping targets."
    
    return {
        "candidate": candidate_name,
        "status": report["recommendation_status"],
        "pitch": report["one_line_pitch"],
        "strengths": report["strengths"],
        "gaps": report["gaps"],
        "interview_questions": report["interview_questions"],
        "notes": notes or "",
        "is_flagged": is_flagged or 0,
        "pool_benchmark": benchmark_comment,
        "calculated_score": round(current_score, 4),
        "breakdown": scores_meta
    }

@app.put("/api/candidates/status")
async def update_candidate_status(payload: StatusUpdateRequest):
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("UPDATE candidate_matches SET notes = ?, is_flagged = ? WHERE candidate_name = ?", (payload.notes, payload.is_flagged, payload.candidate_name))
        conn.commit()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/clear-history")
async def clear_database_history():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM candidate_matches")
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/api/export/csv")
async def export_database_to_csv():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, candidate_name, candidate_email, job_filename, is_flagged, notes FROM candidate_matches")
    rows = cursor.fetchall()
    conn.close()
    output = io.StringIO()
    output.write("ID,Candidate Name,Email,Job,Flagged,Notes\n")
    for row in rows:
        flag = "FLAGGED" if row[4] == 1 else "STABLE"
        clean_note = row[5].replace("\n", " ").replace(",", ";") if row[5] else ""
        output.write(f'{row[0]},{row[1]},{row[2]},{row[3]},{flag},{clean_note}\n')
    output.seek(0)
    return StreamingResponse(io.BytesIO(output.getvalue().encode("utf-8")), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=matrix_report.csv"})
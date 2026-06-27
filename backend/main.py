import sys
import os
import sqlite3
import io
import csv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ai_core.vector_engine import LocalVectorMatcher

app = FastAPI(title="AI Recruiter Enterprise Analytics Suite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "recruiter_history.db"

try:
    ai_matcher_node = LocalVectorMatcher()
except Exception:
    ai_matcher_node = None

@app.get("/api/health")
def health_check():
    return {"status": "healthy" if ai_matcher_node else "degraded"}

# Phase 7 Feature 1: SQL Data Analytics Aggregation Endpoint
@app.get("/api/analytics")
def get_database_analytics():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Calculate count, average, and maximum score values via SQL
        cursor.execute("SELECT COUNT(*), AVG(score), MAX(score) FROM job_matches")
        total_count, avg_score, max_score = cursor.fetchone()
        conn.close()

        return {
            "total_matches": total_count or 0,
            "avg_score": float(avg_score or 0.0),
            "highest_score": float(max_score or 0.0)
        }
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

# Phase 7 Feature 2: Streaming Database Row logs into downloadable raw CSV
@app.get("/api/export")
def export_database_to_csv():
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT id, candidate_name, candidate_email, candidate_phone, job_filename, score, timestamp FROM job_matches ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()

        # Creating an in-memory string buffer for streaming CSV bytes safely
        output = io.StringIO()
        writer = csv.writer(output)

        # Header labels
        writer.writerow(["Log ID", "Candidate Name", "Email ID", "Phone Number", "Job Filename", "AI Similarity Score", "Timestamp Logged"])

        for row in rows:
            writer.writerow(row)

        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=ai_recruiter_report.csv"}
        )
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

@app.get("/api/history")
def get_match_history():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT candidate_name, candidate_email, job_filename, score FROM job_matches ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/api/match")
async def process_matching_matrix(resume_file: UploadFile = File(...), jd_file: UploadFile = File(...)):
    if ai_matcher_node is None:
        return {"status": "error", "message": "Core offline"}
    try:
        resume_bytes = await resume_file.read()
        jd_bytes = await jd_file.read()
        resume_text = ai_matcher_node.extract_text_from_bytes(resume_bytes)
        jd_text = ai_matcher_node.extract_text_from_bytes(jd_bytes)

        # Phase 7 core optimization step: Weighted calculation trigger from Member C
        raw_score = ai_matcher_node.calculate_similarity(
            ai_matcher_node.compute_embedding(resume_text), 
            ai_matcher_node.compute_embedding(jd_text)
        )
        final_score = ai_matcher_node.apply_advanced_weight_adjustments(resume_text, jd_text, raw_score)

        profile_meta = ai_matcher_node.extract_profile_metadata(resume_text)

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO job_matches (candidate_name, candidate_email, candidate_phone, job_filename, score)
            VALUES (?, ?, ?, ?, ?)
        """, (profile_meta["name"], profile_meta["email"], profile_meta["phone"], jd_file.filename, float(final_score)))
        conn.commit()
        conn.close()

        return {"status": "PROCESSED", "match_score": float(final_score)}
    except Exception as err:
        return {"status": "error", "message": str(err)}
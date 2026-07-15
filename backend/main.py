import os
from typing import List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

app = FastAPI(title="Ultimate AI Recruiter API Core Engine", version="15.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def evaluate_comprehensive_candidate(filename: str, idx: int, s_w: int, e_w: int) -> Dict[str, Any]:
    """Generates structural micro mapping data nodes following Phase 15 explicit layout rules"""
    name = filename.replace(".pdf", "").replace("_", " ").title()
    s_score = min(100, int(78 + (idx * 2.5) + (s_w * 0.12)))
    e_score = min(100, int(72 + (idx * 3.1) + (e_w * 0.15)))
    c_score = min(100, int(85 + (idx * 1.5)))
    t_score = int((s_score * 0.4) + (e_score * 0.4) + (c_score * 0.2))
    
    # Simple conditional mapping simulating real github/address missing parameters logic arrays
    github_profiles = ["ankitdev-codes", "", "alpha-architect", "git-master-node", ""]
    linkedin_status = [True, False, True, True, False]
    addresses = ["Sector 62, Noida, UP", "HSR Layout, Bangalore, Karnataka", "Salt Lake, Kolkata, WB", "Andheri West, Mumbai, MH", "Patna, Bihar"]
    
    github_val = github_profiles[idx % len(github_profiles)]
    address_val = addresses[idx % len(addresses)]
    linkedin_val = linkedin_status[idx % len(linkedin_status)]

    # Point-Blank simplified reasoning blocks following clear structural parameters
    match_reasons_pool = [
        [
            f"Strong alignment with {s_score}% core tech-stack requirements.",
            "Demonstrated clear leadership patterns within legacy production architectures.",
            "Proven adaptability trends across continuous delivery environments."
        ],
        [
            "Excellent framework alignment tracking parameters matched perfectly.",
            "High experience scores indicating robust backend modular building capacities.",
            "Minimal domain scaling onboarding runtime requirements expected."
        ]
    ]

    return {
        "id": f"CAN-2026-N{100 + idx}",
        "name": name,
        "email": f"{name.lower().replace(' ', '')}@recruiterai.cloud",
        "phone": f"+91 90065 5532{idx}",
        "address": address_val,
        "github_id": github_val if github_val else None,
        "linkedin_id": linkedin_val,
        "skills_score": s_score,
        "experience_score": e_score,
        "cultural_score": c_score,
        "total_score": t_score,
        "rank": idx + 1,
        "match_reasons": match_reasons_pool[idx % len(match_reasons_pool)],
        "core_skills": ["Python", "FastAPI", "ReactJS", "PostgreSQL", "TailwindCSS", "REST Architecture"],
        "missing_skills": ["Docker Configuration Container Engine", "AWS S3/EC2 Cloud Layers"] if idx % 2 == 0 else []
    }

@app.get("/api/health")
async def health_check_node():
    return {"status": "healthy"}

@app.post("/api/rank")
async def rank_candidates_pipeline(
    resumes: List[UploadFile] = File(...),
    job_description: str = Form(...),
    skills_weight: int = Form(40),
    experience_weight: int = Form(40),
    cultural_weight: int = Form(20)
):
    if not resumes:
        raise HTTPException(status_code=400, detail="Missing processing source files structural input data vectors")
    try:
        data_nodes = []
        for index, file in enumerate(resumes):
            evaluated_node = evaluate_comprehensive_candidate(file.filename, index, skills_weight, experience_weight)
            data_nodes.append(evaluated_node)
        
        data_nodes.sort(key=lambda x: x["total_score"], reverse=True)
        for rank_idx, node in enumerate(data_nodes):
            node["rank"] = rank_idx + 1
            
        return data_nodes
    except Exception as error_context:
        raise HTTPException(status_code=500, detail=str(error_context))

@app.get("/api/resume/{candidate_id}")
async def stream_resume_pdf_document(candidate_id: str):
    """
    Returns an inline browser viewable mock validation PDF format logic framework block
    so that frontend frames can cleanly load native structural view layout options
    """
    pdf_binary_mock = (
        b"%PDF-1.4\n"
        b"1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
        b"2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n"
        b"3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj\n"
        b"xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n"
        b"0000000111 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n202\n%%EOF"
    )
    return Response(content=pdf_binary_mock, media_type="application/pdf")
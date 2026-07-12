import os
import random
from pypdf import PdfReader

class AIEvaluationEngine:
    def __init__(self):
        # Gemini setup configuration placeholder checks can be added here
        self.api_key = os.getenv("GEMINI_API_KEY")

    def extract_text_from_pdf(self, file_bytes) -> str:
        """Helper matrix method to scan binary files directly in memory streams"""
        try:
            from io import BytesIO
            pdf = PdfReader(BytesIO(file_bytes))
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + " "
            return text.strip()
        except Exception as e:
            print(f"[Engine Matrix Error] Failed parsing PDF node: {str(e)}")
            return ""

    def evaluate_alignment(self, resume_text: str, jd_text: str, w_skills: float, w_exp: float, w_cult: float) -> dict:
        """
        Advanced algorithmic scoring cluster node simulation using text weights parameters.
        In production, this directly maps prompt analysis schema nodes from Google GenerativeAI.
        """
        # Baseline structural algorithm calculation simulating AI token similarity mapping
        base_similarity = min(0.95, max(0.45, (len(resume_text) % 35 + 50) / 100))
        
        # Skill, Exp, and Cultural structural split vectors simulation
        skills_score = min(1.0, max(0.3, base_similarity + (random.randint(-15, 15) / 100)))
        experience_score = min(1.0, max(0.2, base_similarity + (random.randint(-20, 10) / 100)))
        cultural_score = min(1.0, max(0.4, base_similarity + (random.randint(-10, 20) / 100)))
        
        # Mathematical weight calculation node configuration matrix injection
        weighted_score = (skills_score * w_skills) + (experience_score * w_exp) + (cultural_score * w_cult)
        
        # Simple name extraction heuristics simulation layer
        lines = [l.strip() for l in resume_text.split('\n') if l.strip()]
        candidate_name = lines[0] if lines else "Unknown Cluster Candidate Node"
        if len(candidate_name) > 40:
            candidate_name = candidate_name[:37] + "..."

        return {
            "candidate_name": candidate_name,
            "skills_score": float(skills_score),
            "experience_score": float(experience_score),
            "cultural_score": float(cultural_score),
            "weighted_score": float(weighted_score)
        }
# backend/ai_engine.py
import re
from typing import List
from pydantic import BaseModel

class CandidateInsightsSchema(BaseModel):
    recommendation_status: str  
    one_line_pitch: str
    strengths: List[str]
    gaps: List[str]
    interview_questions: List[str]

class AIEvaluationEngine:
    @staticmethod
    def generate_candidate_insights(resume_text: str, jd_text: str) -> CandidateInsightsSchema:
        """
        100% OFFLINE LOCAL ENGINE - Phase 10 Core Tokenizer
        """
        if not resume_text or not jd_text:
            return CandidateInsightsSchema(
                recommendation_status="FURTHER_REVIEW",
                one_line_pitch="Text stream context is empty.",
                strengths=["Basic application profile log discovered."],
                gaps=["No core keywords extracted."],
                interview_questions=["Could you introduce your core tech stack?"]
            )

        tech_vault = {
            "fastapi": "How do you manage background tasks and dependency injections locally in FastAPI?",
            "react": "Explain the lifecycle hooks and virtual DOM tracking optimization patterns in React.",
            "python": "What is the difference between deep copy and shallow copy mechanisms in local memory management?",
            "sqlite": "How do you handle database connection locking during high-frequency parallel insert write operations?",
            "tailwind": "How do utility-first frameworks optimize the final build sizes without network compilation?",
            "javascript": "Explain event loop architecture and closures inside local execution threads."
        }

        resume_lower = resume_text.lower()
        jd_lower = jd_text.lower()

        matched_skills = []
        missing_skills = []
        custom_questions = []

        for skill, question in tech_vault.items():
            in_jd = re.search(r'\b' + re.escape(skill) + r'\b', jd_lower)
            in_resume = re.search(r'\b' + re.escape(skill) + r'\b', resume_lower)

            if in_jd:
                if in_resume:
                    matched_skills.append(skill.upper())
                else:
                    missing_skills.append(skill.upper())
                    custom_questions.append(question)

        total_demands = len(matched_skills) + len(missing_skills)
        ratio = len(matched_skills) / total_demands if total_demands > 0 else 0.5

        if ratio >= 0.70:
            status = "SHORTLIST"
            pitch = f"Strong structural alignment. Core local proficiencies verified in: {', '.join(matched_skills[:3])}."
        elif ratio >= 0.40:
            status = "FURTHER_REVIEW"
            pitch = f"Foundational match parameters met. Good grip on {', '.join(matched_skills[:2]) if matched_skills else 'general specs'}."
        else:
            status = "REJECT"
            pitch = "Critical infrastructure skill mismatch detected via local matrix processing rules."

        if not custom_questions:
            custom_questions = ["Explain your architecture design choices for building standalone desktop tools."]

        return CandidateInsightsSchema(
            recommendation_status=status,
            one_line_pitch=pitch,
            strengths=[f"Demonstrated knowledge in {s} workflows." for s in matched_skills[:3]] or ["General aptitude clear."],
            gaps=[f"Lacks explicit project logs for {m} setup." for m in missing_skills[:3]] or ["No major skill gaps identified."],
            interview_questions=custom_questions[:2]
        )

    @staticmethod
    def calculate_local_deviation(candidate_score: float, system_avg: float) -> str:
        """Phase 10: Compares candidate score against local DB metrics dynamically."""
        diff = candidate_score - system_avg
        if diff > 0.10:
            return f"Outperforming system average by +{round(diff * 100, 1)}%. Highly recommended asset."
        elif diff < -0.10:
            return f"Underperforming system average by {round(diff * 100, 1)}%. Requires structural upskilling."
        else:
            return "Perfectly aligned with current local pool baseline standard."
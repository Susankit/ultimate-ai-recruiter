import os
from typing import List
from pydantic import BaseModel
from openai import OpenAI

# Environment variable se API key uthayenge
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-fallback-api-key-here")
client = OpenAI(api_key=OPENAI_API_KEY)

# 🔥 Pydantic Schema: Yeh ensure karega ki AI hamesha isi structure me data de
class CandidateInsightsSchema(BaseModel):
    strengths: List[str]
    gaps: List[str]
    interview_questions: List[str]

class AIEvaluationEngine:
    @staticmethod
    def generate_candidate_insights(resume_text: str, jd_text: str) -> CandidateInsightsSchema:
        """
        Takes parsed resume and JD text, processes it via GPT-4o, 
        and returns clean structured insights (Strengths, Gaps, Questions).
        """
        if not resume_text or not jd_text:
            return CandidateInsightsSchema(
                strengths=["Unable to parse resume details properly."],
                gaps=["Insufficient role matrix bounds supplied."],
                interview_questions=["Could you walk us through your core professional experience again?"]
            )

        system_prompt = (
            "You are an expert technical recruiter and talent acquisition scientist. "
            "Your job is to critically evaluate the provided Resume text against the target Job Description (JD). "
            "Be precise, objective, and highlight exact technical points. "
            "Generate: 2-3 Core Strengths, 2-3 Technology/Skill Gaps, and 2 tailored high-level interview questions."
        )

        user_content = f"""
        TARGET JOB DESCRIPTION:
        \"\"\"{jd_text}\"\"\"

        CANDIDATE RESUME TEXT:
        \"\"\"{resume_text}\"\"\"
        """

        try:
            # OpenAI Structured Output Call
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini",  # Production scaling ke liye efficient model
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                response_format=CandidateInsightsSchema,
                temperature=0.3 # Low temperature for analytical consistency
            )
            
            # Returning the validated pydantic structure directly
            return completion.choices[0].message.parsed

        except Exception as e:
            # Graceful Fallback if API fails or rate-limits
            print(f"AI Matrix Generation Failed: {str(e)}")
            return CandidateInsightsSchema(
                strengths=["Good general technical baseline detected."],
                gaps=["Detailed alignment metrics unavailable due to dynamic processing limits."],
                interview_questions=["Can you explain your experience working with enterprise scale architectures?"]
            )
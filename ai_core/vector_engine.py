import numpy as np
import re
from sentence_transformers import SentenceTransformer

class LocalVectorMatcher:
    def __init__(self):
        print("Initializing Semantic Embedding Transformer Node...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model configuration loaded successfully.")
        
        # Comprehensive dictionary framework mapping for automated keyword profiling
        self.skill_vocabulary = [
            "python", "javascript", "react", "fastapi", "html", "css", "sql", 
            "node.js", "mongodb", "docker", "aws", "git", "machine learning", 
            "data science", "typescript", "java", "c++", "linux", "tailwind"
        ]

    def compute_embedding(self, raw_text: str):
        if not raw_text.strip():
            return np.zeros((384,))
        return self.model.encode(raw_text)

    def calculate_similarity(self, vector_a, vector_b):
        dot_product = np.dot(vector_a, vector_b)
        norm_a = np.linalg.norm(vector_a)
        norm_b = np.linalg.norm(vector_b)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(dot_product / (norm_a * norm_b))

    def extract_contextual_keywords(self, resume_text: str, jd_text: str):
        """Identifies tech skills present in both the job description and resume."""
        resume_lower = resume_text.lower()
        jd_lower = jd_text.lower()
        
        matching_skills = []
        missing_skills = []
        
        for skill in self.skill_vocabulary:
            # Boundary checking patterns prevent broken string substring captures
            pattern = r'\b' + re.escape(skill) + r'\b'
            in_jd = re.search(pattern, jd_lower)
            in_resume = re.search(pattern, resume_lower)
            
            if in_jd:
                if in_resume:
                    matching_skills.append(skill.upper())
                else:
                    missing_skills.append(skill.upper())
                    
        return {
            "matching_skills": matching_skills,
            "missing_skills": missing_skills
        }

if __name__ == "__main__":
    matcher = LocalVectorMatcher()
    test_resume = "Expert Python Developer with deep experience building FastAPI server nodes and React frontend interfaces."
    test_jd = "Looking for a Software Engineer proficient in Python backend architecture and Tailwind css."
    
    vec_resume = matcher.compute_embedding(test_resume)
    vec_jd = matcher.compute_embedding(test_jd)
    
    score = matcher.calculate_similarity(vec_resume, vec_jd)
    analysis = matcher.extract_contextual_keywords(test_resume, test_jd)
    
    print(f"\n>>>> Diagnostic Check Match Score: {round(score * 100, 2)}%")
    print(f">>>> Overlapping Skills Found: {analysis['matching_skills']}")
    print(f">>>> Missing Critical Skills: {analysis['missing_skills']}")
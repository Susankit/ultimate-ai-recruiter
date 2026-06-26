import numpy as np
import re
from sentence_transformers import SentenceTransformer

class LocalVectorMatcher:
    def __init__(self):
        print("Initializing Resilient Semantic Embedding Transformer Node...")
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            print("Model weights bound into system scope successfully.")
        except Exception as err:
            print(f"Error caching network transformer weight models: {err}")
            raise err
        
        # Extended core dictionary infrastructure configuration profiles
        self.skill_vocabulary = [
            "python", "javascript", "react", "fastapi", "html", "css", "sql", 
            "node.js", "mongodb", "docker", "aws", "git", "machine learning", 
            "data science", "typescript", "java", "c++", "linux", "tailwind"
        ]

    def clean_text(self, text: str) -> str:
        """Sanitizes text by purging anomalous punctuation, format blocks, and tabs."""
        if not text:
            return ""
        # Force uniform formatting parameters, drop special character chains
        text_processed = text.lower()
        text_processed = re.sub(r'[\r\n\t]+', ' ', text_processed)  # Replace formatting tokens with standard spaces
        text_processed = re.sub(r'[^\w\s\.\-\+#]', '', text_processed) # Keep text characters, numbers, and core developer punctuation flags
        return re.sub(r'\s+', ' ', text_processed).strip()

    def compute_embedding(self, raw_text: str):
        sanitized = self.clean_text(raw_text)
        # Structural fallback array validation parameter handling
        if not sanitized or len(sanitized.split()) < 2:
            return np.zeros((384,))
            
        try:
            return self.model.encode(sanitized)
        except Exception as encode_fail:
            print(f"Transformer computation processing error exception: {encode_fail}")
            return np.zeros((384,))

    def calculate_similarity(self, vector_a, vector_b):
        # Validate shapes match target transformer 384 dimensional matrices
        if vector_a.shape != (384,) or vector_b.shape != (384,):
            return 0.0
            
        norm_a = np.linalg.norm(vector_a)
        norm_b = np.linalg.norm(vector_b)
        
        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0
            
        dot_product = np.dot(vector_a, vector_b)
        # Limit boundary structures using clip parameter elements to prevent mathematical floating variance leakage above 1.0
        return float(np.clip(dot_product / (norm_a * norm_b), 0.0, 1.0))

    def extract_contextual_keywords(self, resume_text: str, jd_text: str):
        cleaned_resume = self.clean_text(resume_text)
        cleaned_jd = self.clean_text(jd_text)
        
        matching_skills = []
        missing_skills = []
        
        for skill in self.skill_vocabulary:
            # Safe boundary tracking to prevent partial matches (e.g., matching "java" inside "javascript")
            pattern = r'\b' + re.escape(skill) + r'\b'
            
            if re.search(pattern, cleaned_jd):
                if re.search(pattern, cleaned_resume):
                    matching_skills.append(skill.upper())
                else:
                    missing_skills.append(skill.upper())
                    
        return {
            "matching_skills": matching_skills,
            "missing_skills": missing_skills
        }

if __name__ == "__main__":
    # Internal Unit Structural Resilience Verification Loop Check
    matcher = LocalVectorMatcher()
    junk_input = "!!!@#$@#$   \n\n\n   "
    valid_test = "Looking for a specialized FASTAPI engineer who knows Git source management tools."
    
    vec_junk = matcher.compute_embedding(junk_input)
    vec_valid = matcher.compute_embedding(valid_test)
    
    print("\n>>>> Verification Metrics System Active:")
    print(f">>>> Empty Matrix Shape Recovery Flag: {vec_junk.shape} | Vector Norm: {np.linalg.norm(vec_junk)}")
    print(f">>>> Isolated Semantic Score Boundary Evaluation: {matcher.calculate_similarity(vec_junk, vec_valid)}")
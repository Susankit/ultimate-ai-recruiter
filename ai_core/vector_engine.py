import numpy as np
import re
import io
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

class LocalVectorMatcher:
    def __init__(self):
        print("Initializing Enterprise Resilient Semantic Embedding Transformer Node...")
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            print("Model weights bound into system scope successfully.")
        except Exception as err:
            raise err
            
        self.skill_vocabulary = [
            "python", "javascript", "react", "fastapi", "html", "css", "sql", 
            "node.js", "mongodb", "docker", "aws", "git", "machine learning", 
            "data science", "typescript", "java", "c++", "linux", "tailwind"
        ]

    # Phase 6 Core Feature: Regex Entity Extraction Engine
    def extract_profile_metadata(self, raw_text: str) -> dict:
        """Heuristically extracts key profile tracking items from un-sanitized text strings."""
        profile = {"name": "Unknown Candidate", "email": "Not Provided", "phone": "Not Provided"}
        if not raw_text.strip():
            return profile

        # 1. Capture Emails using standard regex character rules
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
        if email_match:
            profile["email"] = email_match.group(0).strip()

        # 2. Capture Phone Numbers supporting formats like +1, +91, dashes, and brackets
        phone_match = re.search(r'(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}', raw_text)
        if phone_match:
            profile["phone"] = phone_match.group(0).strip()

        # 3. Simple Heuristic Name Extraction: Fallback to the first line if short, otherwise clean
        lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
        if lines:
            first_line = lines[0]
            # If the first string line doesn't exceed 4 words, assume it's the candidate name header block
            if len(first_line.split()) <= 4 and not any(char in first_line for char in ['@', ':', '/', '\\']):
                profile["name"] = first_line

        return profile

    def extract_text_from_bytes(self, file_bytes: bytes) -> str:
        if not file_bytes:
            return ""
        try:
            pdf_stream = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_stream)
            extracted_text_blocks = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text_blocks.append(page_text)
            return "\n".join(extracted_text_blocks)  # Preserve line breaks for profile parsing
        except Exception as parsing_exception:
            return ""

    def clean_text(self, text: str) -> str:
        if not text:
            return ""
        text_processed = text.lower()
        text_processed = re.sub(r'[\r\n\t]+', ' ', text_processed)
        text_processed = re.sub(r'[^\w\s\.\-\+#]', '', text_processed)
        return re.sub(r'\s+', ' ', text_processed).strip()

    def compute_embedding(self, raw_text: str):
        sanitized = self.clean_text(raw_text)
        if not sanitized or len(sanitized.split()) < 2:
            return np.zeros((384,))
        try:
            return self.model.encode(sanitized)
        except Exception:
            return np.zeros((384,))

    def calculate_similarity(self, vector_a, vector_b):
        if vector_a.shape != (384,) or vector_b.shape != (384,):
            return 0.0
        norm_a = np.linalg.norm(vector_a)
        norm_b = np.linalg.norm(vector_b)
        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0
        dot_product = np.dot(vector_a, vector_b)
        return float(np.clip(dot_product / (norm_a * norm_b), 0.0, 1.0))

    def extract_contextual_keywords(self, resume_text: str, jd_text: str):
        cleaned_resume = self.clean_text(resume_text)
        cleaned_jd = self.clean_text(jd_text)
        matching_skills = []
        missing_skills = []
        for skill in self.skill_vocabulary:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, cleaned_jd):
                if re.search(pattern, cleaned_resume):
                    matching_skills.append(skill.upper())
                else:
                    missing_skills.append(skill.upper())
        return {"matching_skills": matching_skills, "missing_skills": missing_skills}

if __name__ == "__main__":
    matcher = LocalVectorMatcher()
    sample_resume = "Rahul Sharma\nEmail: rahul.sharma@gmail.com\nPhone: +91 98765 43210\nPython Developer"
    print("Test Profile Parsing:", matcher.extract_profile_metadata(sample_resume))
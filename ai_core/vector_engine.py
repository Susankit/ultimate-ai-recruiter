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
            print(f"Error caching network transformer weight models: {err}")
            raise err
            
        self.skill_vocabulary = [
            "python", "javascript", "react", "fastapi", "html", "css", "sql", 
            "node.js", "mongodb", "docker", "aws", "git", "machine learning", 
            "data science", "typescript", "java", "c++", "linux", "tailwind"
        ]

    # New Core Processing Tool introduced in Phase 5
    def extract_text_from_bytes(self, file_bytes: bytes) -> str:
        """Parses incoming raw binary byte arrays directly out of memory streams and extracts strings."""
        if not file_bytes:
            return ""
        try:
            # Load raw byte blobs using custom memory-buffer interfaces
            pdf_stream = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_stream)
            
            extracted_text_blocks = []
            for page_index, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    extracted_text_blocks.append(page_text)
                    
            return " ".join(extracted_text_blocks)
        except Exception as parsing_exception:
            print(f"Internal vector stream processing crash failed: {str(parsing_exception)}")
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
        except Exception as encode_fail:
            print(f"Transformer computation processing error exception: {encode_fail}")
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
                    
        return {
            "matching_skills": matching_skills,
            "missing_skills": missing_skills
        }

if __name__ == "__main__":
    # Local Core Extraction Check Loop Verification script
    matcher = LocalVectorMatcher()
    print("\n>>>> AI Core Extraction Node Initialized & Stable.")
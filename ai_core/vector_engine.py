import numpy as np
import re
import io
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

class LocalVectorMatcher:
    def __init__(self):
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as err:
            raise err
        self.skill_vocabulary = [
            "python", "javascript", "react", "fastapi", "html", "css", "sql", 
            "node.js", "mongodb", "docker", "aws", "git", "machine learning"
        ]

    def apply_advanced_weight_adjustments(self, resume_text: str, jd_text: str, base_score: float) -> float:
        adjusted_score = base_score
        cleaned_resume = resume_text.lower()
        cleaned_jd = jd_text.lower()

        if any(word in cleaned_jd for word in ["senior", "lead", "manager"]) and any(word in cleaned_resume for word in ["junior", "intern", "fresher"]):
            adjusted_score -= 0.12 

        matched_keywords_count = 0
        for skill in self.skill_vocabulary:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, cleaned_jd) and re.search(pattern, cleaned_resume):
                matched_keywords_count += 1

        if matched_keywords_count >= 3:
            adjusted_score += 0.05

        return float(np.clip(adjusted_score, 0.0, 1.0))

    def extract_profile_metadata(self, raw_text: str) -> dict:
        profile = {"name": "Unknown Candidate", "email": "Not Provided", "phone": "Not Provided"}
        if not raw_text.strip(): return profile
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
        if email_match: profile["email"] = email_match.group(0).strip()
        phone_match = re.search(r'(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}', raw_text)
        if phone_match: profile["phone"] = phone_match.group(0).strip()
        lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
        if lines and len(lines[0].split()) <= 4 and not any(c in lines[0] for c in ['@', ':', '/']):
            profile["name"] = lines[0]
        return profile

    def extract_text_from_bytes(self, file_bytes: bytes) -> str:
        if not file_bytes: return ""
        try:
            pdf_stream = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_stream)
            return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
        except Exception: return ""

    def clean_text(self, text: str) -> str:
        if not text: return ""
        t = text.lower()
        t = re.sub(r'[\r\n\t]+', ' ', t)
        t = re.sub(r'[^\w\s\.\-\+#]', '', t)
        return re.sub(r'\s+', ' ', t).strip()

    def compute_embedding(self, raw_text: str):
        sanitized = self.clean_text(raw_text)
        if not sanitized or len(sanitized.split()) < 2: return np.zeros((384,))
        try: return self.model.encode(sanitized)
        except Exception: return np.zeros((384,))

    # Phase 8 Feature: Native Batch Matrix Encoding Optimization
    def compute_embeddings_batch(self, raw_texts_list: list):
        """Encodes a batch of texts simultaneously leveraging matrix pipelining."""
        cleaned_list = [self.clean_text(text) for text in raw_texts_list]
        try:
            # Passing the entire array directly to sentence-transformers for fast vectorization
            return self.model.encode(cleaned_list, batch_size=4, show_progress_bar=False)
        except Exception:
            return [np.zeros((384,)) for _ in raw_texts_list]

    def calculate_similarity(self, vector_a, vector_b):
        if vector_a.shape != (384,) or vector_b.shape != (384,): return 0.0
        norm_a, norm_b = np.linalg.norm(vector_a), np.linalg.norm(vector_b)
        if norm_a == 0.0 or norm_b == 0.0: return 0.0
        return float(np.clip(np.dot(vector_a, vector_b) / (norm_a * norm_b), 0.0, 1.0))
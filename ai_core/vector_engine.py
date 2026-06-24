import numpy as np
from sentence_transformers import SentenceTransformer

class LocalVectorMatcher:
    def __init__(self):
        # Initializing light computational embedding model (approx 90MB storage)
        print("Initializing Semantic Embedding Transformer Node...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model configuration loaded successfully.")

    def compute_embedding(self, raw_text: str):
        """Converts raw documentation strings into numerical vector spaces."""
        if not raw_text.strip():
            return np.zeros((384,))
        return self.model.encode(raw_text)

    def calculate_similarity(self, vector_a, vector_b):
        """Calculates standard cosine proximity metrics between matrix alignments."""
        dot_product = np.dot(vector_a, vector_b)
        norm_a = np.linalg.norm(vector_a)
        norm_b = np.linalg.norm(vector_b)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(dot_product / (norm_a * norm_b))

# Sandbox Execution Validation Test Runner Block
if __name__ == "__main__":
    matcher = LocalVectorMatcher()
    
    test_resume = "Expert Python Developer with deep experience building FastAPI server nodes."
    test_jd = "Looking for a Software Engineer proficient in Python backend systems architecture."
    
    vec_resume = matcher.compute_embedding(test_resume)
    vec_jd = matcher.compute_embedding(test_jd)
    
    score = matcher.calculate_similarity(vec_resume, vec_jd)
    print(f"\n>>>> Diagnostic Check Match Score: {round(score * 100, 2)}%")
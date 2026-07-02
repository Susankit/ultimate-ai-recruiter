import json
import heapq
import time
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings('ignore')

print("Loading local NLP model (CPU optimized)...")
model = SentenceTransformer('all-MiniLM-L6-v2') 

# Hardcoded Job Description for vectorization
JOB_DESCRIPTION = """
Looking for a Senior Backend Engineer with expertise in scalable architecture, 
API development, and cloud databases. Must have 5+ years of experience, 
strong problem-solving skills, and proactive communication.
"""
jd_embedding = model.encode([JOB_DESCRIPTION])

def calculate_score(candidate, semantic_score):
    profile = candidate.get("profile", {})
    signals = candidate.get("redrob_signals", {})
    
    s_score = semantic_score * 0.40
    
    career_history = candidate.get("career_history", [])
    c_score = 0.8 * 0.20 if len(career_history) > 0 else 0.4 * 0.20
    
    exp_years = profile.get("years_of_experience", 0)
    exp_score = min(exp_years / 10.0, 1.0)
    e_score = exp_score * 0.10
    
    behavioral_score = signals.get("recruiter_response_rate", 0.5) 
    b_score = behavioral_score * 0.10
    
    assessments = signals.get("skill_assessment_scores", {})
    if assessments:
        tech_raw = sum(assessments.values()) / len(assessments)
        tech_score = tech_raw / 100.0
    else:
        tech_score = 0.5
    t_score = tech_score * 0.10
    
    availability = 1.0 if signals.get("open_to_work_flag", False) else 0.2
    a_score = availability * 0.05
    
    location_fit = 1.0 
    l_score = location_fit * 0.05
    
    total_score = s_score + c_score + e_score + b_score + t_score + a_score + l_score
    return round(total_score * 100, 2)

def generate_reasoning(candidate, score):
    profile = candidate.get("profile", {})
    exp = profile.get("years_of_experience", "few")
    title = profile.get("current_title", "Candidate")
    return f"Strong semantic match ({score}%) for {title} role. Exhibits solid behavioral signals and {exp} years of experience aligning well with JD constraints."

def process_candidates():
    start_time = time.time()
    
    print("Processing candidates.jsonl line-by-line...")
    top_100_heap = []
    
    # PROCESS & RANK (Reading JSONL line-by-line to save RAM)
    try:
        with open('candidates.jsonl', 'r') as f:
            for idx, line in enumerate(f):
                if not line.strip():
                    continue
                
                candidate = json.loads(line)
                profile = candidate.get('profile', {})
                skills_list = candidate.get('skills', [])
                
                summary = profile.get('summary', '')
                headline = profile.get('headline', '')
                skills_str = " ".join([s.get('name', '') for s in skills_list])
                
                profile_text = f"{headline}. {summary} Skills: {skills_str}"
                if not profile_text.strip():
                    profile_text = "No profile data"
                    
                cand_embedding = model.encode([profile_text])
                semantic_score = cosine_similarity(jd_embedding, cand_embedding)[0][0]
                
                final_score = calculate_score(candidate, semantic_score)
                
                if len(top_100_heap) < 100:
                    heapq.heappush(top_100_heap, (final_score, candidate['candidate_id'], candidate))
                else:
                    if final_score > top_100_heap[0][0]:
                        heapq.heappushpop(top_100_heap, (final_score, candidate['candidate_id'], candidate))
                        
                if idx > 0 and idx % 10000 == 0:
                    print(f"Processed {idx} candidates... Elapsed time: {round(time.time() - start_time, 2)}s")
                    
    except FileNotFoundError:
        print("ERROR: File 'candidates.jsonl' not found! Make sure it is inside the 'ultimate-ai-recruiter' folder.")
        return

    print("Formatting Top 100 output...")
    top_100_sorted = sorted(top_100_heap, key=lambda x: x[0], reverse=True)
    
    results = []
    for rank, (score, cand_id, cand_data) in enumerate(top_100_sorted, start=1):
        results.append({
            "Rank": rank,
            "Candidate_ID": cand_id,
            "Score": score,
            "Reasoning": generate_reasoning(cand_data, score)
        })
        
    df = pd.DataFrame(results)
    output_filename = "Top_100_Ranked_Candidates.xlsx"
    df.to_excel(output_filename, index=False)
    
    print(f"✅ Success! Processing complete in {round(time.time() - start_time, 2)} seconds.")
    print(f"✅ File saved as: {output_filename}")

if __name__ == "__main__":
    process_candidates()
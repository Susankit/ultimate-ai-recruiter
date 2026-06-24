import json

with open("data/candidates.jsonl", "r", encoding="utf-8") as f:
    first_line = f.readline()

candidate = json.loads(first_line)

print(candidate["candidate_id"])
print(candidate["profile"]["current_title"])
print(candidate["profile"]["years_of_experience"])
print(candidate["skills"][:3])
print(candidate["career_history"][0])
print(candidate["career_history"][0])
print(candidate["redrob_signals"])
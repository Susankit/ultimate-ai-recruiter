import json

with open("data/candidates.jsonl", "r", encoding="utf-8") as f:
    first_line = f.readline()

candidate = json.loads(first_line)

summary = f"""
Title: {candidate['profile']['current_title']}

Experience: {candidate['profile']['years_of_experience']} years

Summary:
{candidate['profile']['summary']}
"""

print(summary)
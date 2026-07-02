# Candidate Observations

## Dataset Diversity

The sample contains candidates from multiple domains:

- Machine Learning
- NLP
- Recommendation Systems
- Software Development
- Marketing
- Sales
- HR
- Customer Support
- Operations
- Mechanical Engineering

Observation:
The ranking system cannot rely solely on job titles because many profiles contain cross-domain information.

---

## Experience Distribution

Observed experience ranges:

- Fresh candidates (~1 year)
- Mid-level candidates (3–8 years)
- Senior candidates (10+ years)

Examples include:

- Customer Support (1.1 years)
- Operations Manager (3.6 years)
- Recommendation Systems Engineer (6 years)
- Project Manager (14.5 years)

Observation:
Years of experience should be normalized rather than directly rewarded.

---

## Skills Structure

Most candidates contain:

- 5–15 skills
- Proficiency level
- Endorsements
- Duration in months

Observation:
Skill duration and proficiency appear more reliable than endorsements.

---

## Career History Structure

Most candidates contain:

- Multiple previous companies
- Role descriptions
- Duration information
- Industry information

Observation:
Career descriptions are one of the richest sources for semantic matching.

Observation:
Career progression can be used to detect suspicious profiles.

---

## Redrob Signals

Common signals observed:

- Interview completion rate
- Recruiter response rate
- GitHub activity score
- Profile completeness score
- Open-to-work flag
- Notice period

Observation:
These signals are extremely useful for reliability scoring.

---

## Verification Signals

Candidates may have:

- verified_email
- verified_phone
- linkedin_connected

Observation:
Verification status can be used as a trust indicator.

---

## Missing Data Patterns

Observed examples:

- Empty certifications
- Missing GitHub activity (-1)
- Empty skill assessments

Observation:
The ranking engine must handle missing fields gracefully.

---

## Interesting Pattern 1

Some profiles contain highly technical skills such as:

- FAISS
- Pinecone
- Embeddings
- LangChain
- Recommendation Systems

Observation:
These candidates should receive strong semantic-fit scores for AI/ML jobs.

---

## Interesting Pattern 2

Several profiles show mismatches between:

- Headline
- Current title
- Career descriptions

Observation:
Consistency checks may help detect low-quality or adversarial profiles.

---

## Interesting Pattern 3

Some profiles have:

- High profile completeness
- Low interview completion

Observation:
Potential signal for honeypot detection.

---

## Key Ranking Fields Identified

Highest value fields:

1. profile.summary
2. career_history.description
3. skills
4. years_of_experience
5. skill_assessment_scores
6. interview_completion_rate
7. recruiter_response_rate
8. github_activity_score
9. notice_period_days
10. preferred_work_mode
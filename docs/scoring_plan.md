# Candidate Ranking Strategy

Total Score = 100

## 1. Semantic Fit (50%)

Measure relevance to job description.

Inputs:

- profile.summary
- profile.headline
- current_title
- career_history.description
- skills

Method:

Embedding similarity between candidate text and job description.

Weight: 50

---

## 2. Behavioral Reliability (30%)

Measures candidate quality and responsiveness.

Inputs:

- interview_completion_rate
- recruiter_response_rate
- offer_acceptance_rate
- github_activity_score
- skill_assessment_scores

Weight: 30

---

## 3. Logistical Alignment (20%)

Measures hiring practicality.

Inputs:

- preferred_work_mode
- notice_period_days
- willing_to_relocate
- open_to_work_flag

Weight: 20
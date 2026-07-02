# Feature Engineering Plan

## Text Features

Used for embeddings.

Fields:

- profile.headline
- profile.summary
- current_title
- skills.name
- career_history.description

Reason:

These fields contain semantic information.

---

## Numerical Features

Used for scoring.

Fields:

- years_of_experience
- skill_assessment_scores
- recruiter_response_rate
- interview_completion_rate
- github_activity_score
- notice_period_days

Reason:

These are measurable quantities.

---

## Boolean Features

Fields:

- open_to_work_flag
- willing_to_relocate
- verified_email
- verified_phone
- linkedin_connected

Reason:

Useful for reliability and logistics scoring.
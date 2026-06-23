Candidate Schema Analysis

Overview

The dataset contains candidate information across six major categories:

1. Profile Information
2. Career History
3. Education
4. Skills
5. Certifications & Languages
6. Redrob Platform Signals

---

1. Profile Information

Fields:

- candidate_id
- anonymized_name
- headline
- summary
- location
- country
- years_of_experience
- current_title
- current_company
- current_company_size
- current_industry

Importance:

- Professional summary is highly useful for semantic matching.
- Current title and industry help determine role relevance.
- Experience helps assess seniority level.
- Location can be used for geographical filtering.

---

2. Career History

Each candidate contains previous work experiences with:

- company
- title
- duration_months
- industry
- company_size
- description

Importance:

- Strong source for semantic matching.
- Useful for verifying claimed skills.
- Helps identify career progression.
- Useful for detecting suspicious promotions or inconsistent timelines.

---

3. Education

Fields:

- institution
- degree
- field_of_study
- grade
- tier

Importance:

- Helpful but secondary compared to skills and experience.
- Institution tier may be used as a minor ranking signal.

---

4. Skills

Fields:

- skill name
- proficiency
- endorsements
- duration_months

Importance:

- One of the most important ranking factors.
- Can be directly compared with job requirements.
- Duration and proficiency help estimate expertise.

---

5. Certifications & Languages

Certifications:

- name
- issuer
- year

Languages:

- language
- proficiency

Importance:

- Useful as supporting evidence.
- Should not dominate final ranking.

---

6. Redrob Platform Signals

Behavioral Signals:

- profile_completeness_score
- recruiter_response_rate
- avg_response_time_hours
- interview_completion_rate
- offer_acceptance_rate

Activity Signals:

- profile_views_received_30d
- search_appearance_30d
- saved_by_recruiters_30d

Verification Signals:

- verified_email
- verified_phone
- linkedin_connected

Availability Signals:

- notice_period_days
- preferred_work_mode
- willing_to_relocate
- open_to_work_flag

Technical Signals:

- github_activity_score
- skill_assessment_scores

Importance:

- Extremely useful for reliability assessment.
- Can help detect adversarial or low-quality profiles.
- Valuable for behavioral scoring.
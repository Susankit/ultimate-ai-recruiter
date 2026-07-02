# Honeypot & Adversarial Detection Rules

## Rule 1: Perfect Profile, Zero Interview Attendance

Condition:
- profile_completeness_score > 95
- interview_completion_rate < 0.1

Reason:
Candidate maintains a perfect profile but rarely attends interviews.

Penalty:
-20

---

## Rule 2: Skill Inflation

Condition:
- Many expert-level skills
- Low skill assessment scores

Reason:
Claims do not match verified assessments.

Penalty:
-15

---

## Rule 3: Experience Mismatch

Condition:
- Senior title
- Very low years_of_experience

Examples:
- Senior Engineer with 2 years experience
- Principal Engineer with 3 years experience

Penalty:
-15

---

## Rule 4: Career Progression Anomaly

Condition:
Rapid promotions within unrealistic timelines.

Example:
Intern → Senior Manager within 1 year.

Penalty:
-10

---

## Rule 5: Profile Inconsistency

Condition:
Current title conflicts with career descriptions.

Example:
Headline says Data Scientist but work history shows Sales roles.

Penalty:
-15

---

## Rule 6: High Salary, Low Capability

Condition:
Expected salary extremely high
AND
Assessment scores below average.

Penalty:
-10

---

## Rule 7: Ghost Candidate

Condition:
- Open to work = true
- Last active long ago
- Recruiter response rate very low

Penalty:
-10

---

## Rule 8: Verification Risk

Condition:
- verified_email = false
- verified_phone = false
- linkedin_connected = false

Penalty:
-5
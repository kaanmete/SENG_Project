1. Identify System and Related Actors
1.1 Understand the System and Its Requirements
The Level Assessment AI Diagnostic Engine is a SaaS-based adaptive testing platform designed
to evaluate and track users’ English proficiency. It operates as a cloud-hosted web service
allowing users to take personalized, AI-generated assessments and receive CEFR-aligned
feedback. The AI Diagnostic Engine continuously analyzes responses, predicts proficiency, and
generates personalized recommendations through real-time analytics. The system consists of
five primary modules: Authentication, Assessment Engine, Adaptive AI, Analytics Dashboard,
and Administration. Each module interacts through RESTful APIs and real-time WebSocket
connections for scoring and analytics.

1.2 Identify Actors
Primary Actors
User: An authenticated user with personalized access to adaptive tests, AI feedback, and
analytics dashboard.
System Administrator: A privileged actor responsible for monitoring system health,
managing users, reviewing reports, and ensuring data integrity.
Secondary / External Actors
 AI Diagnostic Engine (External Service): External AI component that analyzes user
responses, generates CEFR scores, and provides feedback through APIs.
 Email Verification Service: External mail server used for authentication, password resets,
and account confirmations.
1.3 Identify Requirements
1.3.1 Functional Requirements

ID Functional Requirement
FR- 01 The system shall allow users to register for an account using a valid email address
and password.
FR- 02 The system shall verify user email addresses via a one-time verification token
before granting full account access.
FR- 03 The system shall allow users to log in and reset their passwords through secure
token-based authentication.
FR- (^04) The system shall allow users to specify or update their English learning purpose
(e.g., exam preparation, fluency).
FR- 05 The system shall dynamically select assessment questions based on the user’s
goal, level, and previous performance history.

FR- 06 The system shall adjust question difficulty in real time according to user
performance within a test session.

FR- 07 The system shall generate complete adaptive CEFR-based tests integrating
reading, writing, listening, speaking, and vocabulary modules.

FR- (^08) The system shall record and store all user responses, timestamps, and session
identifiers in the database.
FR- 09 The system shall analyze responses using AI models and compute sub-skill scores
(accuracy, fluency, grammar, vocabulary).
FR- 10 The system shall aggregate sub-skill scores into a single CEFR level (A1–C2) using
the AI scoring algorithm.
FR- 11 The system shall display feedback summarizing user strengths, weaknesses, and
AI-generated improvement suggestions.
FR- 12 The system shall provide an analytics dashboard showing recent results, CEFR
progression, and visualized performance charts.
FR- 13 The system shall allow System Administrators to view system health metrics and
generate aggregated usage reports.
FR- 14 The system shall transcribe and evaluate user-uploaded speech for pronunciation,
fluency, and grammar accuracy.
FR- 15 The system shall evaluate written input for grammatical and lexical accuracy and
provide AI-generated corrections.
FR- 16 The system shall assign an appropriate time limit to each test before the
assessment begins.
FR- 17 The system shall provide AI-generated hints during tests when users click the
“Get Hint” button, without revealing answers.
FR- 18 The system shall categorize and store all test sessions by level, skill type, and topic
tags for retrieval.
FR- 19 The system shall enable administrators to manage users, roles, and account
statuses.
FR- 20 The system shall generate a personalized study plan focusing on the user’s
weakest skills after each test completion.
FR- 21 The system shall select the most suitable question from the AI-managed ready
question pool, in a concept appropriate to the user's English learning purpose and
based on their detected current level.

1.3.2 Non-Functional Requirements

ID Non-Functional Requirement
NFR- 01 – System
Availability & Reliability
The system shall maintain a minimum of 99.5% uptime and
operate continuously under normal conditions.
NFR- 02 – Scalability &
Concurrency
The system shall support up to 500 concurrent test sessions
without noticeable degradation in response time.
NFR- 03 – Performance &
Response Time
The system shall load questions, AI hints, and analytics within an
average of three seconds under normal usage.
NFR- 04 – AI Processing
Efficiency
The system shall process grammar inputs (≤150 words) in under
five seconds and audio inputs (≤1 minute) in under fifteen
seconds.
NFR- 05 – Maintainability
& Modularity
Each main module (Authentication, Assessment, Dashboard, AI
Engine) shall be implemented as a separate and reusable
component.
NFR- 06 – System Audit &
Logging
All major user actions and AI scoring decisions shall be logged
with timestamps for debugging and evaluation purposes.
NFR- 07 – Rate Limiting &
Abuse Prevention
The system shall limit repetitive or excessive user requests to
prevent performance issues and abuse of the platform.
2. Define and Describe Use Cases
2.1 Define User-Goal Level Use Cases
Registered User – Primary Use Cases
Use Case Title Corresponding
Functional
Requirement(s)
Purpose / Goal Summary
Manage Account FR-01, FR-02, FR-
03
To create an account to access the system, log in
to an existing account.
Setting Learning
Purpose
FR- 04 To inform the system (and the AI) of the
motivation for learning (e.g., business, travel,
exam, etc.).
Taking the AI-
Compiled Integrated
Exam
FR- 07 , FR- 21 To start and complete the placement test
compiled by the AI (which includes all skills)
based on the user's purpose, level, and assigned
time.
Reset Password FR- 03 Enables password recovery through token-
based verification.
Verify Email FR- 02 Confirms account ownership via a one-time
verification token (Email Verification Service).
Receiving a Hint
During the Exam
FR- 17 To request a guiding hint from the AI that does
not give away the answer when struggling with a
question during the exam.
Receiving Exam
Result Report and
Feedback
FR- 11 To view the detailed result report and feedback
created by the AI after the exam is finished, by
analyzing the answers (and converting all skills
into a single CEFR level).
8.Doing Dynamic
Reading Practice

FR-05, FR- 07 To practice with reading passages
selected/generated by the AI appropriate to the
level and concept, and their corresponding
comprehension questions.
9.Doing Dynamic
Listening Practice

FR-05, FR- 07 To practice with audio recordings
selected/generated by the AI appropriate to the
level and concept, and their corresponding
comprehension questions.
10 .Taking Adaptive
Grammar Test

FR-05, FR- 06 To take the grammar tests created by the AI at
an adaptive difficulty level.
11 .Taking Adaptive
Vocabulary Test

FR-05, FR- 06 To take the vocabulary tests created by the AI at
an adaptive difficulty level.
12 .Experiencing
Adaptive Difficulty
Increase (In Practice
Tests)

FR- 06 To receive a success effect from the system and
have the difficulty of the next question increased
by the AI when 3 consecutive correct answers
are given during Grammar or Vocab practice
(UC- 10 , UC- 11 ).
13 .Receiving Writing
Skill Feedback

FR- 15 To write a text on a topic and have the AI
analyze the text, highlight grammatical errors,
and provide correction suggestions for each
error.
14 .Receiving Speaking
Feedback

FR- 14 To record a voice response and have the AI
transcribe this recording and provide a score
(from 1-5) based on pronunciation, fluency, and
grammar.
15 .Viewing Progress
Chart (Dashboard)

FR-12, FR- 18 To examine the bar chart showing the skill-
based success rate on the main panel
(Dashboard).
16 .Accessing Personal
Test Pool

FR- 18 , FR- 21 To access the pool listing the tests (assigned or
practice) offered specifically to the user by the
system.
17 .Categorizing and
Filtering the Test Pool

FR- 18 To organize the tests in the personal test pool
(UC-14) by filtering them based on level, skill,
and tags.
18 .Receiving
Personalized Study
Plan

FR- 20 To view the personal study plan created by the
AI based on the detected level (UC-05) and
learning purpose (UC-02).
19 .Receiving Listening
Practice Feedback

FR- 11 For the user to see explanatory feedback
generated by the AI for the mistakes made after
completing the AI-supported listening practice
(FR-4).
20 .Receiving Grammar
Practice Feedback

FR- 11 For the user to receive instant, rule-explanatory
feedback from the AI for mistakes made during
the adaptive grammar test (FR-13).
21 .Receiving
Vocabulary Practice
Feedback

FR- 11 For the user to receive instant feedback from the
AI, including meaning, usage, and example
sentences, for words answered incorrectly
during the adaptive vocabulary test.
22 .Monitor System
Health and Manage
Users

FR-13, FR- 19 Enables administrators to monitor system
performance, manage user accounts and roles,
and generate usage reports.
23 .Submit Assessment FR- 08 Records and submits all test responses,
timestamps, and session identifiers to the
database before AI processing.
24 .Analyze Responses
(AI Diagnostic Engine)

FR- 09 After the user submits the assessment, the
system analyzes responses using AI models and
calculates sub-skill scores visible in the result
report.
25 .Aggregate CEFR
Level

FR- 10 After analysis, the system aggregates the
calculated sub-skill scores into a single CEFR
level and displays it to the user in the result
report.
View Remaining
Time
FR- 16 While answering questions, the user can see the
remaining time as a running countdown and get
threshold alerts (e.g., 5:00 and 1:00).
2.3 Write Use Cases in Brief Format
UC- 01 : Manage Account

Primary Actor: User
Goal: Create an account, verify it, and sign in securely.
Brief Description: The user registers with email/password, confirms email, and logs in to
access the system.
UC- 02 : Setting Learning Purpose

Primary Actor: User
Goal: Specify/update English learning purpose (e.g., exam, business).
Brief Description: The user selects a learning purpose so the AI can tailor assessments and
content.
UC- 03 : Taking the AI-Compiled Integrated Exam

Primary Actor: User
Goal: Start and complete the adaptive, CEFR-based integrated exam.
Brief Description: The user launches an AI-compiled multi-skill test; the system selects
questions and manages timing and flow.
UC- 04 : Reset Password

Primary Actor: User
Goal: Recover account access.
Brief Description: The user requests a reset link and sets a new password via secure token flow.
UC- 05 : Verify Email

Primary Actor: User
Goal: Confirm account ownership.
Brief Description: The user clicks a one-time token link sent by the Email Verification Service to
activate the account.
UC- 06 : Receiving a Hint During the Exam

Primary Actor: User
Goal: Get an AI hint without revealing the answer.
Brief Description: During a question, the user taps “Get Hint”; the AI returns guidance aligned
to the item.
UC- 07 : Receiving Exam Result Report and Feedback

Primary Actor: User
Goal: To view the detailed exam result and AI-generated feedback.
Brief Description: After completing the exam, the user can view a detailed report created by the
AI. The system analyzes all answers and calculates a CEFR level by combining the performance
from different skills.
UC- 08 : Doing Dynamic Reading Practice

Primary Actor: User
Goal: To practice reading comprehension using AI-generated texts.
Brief Description: The user practices reading passages generated or selected by the AI
according to their level and topic. Each passage includes comprehension questions that adapt
based on the user’s previous performance.

UC- 09 : Doing Dynamic Listening Practice

Primary Actor: User
Goal: To practice listening comprehension using AI-generated audio.
Brief Description: The user listens to audio recordings selected or generated by the AI. The
system provides comprehension questions and adjusts difficulty based on the user’s listening
performance.
UC- 10 : Taking Adaptive Grammar Test

Primary Actor: User
Goal: To take an AI-generated grammar test with adaptive difficulty.
Brief Description: The user takes a grammar test where each question’s difficulty level changes
dynamically depending on their previous answers. The AI automatically increases or decreases
the level.
UC- 11 : Taking Adaptive Vocabulary Test

Primary Actor: User
Goal: To take an AI-generated vocabulary test with adaptive difficulty.
Brief Description: The user takes vocabulary tests created by the AI. The questions
automatically adjust in difficulty depending on the user’s accuracy.
UC- 12 : Experiencing Adaptive Difficulty Increase

Primary Actor: User
Goal: To experience an AI-controlled difficulty adjustment in real time.
Brief Description: During grammar or vocabulary practice, when the user gives three
consecutive correct answers, the AI increases the difficulty level and shows a success effect to
motivate continued progress.
UC- 13 : Receiving Writing Skill Feedback

Primary Actor: User
Goal: To receive AI-generated feedback on written text to improve writing skills.
Brief Description: After submitting a text, the system provides AI-based grammar and structure
feedback.
UC- 14 : Receiving Speaking Feedback

Primary Actor: User
Goal: To receive automated AI feedback on pronunciation and fluency.
Brief Description: After uploading a speech recording, the AI evaluates pronunciation, fluency,
and grammar.
UC- 15 : Viewing Progress Chart (Dashboard)

Primary Actor: User
Goal: To visualize progress and monitor performance improvement.
Brief Description: The dashboard displays bar charts showing progress across skills based on
test data.
UC- 16 : Accessing Personal Test Pool

Primary Actor: User
Goal: To access all personalized or AI-assigned tests easily.
Brief Description: The user views a list of recommended or assigned tests and selects one to
begin.
UC- 17 : Categorizing and Filtering the Test Pool

Primary Actor: User
Goal: To filter and organize tests efficiently by skill, level, or tags.
Brief Description: The user applies filters (e.g., Grammar, B1) to quickly find specific tests.
UC- 18 : Receiving Personalized Study Plan

Primary Actor: User
Goal: To view a personalized study plan generated by AI based on skill level
Brief Description: After level detection, the AI generates and displays a tailored study plan for
the user.
UC- 19 : Receiving Listening Practice Feedback

Primary Actor: User
Goal: For the user to see explanatory feedback generated by the AI for the mistakes made after
completing the AI-supported listening practice (FR-4).
Brief Description: After the user completes the listening practice, the system provides AI-
generated feedback that explains the reasons for incorrect answers and supports learning.
UC- 20 : Receiving Grammar Practice Feedback

Primary Actor: User
Goal: For the user to receive instant, rule-explanatory feedback from the AI for mistakes made
during the adaptive grammar test (FR-13).
Brief Description: When the user answers a question incorrectly in the adaptive grammar test,
the system uses AI to instantly explain the relevant grammar rule for the error.
UC- 21 : Receiving Vocabulary Practice Feedback

Primary Actor: User
Goal: For the user to receive instant feedback from the AI, including meaning, usage, and
example sentences, for words answered incorrectly during the adaptive vocabulary test.
Brief Description: When the user encounters an error in vocabulary practice, the AI engine
instantly provides the definition, correct usage, and a contextual example sentence for the
incorrect word.
UC- 22 : Monitor System Health and Manage Users

Primary Actor: System Administrator
Goal: Enables administrators to monitor system performance, manage user accounts and roles,
and generate usage reports.
Brief Description: The Admin monitors the system's overall health (e.g., server load, error logs),
manages user accounts (create, delete, assign roles), and generates reports on system usage.
UC- 23 : Submit Assessment

Primary Actor: User
Goal: To complete the test and submit responses to the system for analysis.
Brief Description: When the user clicks the "Submit Assessment" button, the system collects all
responses, timestamps, and session identifiers, and records them in the database for AI analysis
(UC-24).
UC- 24 : Analyze Responses

Primary Actor: AI Diagnostic Engine
Goal: To analyze submitted assessment responses using AI models and calculate sub-skill
scores.
Brief Description: After the assessment is submitted (UC-23), the system triggers AI models in
the background; these models process the responses and calculate scores for each sub-skill
(reading, writing, etc.).
UC- 25 : Aggregate CEFR Level

Primary Actor: AI Diagnostic Engine
Goal: To aggregate the analyzed sub-skill scores (FR-09) into a single, overall CEFR level.
Brief Description: The system takes all sub-skill scores from the AI analysis (UC-24), combines
them based on a predefined algorithm, and determines a single overall CEFR level (e.g., B2) for
the user.
UC- 26 : View Remaining Time

Primary Actor: User
Goal: To track the total remaining time during the assessment.
Brief Description: While on the assessment screen, the user sees a counter ticking down from
the total time assigned by AI (FR-16) and receives visual alerts at critical thresholds (e.g., 5
minutes).
2.4 Complete Fully Dressed Use Case
UC-01 : Manage Account
 Primary Actor: User
 Goal in Context: Provide secure access to personalized assessments and analytics.
 Stakeholders and Interests:
User: Fast, secure sign-up/sign-in.
System Administrator: Proper onboarding and data integrity.
Email Verification Service: Deliver tokens reliably.
 Preconditions: User has a valid email; system is reachable.
 Success Guarantee: Account exists (or is authenticated), and the user is signed in to the
dashboard.
 Main Success Scenario:
User opens “Sign up / Sign in”.
Enters email and password to register or signs in.
System creates account (if new) and prompts email verification.
After verification (UC-05), user signs in.
System issues a session and shows the dashboard.
 Extensions:
A1) Email already used: System prompts sign-in or reset password (UC-04).
A2) Invalid credentials: System rejects and allows retry with rate limiting.
(Related FRs: FR-01, FR-02, FR-03.)
UC-02 : Setting Learning Purpose
 Primary Actor: User
 Goal in Context: Enable AI to tailor tests/content to the user’s objective.
 Stakeholders and Interests:
User: Purpose-aligned items and study plan.
AI Diagnostic Engine: Needs purpose metadata to select/generate items.
 Preconditions: User is authenticated (UC-01).
 Success Guarantee: Purpose is stored and used in subsequent selections.
 Main Success Scenario:
User opens “Learning Purpose”.
Chooses a purpose (e.g., exam, business, travel).
Saves selection.
System confirms and updates user profile.
 Extensions:
A1) No selection made: System blocks save and highlights required field.
A2) Network failure: System retries; on failure, informs user to retry later.
(Related FR: FR-04.)
UC-03 : Taking the AI-Compiled Integrated Exam
 Primary Actor: User
 Goal in Context: Complete a placement/diagnostic exam that adapts across skills and
level.
 Stakeholders and Interests:
User: Fair, adaptive test; clear timing.
AI Diagnostic Engine: Needs responses to drive selection and scoring.
System Administrator: Reliable session logging for audit.
 Preconditions: User authenticated; has verified email; purpose set (UC-02).
 Success Guarantee: All responses saved; session submitted for AI analysis; results
pipeline continues.
 Main Success Scenario:
User opens “Start Integrated Exam”.
System compiles the test based on purpose/level/history.
User proceeds through multi-skill items; system records responses.
Difficulty adapts per performance.
User submits the exam.
System finalizes session and forwards to AI analysis (UC- 24 ) and CEFR
aggregation (UC-25).
 Extensions:
A1) Connectivity drop: System autosaves; user can resume the session.
A2) Session timeout: System auto-submits saved answers and flags incomplete sections.
(Related FRs: FR-07, FR-21; also interacts with FR-08, FR-05, FR-06 during flow.)
UC-04 : Reset Password
 Primary Actor: User
 Goal in Context: Restore secure access when password is forgotten/compromised.
 Stakeholders and Interests:
User: Fast recovery; account safety.
System Administrator: Reduce support load; enforce security.
Email Verification Service: Deliver a one-time reset token.
 Preconditions: User provides a registered email.
 Success Guarantee: Password is updated; user can sign in.
 Main Success Scenario:
User chooses “Forgot Password”.
Enters registered email.
System emails a secure, time-bound reset link.
User opens link and sets a new strong password.
System confirms reset; user signs in.
 Extensions:
A1) Email not found: System informs user without revealing existence of accounts
(privacy).
A2) Token expired/invalid: System blocks change and offers to resend link.
(Related FR: FR-03.)
UC-05 : Verify Email
 Primary Actor: User
 Goal in Context: Confirm account ownership before granting full access.
 Stakeholders and Interests:
User: Quick activation.
Email Verification Service: Reliable token delivery.
System Administrator: Limit fake/abusive accounts.
 Preconditions: Account created; token sent to provided email.
 Success Guarantee: Account becomes verified; full access enabled.
 Main Success Scenario:
User opens verification email and clicks the token link.
System validates token and marks account as verified.
User can now access all features after sign-in.
 Extensions:
A1) Token expired/used: System denies verification and offers a resend.
A2) Wrong account email: User updates email and requests a new token.
(Related FR: FR-02.)
UC-06 : Receiving a Hint During the Exam
 Primary Actor: User
 Goal in Context: Obtain targeted guidance that helps progress without revealing the
answer.
 Stakeholders and Interests:
User: Helpful, fair hinting.
AI Diagnostic Engine: Provide context-appropriate hints consistent with assessment
validity.
 Preconditions: User is in an active test item (UC-03).
 Success Guarantee: A compliant hint is shown and logged; the attempt continues.
 Main Success Scenario:
User clicks “Get Hint” while viewing a question.
System requests a hint from the AI with item context and user state.
AI returns a non-revealing hint.
System displays the hint and logs the event.
 Extensions:
A1) Hint quota reached: System informs the user that hint limit is reached for this
section.
A2) AI service unavailable: System shows a friendly error and allows the user to
continue without a hint or retry once.
(Related FR: FR-17.)
UC-07 : Receiving Exam Result Report and Feedback
 Primary Actor: User
 Goal in Context: To view a detailed exam report and receive AI-generated feedback that
summarizes overall performance and CEFR level.
 Stakeholders and Interests:
User: Wants to understand strengths and weaknesses and see overall CEFR level.
AI Diagnostic Engine: Aims to provide an accurate performance report using automated
analysis.
 Preconditions: The user must have completed an exam.
 Success Guarantee: The user successfully receives a detailed feedback report and CEFR
level.
 Main Success Scenario:
The user finishes the exam.
The system automatically analyzes all answers.
The AI calculates a CEFR level by combining scores from all skills.
A detailed report and feedback are displayed to the user.
 Extensions:
(a) The report generation fails → The system shows an error message and retries.
(b) The internet connection is lost → The report is saved and displayed once
reconnected.
UC-08 : Doing Dynamic Reading Practice
 Primary Actor: User
 Goal in Context: To improve reading comprehension with dynamically selected or
generated passages.
 Stakeholders and Interests:
User: Wants to practice reading skills based on current level.
AI System: Provides suitable passages and adjusts question difficulty.
 Preconditions: The user must log in and select “Reading Practice.”
 Success Guarantee: The user completes a reading session with adaptive questions.
 Main Success Scenario:
The user selects “Reading Practice.”
The AI chooses or generates a reading passage suitable to the level.
The user reads the passage.
The AI provides comprehension questions.
The AI adjusts question difficulty according to user responses.
 Extensions:
(a) The user skips a question → The system marks it as unanswered.
(b) The AI fails to load passage → A new passage is generated automatically.
UC-09 : Doing Dynamic Listening Practice
 Primary Actor: User
 Goal in Context: To improve listening comprehension with adaptive AI-generated
content.
 Stakeholders and Interests:
User: Wants to enhance listening ability with suitable level material.
AI System: Generates and controls difficulty dynamically.
 Preconditions: The user selects “Listening Practice.”
 Success Guarantee: The user completes an adaptive listening session.
 Main Success Scenario:
The user starts the listening practice.
The AI selects or generates an audio recording appropriate to the level.
The user listens and answers comprehension questions.
The AI adjusts the difficulty based on performance.
 Extensions:
(a) Audio fails to play → The system reloads or switches to backup file.
(b) The user pauses or exits → The session is saved automatically.
UC-10 : Taking Adaptive Grammar Test
 Primary Actor: User
 Goal in Context: To test grammar knowledge with AI-controlled adaptive difficulty.
 Stakeholders and Interests:
User: Wants fair and level-appropriate grammar questions.
AI System: Adjusts question difficulty to match user level.
 Preconditions: The user starts the grammar test.
 Success Guarantee: The user completes the adaptive grammar test.
 Main Success Scenario:
The user starts the test.
The AI presents grammar questions.
After each answer, the AI analyzes the response.
The difficulty level changes automatically based on performance.
The user completes the test and receives feedback.
 Extensions:
(a) The user exits early → Progress is saved.
(b) The AI question fails to load → Another question is provided.
UC-11 : Taking Adaptive Vocabulary Test
 Primary Actor: User
 Goal in Context: To test vocabulary knowledge with adaptive AI-generated questions.
 Stakeholders and Interests:
User: Aims to expand vocabulary knowledge and track progress.
AI System: Evaluates performance and adapts question level.
 Preconditions: The user starts the vocabulary test.
 Success Guarantee: The user completes a fully adaptive vocabulary test.
 Main Success Scenario:
The user starts the test.
The AI presents vocabulary questions.
The system analyzes each answer.
Difficulty adjusts according to the user’s performance.
The user finishes and sees feedback.
 Extensions:
(a) Internet connection fails → The session resumes later.
(b) The user skips a word → It’s recorded as incorrect.
UC-12 : Experiencing Adaptive Difficulty Increase
 Primary Actor: User
 Goal in Context: To experience automatic difficulty increase when showing consistent
success.
 Stakeholders and Interests:
User: Wants to feel progress and motivation during practice.
AI System: Dynamically increases challenge level based on accuracy.
 Preconditions: The user must be doing grammar or vocabulary practice.
 Success Guarantee: The AI increases the difficulty after three consecutive correct
answers.
 Main Success Scenario:
The user answers practice questions.
The AI monitors consecutive correct answers.
After three correct answers, the AI increases question difficulty.
A success effect or animation appears on screen.
The user continues practicing at a higher level.
 Extensions:
(a) If the user gives a wrong answer → The difficulty remains the same or decreases
slightly.
(b) If the AI fails to update → The system retries adjustment in the next round.
UC-13: Receiving Writing Skill Feedback
 Primary Actor: User
 Goal in Context: To improve writing skills by delivering clear, actionable AI feedback (FR-
11) on content, grammar, coherence, and style.
 Stakeholders and Interests:
User: Wants effective, specific guidance to revise and learn.
System: Ensures accurate AI evaluation and reliable presentation of results.
 Preconditions: The user is logged in and has submitted a writing sample (text).
 Success Guarantee: The system returns personalized, accurate, and understandable
feedback for the submission.
 Main Success Scenario:
The user submits a writing sample.
The system sends the text to the AI evaluation service.
The AI analyzes grammar, vocabulary, coherence, and task achievement.
The system displays a results page with overall score, highlighted issues, and fix-
it suggestions (with examples).
The user can download or copy the feedback and proceed to revise.
 Extensions:
(a) Connection error → The system informs the user and offers a retry.
(b) Invalid or empty text → The system asks for a valid resubmission.
UC-14: Receiving Speaking Feedback
 Primary Actor: User
 Goal in Context: To improve speaking skills by providing AI feedback (FR-11) on
pronunciation, fluency, grammar, and lexical choice based on an audio recording.
 Stakeholders and Interests:
User: Wants clear, objective feedback with examples and tips.
System: Ensures accurate AI evaluation and clear visualization of results.
 Preconditions: The user is logged in and has recorded or uploaded an audio response.
 Success Guarantee: The system presents understandable, actionable AI feedback for the
recording.
 Main Success Scenario:
The user records or uploads an audio sample.
The system forwards the audio to the AI speech analysis service.
The AI evaluates pronunciation, fluency, grammar, and vocabulary richness.
The system shows a results page with scores, transcript (if available), and
targeted tips.
The user can replay audio, view mispronounced words, and see correction hints.
 Extensions:
(a) Connection error → The system notifies the user and allows retry.
(b) Invalid audio (too short/corrupted) → The system requests a new recording.
UC-15: Viewing Progress Chart (Dashboard)
 Primary Actor: User
 Goal in Context: To visualize learning progress over time with AI-derived metrics and
charts (e.g., per-skill trends, recent activity).
 Stakeholders and Interests:
User: Wants a clear, motivating view of improvement and weak areas.
System: Must compute and present accurate trends from stored results.
 Preconditions: The user is logged in and has historical assessment/practice data.
 Success Guarantee: The dashboard loads with correct charts and summaries.
 Main Success Scenario:
The user opens the Dashboard.
The system fetches recent scores and per-skill metrics.
The AI highlights strengths/weaknesses and suggests focus areas.
The system renders charts (e.g., line/bar charts) and a concise summary.
The user can filter by date range and skill.
 Extensions:
(a) Connection error → The system shows an error banner and retry option.
(b) No data available → The system displays guidance on taking the first assessment.
UC-16: Accessing Personal Test Pool
 Primary Actor: User
 Goal in Context: To access a personalized pool of practice tests/questions curated by AI
from prior performance and goals.
 Stakeholders and Interests:
User: Wants relevant, level-appropriate practice content.
System: Ensures correct retrieval and safe display of the user’s pool.
 Preconditions: The user is logged in; at least one skill profile or prior result exists.
 Success Guarantee: The user can view and open items from their personal test pool.
 Main Success Scenario:
The user navigates to “My Test Pool.”
The system retrieves AI-curated items mapped to the user’s profile.
The list shows titles, skill tags, difficulty, and estimated time.
The user selects an item and opens it for practice.
 Extensions:
(a) Connection error → The system informs the user and enables retry.
(b) Insufficient data → The system asks the user to complete a quick placement/practice
to seed the pool.
UC-17: Categorizing and Filtering the Test Pool
 Primary Actor: User
 Goal in Context: To quickly find suitable practice by filtering and categorizing the
personal test pool (e.g., skill, topic, difficulty, time).
 Stakeholders and Interests:
User: Wants efficient discovery of the right items.
System: Provides responsive filtering and accurate categorization.
 Preconditions: The user is logged in and has access to a populated test pool (UC-16).
 Success Guarantee: The user can apply filters and see the refined list instantly.
 Main Success Scenario:
The user opens the filter panel (skill, topic, difficulty, time).
The user selects one or more filters.
The system applies filters and updates the list without full page reload.
The user saves filter presets (optional) and starts a chosen item.
 Extensions:
(a) No results after filtering → The system suggests nearest matches or relaxes filters.
(b) Invalid filter combination → The system prompts to adjust selections.
UC-18: Receiving Personalized Study Plan
 Primary Actor: User
 Goal in Context: To receive an AI-generated study plan with prioritized skills, resources,
and schedule suggestions based on recent performance.
 Stakeholders and Interests:
User: Wants a clear, achievable roadmap to improve weak areas.
System: Produces accurate, realistic plans and keeps them up to date.
 Preconditions: The user is logged in; recent assessment/practice results are available.
 Success Guarantee: A personalized plan is generated and presented in an understandable
format.
 Main Success Scenario:
The user opens “My Study Plan.”
The system aggregates recent results and learning goals.
The AI ranks weak skills and selects matching activities/resources.
The system displays the plan (goals, weekly tasks, estimated time, links).
The user can accept, adjust, or regenerate the plan.
 Extensions:
(a) Connection error → The system shows an error and offers retry.
(b) Insufficient data → The system requests a short diagnostic to personalize the plan.
UC-19: Receiving Listening Practice Feedback
 Primary Actor: User
 Goal in Context: To provide explanatory, AI-based feedback (FR- 05 ) that helps the user
understand why their listening comprehension was incorrect, moving beyond a simple
“correct/incorrect” score.
 Stakeholders and Interests:
System: Aims to improve the user’s listening skills by providing targeted corrections.
AI Engine: Responsible for analyzing incorrect answers and generating explanatory
feedback.
 Preconditions:
The user must be logged in.
The user must have completed an AI-supported listening practice module (FR- 05 ).
 Success Guarantee: The user’s incorrect answers are clearly marked, and relevant,
helpful AI feedback is displayed for each.
 Main Success Scenario:
The user completes and submits the listening practice module.
The system sends the user’s answers to the AI engine for analysis.
The AI engine analyzes incorrect answers and generates explanatory feedback
(e.g., “This was incorrect because the speaker used an idiom...”).
The system presents the results page showing the user’s score, their incorrect
answers, and the AI feedback next to each error.
 Extensions:
(a) No Errors → If the user answers all questions correctly, the system displays a success
message, and no feedback is needed.
UC-20: Receiving Grammar Practice Feedback
 Primary Actor: User
 Goal in Context: To enable the user to learn the grammar rule they violated at the
moment they make the mistake, by providing instant correction (FR-11) during the
adaptive grammar test (FR- 06 ).
 Stakeholders and Interests:
System: Aims to increase the learning effectiveness of the practice by adaptively
reinforcing grammar rules.
AI Engine: Must instantly identify the error type and retrieve the relevant grammar
rule.
 Preconditions:
The user must be logged in.
The user is actively taking an adaptive grammar test (FR- 06 ).
 Success Guarantee: An incorrect answer is instantly flagged, and a clear, rule-based
explanation from the AI is shown to the user.
 Main Success Scenario:
The user selects their answer for a grammar question and presses “Check” (or
“Next”).
The system validates the answer.
The answer is incorrect.
The system requests instant feedback (FR-11) from the AI engine for that specific
error.
The AI engine identifies the grammar rule (e.g., “Incorrect subject-verb
agreement”) and provides a brief explanation.
The system displays the “Incorrect” status and the AI-generated feedback before
presenting the next question.
 Extensions:
(a) Answer is Correct → The system displays “Correct” and moves to the next (harder)
question.
(b) AI Response Timeout (NFR-1) → If the AI response takes longer than 3 seconds
(violating NFR-1), the system flags the answer as “Incorrect” and shows the correct
answer but skips the explanation to avoid blocking the user.
UC-21: Receiving Vocabulary Practice Feedback
 Primary Actor: User
 Goal in Context: To enrich the user’s vocabulary by providing comprehensive, instant
feedback (meaning, usage, example) (FR-11) for incorrect answers, rather than just
providing the correct word.
 Stakeholders and Interests:
System: Aims to effectively improve the user’s vocabulary.
AI Engine: Must access a dictionary/database to provide definitions, synonyms, and
contextual examples.
 Preconditions:
The user must be logged in.
The user is actively taking an adaptive vocabulary test.
 Success Guarantee: The user receives a multi-faceted explanation (meaning, usage,
example) for the word they answered incorrectly.
 Main Success Scenario:
The user submits their answer for a vocabulary question.
The answer is incorrect.
The system requests detailed feedback from the AI engine for the correct word.
The AI engine returns the word’s definition, its type (noun, adjective, etc.), and
an example sentence.
The system displays this comprehensive feedback to the user.
 Extensions:
(a) Answer is Correct → The system displays “Correct” and proceeds.
(b) AI Fails to Retrieve Details (NFR-1) → If the AI cannot provide full details within 3
seconds, the system shows the correct word at a minimum.
UC-22: Monitor System Health and Manage Users
 Primary Actor: Admin
 Goal in Context: To ensure the platform remains stable, performant, and secure by
allowing authorized personnel to monitor resources, manage user access, and generate
administrative reports.
 Stakeholders and Interests:
User: Wants a stable, fast system and expects their account to be secure.
System: Must provide logging and management interfaces for the Admin.
 Preconditions:
The user must be logged in as an “Admin” with the correct permissions.
 Success Guarantee: The Admin successfully views system metrics, modifies a user
account, or generates a report.
 Main Success Scenario:
The Admin logs into the system and navigates to the “Admin Panel.”
The Admin selects “User Management.”
The Admin searches for a specific user’s account.
The Admin selects the user and modifies their role (e.g., “User → Pro User”) or
resets their password.
The system saves the changes to the account in the database and notifies the user
(if password reset).
 Extensions:
(a) User Not Found → If the search yields no results, the system displays “User not
found.”
(b) Permission Denied → If the Admin attempts an action they are not authorized for
(e.g., deleting another Admin), the system logs the attempt and displays an “Access
Denied” error.
UC- 23 : Submit Assessment
 Primary Actor: User
 Goal in Context: To finalize the assessment (FR-08), save all responses, and formally
submit them to the system for grading/analysis (which triggers UC-24).
 Stakeholders and Interests:
System: Must receive the complete set of answers securely and reliably to begin
analysis.
 Preconditions:
The user must be logged in.
The user is on the final page of an assessment (e.g., STS).
The assessment timer (UC-26) has not expired (or has just expired).
 Success Guarantee: All of the user’s responses and session data are securely received,
stored in the database, and marked as ready for analysis.
 Main Success Scenario:
The user answers the final question in the assessment.
The user clicks the “Finish and Submit” button.
The system displays a confirmation modal (“Are you sure you want to submit?”).
The user confirms the submission.
The system gathers all responses, timestamps, and session identifiers (FR-08).
The system saves this data to the database and flags the assessment as
“Completed – Awaiting Analysis.”
The system navigates the user to a “Submission Received” page and triggers UC-
 Extensions:
(a) Time Expires → If the timer (UC-26) reaches 0, the system automatically triggers step
5 (auto-submission).
UC-24: Analyze Responses (AI Diagnostic Engine)
 Primary Actor: System
 Goal in Context: To use AI models (FR-09) to process the raw assessment data (from UC-
23) and calculate detailed scores for each sub-skill (reading, writing, etc.). This is the
core diagnostic step.
 Stakeholders and Interests:
AI Engine: The external or internal service that performs the actual analysis.
User: (Waiting) Wants their results to be generated accurately and quickly (NFR-4).
 Preconditions:
The user’s assessment must be successfully submitted (UC-23) and flagged as
“Awaiting Analysis.”
 Success Guarantee: The AI Engine successfully analyzes all responses, and the calculated
sub-skill scores (e.g., Reading B2, Writing B1) are saved to the database.
 Main Success Scenario:
The system detects a new assessment submission (from UC-23).
The system queues an analysis job.
The AI controller fetches the user’s responses (text, audio, multiple-choice).
The system sends the responses to the appropriate AI models (e.g., speech-to-
text, text analysis) (FR-09).
The AI models return scores and analysis for each sub-skill.
The system saves these sub-skill scores to the database and triggers UC-25.
 Extensions:
(a) AI Engine Error (NFR- 03 ) → If an AI model fails to process a response, the system
logs the error, marks the assessment as “Analysis Failed,” and queues it for a retry. The
user is shown a “Processing...” status.
(b) Analysis Timeout (NFR-4) → If the entire analysis takes longer than 10 seconds, the
system still saves the result when it arrives but logs the performance violation.
UC-25: Aggregate CEFR Level
 Primary Actor: System
 Goal in Context: To combine the various sub-skill scores (from UC-24) into a single,
official, and easily understandable overall CEFR level (FR- 1 0) for the user’s report.
 Stakeholders and Interests:
User: Wants a single, clear level (e.g., “B2”) that summarizes their overall proficiency.
 Preconditions:
The AI analysis (UC-24) must be complete.
All sub-skill scores (Reading, Writing, Speaking, etc.) must be available in the database
for the assessment.
 Success Guarantee: A single, aggregated CEFR level is calculated and saved to the
assessment results record.
 Main Success Scenario:
The system detects that the sub-skill analysis (UC-24) is complete.
The system fetches the set of scores (e.g., Reading B2, Writing B1, Speaking B1,
Grammar B2).
The system applies a predefined weighting algorithm to the scores (FR-10).
The system calculates the final, aggregated CEFR level (e.g., “B1+”).
The system saves this final level to the database and marks the report as “Ready
to View.”
 Extensions:
(a) Missing Sub-skill Score → If a sub-skill score is missing due to an error in UC-24, the
system marks the report as “Incomplete” and alerts an Admin.
(b) Algorithm Error → If the aggregation algorithm encounters an unexpected value, it
logs the error and defaults the status to “Pending.”
UC-26: View Remaining Time
 Primary Actor: User
 Goal in Context: To enable the user to manage their time effectively during the
assessment by displaying the AI-assigned remaining time (FR-16) and providing critical
alerts.
 Stakeholders and Interests:
System: Must enforce the AI-determined time limit (NFR-03 (Performance & Response
Time)) and trigger auto-submission (UC-23) when time expires.
 Preconditions:
The user must have started a timed assessment (e.g., STS).
The system (via FR-16) must have assigned a total duration for the test.
 Success Guarantee: The user can clearly see a live countdown timer throughout the
assessment.
 Main Success Scenario:
The user begins the assessment.
The system fetches the total allotted time from the AI calculation (FR-16) (e.g.,
45 minutes).
The system displays a prominent countdown timer on the screen (e.g., “44:59”).
The timer counts down in real time.
When the timer reaches a threshold (e.g., “5:00”), the system displays an alert
(e.g., changes timer color to red).
When the timer reaches “0:00,” the system automatically triggers the “Submit
Assessment” (UC-23) use case.
 Extensions:
(a) Untimed Practice → If the module is an untimed practice (not the main STS), no timer
is displayed.
2.5 Functional Requirement – Use Case Mapping Table
Use Case ID & Title Corresponding Functional Requirement(s)
UC- 01 – Manage Account FR-01, FR-02, FR- 03
UC- 02 – Setting Learning Purpose FR- 04
UC- 03 – Taking the AI-Compiled Integrated
Exam
FR-07, FR- 21
UC- 04 – Reset Password FR- 03
UC- 05 – Verify Email FR- 02
UC- 06 – Receiving a Hint During the Exam FR- 17
UC- 07 – Receiving Exam Result Report and
Feedback
FR- 11
UC- 08 – Doing Dynamic Reading Practice FR-05, FR- 07
UC- 09 – Doing Dynamic Listening Practice FR-05, FR- 07
UC- 10 – Taking Adaptive Grammar Test FR-05, FR- 06
UC- 11 – Taking Adaptive Vocabulary Test FR-05, FR- 06
UC- 12 – Experiencing Adaptive Difficulty
Increase (Practice Tests)
FR- 06
UC- 13 – Receiving Writing Skill Feedback FR- 15
UC- 14 – Receiving Speaking Feedback FR- 14
UC- 15 – Viewing Progress Chart (Dashboard) FR-12, FR- 18
UC- 16 – Accessing Personal Test Pool FR-18, FR- 21
UC- 17 – Categorizing and Filtering the Test
Pool
FR- 18 , FR- 21
UC- 18 – Receiving Personalized Study Plan FR- 20
UC- 19 – Receiving Listening Practice Feedback FR- 11
UC- 20 – Receiving Grammar Practice
Feedback

FR- 11
UC- 21 – Receiving Vocabulary Practice
Feedback

FR- 11
UC- 22 – Monitor System Health and Manage
Users

FR-13, FR- 19
UC- 23 – Submit Assessment FR- 08

UC- 24 – Analyze Responses (AI Diagnostic
Engine)

FR- 09
UC- 25 – Aggregate CEFR Level FR- 10

UC- 26 – View Remaining Time FR- 16

This is a offline tool, your data stays locally and is not send to any server!
Feedback & Bug Reports
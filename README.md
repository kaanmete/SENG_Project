# SENG_Project
This project is consist of two parts; frontend programming and backend programming. Backend side of this project will be written with Python 3.12.10 version.
Frontend side of this project will be written with HTML5, CSS3 and Javascript.
Purpose of this system is to provide a unified, web-based platform that simplifies English proficiency assessment for Users.


---

## 📁 Project Structure

```bash
LevelAssessment_AI_Engine/
│
├── backend/                              # Python 3.12.10 Backend
│   ├── app.py                            # Application entry point (Flask/FastAPI)
│   ├── config.py                         # Database connection and API Key configurations
│   ├── requirements.txt                  # Dependencies (openai, sqlalchemy, flask, etc.)
│   │
│   ├── controllers/                      # [Class Diagram: Controllers]
│   │   ├── __init__.py
│   │   ├── auth_controller.py            # Login, Register, Verify Email (UC-01, UC-04, UC-05)
│   │   ├── learning_controller.py        # Learning Purpose, Study Plan (UC-02, UC-18)
│   │   ├── exam_controller.py            # Start Exam, Submit Answer, Hints (UC-03, UC-06, UC-08~14)
│   │   ├── result_controller.py          # View Results, Feedback (UC-07, UC-19~21)
│   │   └── admin_controller.py           # System Health, User Management (UC-22)
│   │
│   ├── services/                         # [Class Diagram: Services - Business Logic]
│   │   ├── __init__.py
│   │   ├── user_profile_service.py       # User profile and learning purpose management
│   │   ├── exam_service.py               # Adaptive algorithm (FR-06) and Exam session management
│   │   ├── hint_service.py               # Hint generation logic (UC-06)
│   │   ├── reporting_service.py          # CEFR calculation and report generation (UC-25)
│   │   ├── admin_service.py              # System metrics and admin operations
│   │   └── ai_engine_service.py          # [External Module] OpenAI/LLM integration (FR-09, FR-14, FR-15)
│   │
│   ├── repositories/                     # [Class Diagram: Repositories - Database Access]
│   │   ├── __init__.py
│   │   ├── user_repository.py            # User table operations
│   │   ├── question_repository.py        # Question pool and dynamic question management
│   │   ├── response_repository.py        # Saving user responses
│   │   ├── result_repository.py          # Storing results and reports
│   │   └── system_metrics_repo.py        # Logs for Admin panel
│   │
│   ├── models/                           # [Class Diagram: Domain Entities]
│   │   ├── user.py                       # User, Administrator classes
│   │   ├── question.py                   # Question, QuestionType (Enum)
│   │   ├── response.py                   # UserResponse (Answers)
│   │   └── report.py                     # ResultReport, StudyPlan, CEFRLevel
│   │
│   └── utils/                            # Helper Utilities
│       ├── jwt_handler.py                # Token validation (FR-03)
│       ├── email_sender.py               # Email verification service (FR-02)
│       └── validators.py                 # Input validation
│
├── frontend/                             # HTML5, CSS3, JS Frontend
│   ├── index.html                        # Landing Page
│   │
│   ├── pages/                            # Pages (Separated by Use Cases)
│   │   ├── auth/
│   │   │   ├── login.html                # (UC-01)
│   │   │   ├── register.html             # (UC-01)
│   │   │   ├── verify_email.html         # (UC-05)
│   │   │   └── reset_password.html       # (UC-04)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── user_home.html            # Progress charts (UC-15)
│   │   │   ├── learning_purpose.html     # Setting goals (UC-02)
│   │   │   └── study_plan.html           # Personalized study plan (UC-18)
│   │   │
│   │   ├── exam/
│   │   │   ├── exam_setup.html           # Exam type selection (Reading, Grammar, etc.)
│   │   │   ├── exam_room.html            # Main exam interface (UC-03, Timer for UC-26 is here)
│   │   │   └── result_view.html          # Result and Feedback screen (UC-07)
│   │   │
│   │   └── admin/
│   │       ├── system_health.html        # Server load, uptime (UC-22)
│   │       └── user_management.html      # Managing user roles (UC-22)
│   │
│   ├── css/
│   │   ├── main.css                      # Global styles
│   │   ├── dashboard.css                 # Dashboard grid structure
│   │   ├── exam.css                      # Exam interface and split-screen (for Reading)
│   │   └── responsive.css                # Mobile compatibility
│   │
│   └── js/
│       ├── config.js                     # API Base URL configuration
│       ├── api_client.js                 # Centralized Fetch operations for Backend
│       ├── auth_logic.js                 # Login/Register logic
│       ├── dashboard_logic.js            # Charts (Chart.js integration)
│       │
│       └── exam_modules/                 # Exam Logic (Modular Structure)
│           ├── exam_manager.js           # Exam start/finish logic, Timer (UC-26)
│           ├── question_renderer.js      # Dynamic HTML generation by question type (Reading vs Grammar)
│           ├── adaptive_engine.js        # Frontend-side difficulty tracking (Optional)
│           ├── hint_handler.js           # Hint button functionality (UC-06)
│           └── audio_recorder.js         # Audio recording for Speaking exam (FR-14)
│
└── database/
    └── schema.sql                        # PostgreSQL table creation scripts
```
---
### Project Requirement Traceability Matrix

This table demonstrates the coverage of all Functional Requirements (FR) and Use Cases (UC) defined in the SENG321 Project Documentation within the implemented file structure.

| Use Case ID | Functional Req. ID | Feature Description | Mapped Project Files (Backend / Frontend) |
| :--- | :--- | :--- | :--- |
| **UC-01** | **FR-01, FR-02, FR-03** | **Manage Account** (Register, Login, Email Verification) | `backend/controllers/auth_controller.py` <br> `backend/utils/email_sender.py` <br> `frontend/pages/auth/` |
| **UC-02** | **FR-04** | **Setting Learning Purpose** (Update goals/preferences) | `backend/controllers/learning_controller.py` <br> `backend/services/user_profile_service.py` <br> `frontend/pages/dashboard/learning_purpose.html` |
| **UC-03** | **FR-07, FR-21** | **Taking AI-Compiled Integrated Exam** (Full placement test) | `backend/controllers/exam_controller.py` <br> `backend/services/exam_service.py` <br> `frontend/js/exam_modules/exam_manager.js` |
| **UC-04** | **FR-03** | **Reset Password** (Secure token-based recovery) | `backend/controllers/auth_controller.py` <br> `backend/utils/jwt_handler.py` <br> `frontend/pages/auth/reset_password.html` |
| **UC-05** | **FR-02** | **Verify Email** (Token validation) | `backend/controllers/auth_controller.py` <br> `frontend/pages/auth/verify_email.html` |
| **UC-06** | **FR-17** | **Receiving a Hint** (AI-generated context-aware hints) | `backend/controllers/exam_controller.py` <br> `backend/services/hint_service.py` <br> `frontend/js/exam_modules/hint_handler.js` |
| **UC-07** | **FR-11** | **Exam Result & Feedback** (View detailed report) | `backend/controllers/result_controller.py` <br> `frontend/pages/exam/result_view.html` |
| **UC-08** | **FR-05, FR-07** | **Dynamic Reading Practice** (Passage & Questions) | `backend/services/exam_service.py` <br> `frontend/js/exam_modules/question_renderer.js` |
| **UC-09** | **FR-05, FR-07** | **Dynamic Listening Practice** (Audio playback & Questions) | `backend/services/exam_service.py` <br> `frontend/js/exam_modules/audio_recorder.js` |
| **UC-10** | **FR-05, FR-06** | **Adaptive Grammar Test** (Difficulty adjustment) | `backend/services/exam_service.py` (Adaptive Logic) <br> `frontend/js/exam_modules/question_renderer.js` |
| **UC-11** | **FR-05, FR-06** | **Adaptive Vocabulary Test** (Difficulty adjustment) | `backend/services/exam_service.py` <br> `backend/repositories/question_repository.py` |
| **UC-12** | **FR-06** | **Experiencing Adaptive Difficulty Increase** | `backend/services/exam_service.py` <br> `backend/models/question.py` (Difficulty Logic) |
| **UC-13** | **FR-15** | **Writing Skill Feedback** (AI text analysis) | `backend/services/ai_engine_service.py` <br> `frontend/js/exam_modules/question_renderer.js` |
| **UC-14** | **FR-14** | **Speaking Feedback** (AI speech analysis) | `backend/services/ai_engine_service.py` <br> `frontend/js/exam_modules/audio_recorder.js` |
| **UC-15** | **FR-12, FR-18** | **Viewing Progress Chart** (Dashboard analytics) | `backend/controllers/result_controller.py` <br> `frontend/js/dashboard_logic.js` |
| **UC-16** | **FR-18, FR-21** | **Accessing Personal Test Pool** | `backend/repositories/question_repository.py` <br> `frontend/pages/dashboard/user_home.html` |
| **UC-17** | **FR-18, FR-21** | **Filtering Test Pool** (Categorize by skill/tag) | `frontend/js/dashboard_logic.js` <br> `backend/controllers/exam_controller.py` |
| **UC-18** | **FR-20** | **Receiving Personalized Study Plan** | `backend/controllers/learning_controller.py` <br> `frontend/pages/dashboard/study_plan.html` |
| **UC-19** | **FR-11** | **Listening Feedback** (Explanatory corrections) | `backend/services/reporting_service.py` <br> `backend/services/ai_engine_service.py` |
| **UC-20** | **FR-11** | **Grammar Feedback** (Rule-based explanation) | `backend/services/reporting_service.py` <br> `frontend/pages/exam/result_view.html` |
| **UC-21** | **FR-11** | **Vocabulary Feedback** (Definitions & examples) | `backend/services/reporting_service.py` <br> `backend/services/ai_engine_service.py` |
| **UC-22** | **FR-13, FR-19** | **Monitor System & Manage Users** (Admin Panel) | `backend/controllers/admin_controller.py` <br> `backend/services/admin_service.py` <br> `frontend/pages/admin/` |
| **UC-23** | **FR-08** | **Submit Assessment** (Save to DB) | `backend/controllers/exam_controller.py` <br> `backend/repositories/response_repository.py` |
| **UC-24** | **FR-09** | **Analyze Responses** (AI Engine Processing) | `backend/services/ai_engine_service.py` <br> `backend/services/reporting_service.py` |
| **UC-25** | **FR-10** | **Aggregate CEFR Level** (Calculate A1-C2 Score) | `backend/services/reporting_service.py` <br> `backend/models/report.py` |
| **UC-26** | **FR-16** | **View Remaining Time** (Countdown Timer) | `frontend/js/exam_modules/exam_manager.js` <br> `frontend/css/exam.css` |

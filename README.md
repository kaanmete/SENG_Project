<div align="center">

  <h1>🚀 Level Assessment AI Diagnostic Engine</h1>
  
  <p>
    <strong>A SaaS-based adaptive testing platform designed to evaluate and track English proficiency using AI.</strong>
  </p>

  <p>
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#team">Team</a>
  </p>

  <img src="https://img.shields.io/badge/Course-SENG321-blue?style=flat-square" alt="Course" />
  <img src="https://img.shields.io/badge/Backend-Python%203.12-yellow?style=flat-square&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />

</div>

<br />

## 📖 Project Overview

**Level Assessment (AI Diagnostic Engine)** is a comprehensive web platform that simplifies English proficiency assessment. Unlike traditional static tests, our system uses an **AI-driven adaptive engine** that adjusts question difficulty in real-time based on user performance.

The system evaluates all core language skills: **Reading, Listening, Writing, Speaking, Grammar, and Vocabulary**, providing users with a CEFR-aligned score (A1-C2) and personalized study plans.

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🧠 AI & Adaptive Engine</h3>
      <ul>
        <li><strong>Adaptive Difficulty:</strong> Questions get harder or easier based on real-time performance (FR-06).</li>
        <li><strong>AI Analysis:</strong> Automated grading for <em>Speaking</em> and <em>Writing</em> tasks using NLP models (FR-14, FR-15).</li>
        <li><strong>Smart Hints:</strong> Context-aware clues provided by AI without revealing the full answer (UC-06).</li>
      </ul>
    </td>
    <td width="50%">
      <h3 align="center">📊 User Experience & Admin</h3>
      <ul>
        <li><strong>Integrated Dashboard:</strong> Visual progression charts and CEFR level tracking (FR-12).</li>
        <li><strong>Personalized Study Plans:</strong> AI generates custom learning roadmaps based on weak areas (UC-18).</li>
        <li><strong>Admin Monitoring:</strong> Full system health tracking and user role management (UC-22).</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

This project follows a **Layered Architecture** (Controller-Service-Repository) pattern with a Modern Frontend.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Python 3.12.10 | Core logic using Flask/FastAPI structure. |
| **Frontend** | React + Vite | Component-based UI with Hooks & Context API. |
| **Database** | PostgreSQL | Relational database for Users, Questions, and Results. |
| **AI Engine** | OpenAI API / LLM | External module for adaptive analysis and feedback. |
| **Architecture** | MVC / Layered | Clean separation of concerns (Controllers, Services, Repos). |

---

## 📂 Project Structure

The project is structured to ensure scalability and maintainability, adhering to the SENG321 Class Diagram requirements.

```bash
LevelAssessment_Project/
│
├── backend/                                  # [PYTHON 3.12.10 BACKEND API]
│   ├── app.py                                # Application Entry Point (Flask/FastAPI initialization)
│   ├── config.py                             # Configuration (DB URL, OpenAI API Key, JWT Secret)
│   ├── requirements.txt                      # List of dependencies (flask, sqlalchemy, openai, etc.)
│   ├── .env                                  # Environment variables (Sensitive Data)
│   │
│   ├── controllers/                          # [CONTROLLERS LAYER - HTTP REQUEST HANDLERS]
│   │   ├── __init__.py
│   │   ├── auth_controller.py                # [UC-01, UC-04, UC-05] Login, Register, Verify Email, Reset Password
│   │   ├── exam_controller.py                # [UC-03, UC-23] Start Exam, Submit Answer, Pause/Resume
│   │   ├── hint_controller.py                # [UC-06] Handle Hint requests during exam
│   │   ├── result_controller.py              # [UC-07, UC-15] Fetch Exam Reports & Dashboard Metrics
│   │   ├── learning_controller.py            # [UC-02, UC-18] Manage Learning Purpose & Study Plans
│   │   └── admin_controller.py               # [UC-22] System Health Monitoring & User Role Management
│   │
│   ├── services/                             # [SERVICES LAYER - BUSINESS LOGIC]
│   │   ├── __init__.py
│   │   ├── exam_service.py                   # [FR-05, FR-06] **Adaptive Algorithm**: Calculates next question difficulty
│   │   ├── ai_engine_service.py              # [FR-09, FR-14, FR-15] **OpenAI Wrapper**: NLP for Speaking/Writing analysis
│   │   ├── reporting_service.py              # [UC-25, FR-10] Aggregates scores & Calculates CEFR Level (A1-C2)
│   │   ├── hint_service.py                   # [UC-06, FR-17] Generates context-aware hints via AI
│   │   ├── user_profile_service.py           # [UC-02, FR-04] Logic for updating user goals
│   │   └── admin_service.py                  # [UC-22] Aggregates system logs and performance metrics
│   │
│   ├── repositories/                         # [REPOSITORIES LAYER - DATABASE ACCESS]
│   │   ├── __init__.py
│   │   ├── user_repository.py                # [UC-01] CRUD operations for Users
│   │   ├── question_repository.py            # [UC-16, UC-17] Fetch questions from pool & filter by tags
│   │   ├── response_repository.py            # [FR-08] Save user answers to DB
│   │   ├── result_repository.py              # [UC-07] Store and retrieve final exam reports
│   │   └── system_metrics_repo.py            # [UC-22] Log server load for Admin Dashboard
│   │
│   ├── models/                               # [DOMAIN ENTITIES - DB TABLES]
│   │   ├── __init__.py
│   │   ├── user.py                           # User & Role entities
│   │   ├── question.py                       # Question entity (Type, Difficulty, Content)
│   │   ├── response.py                       # UserResponse entity
│   │   └── report.py                         # ExamResult, StudyPlan, CEFRLevel entities
│   │
│   └── utils/                                # [UTILITIES & HELPERS]
│       ├── __init__.py
│       ├── jwt_handler.py                    # [FR-03] Token generation and validation
│       ├── email_sender.py                   # [FR-02] Logic for sending verification emails
│       └── validators.py                     # Input validation logic
│
├── frontend/                                 # [REACT + VITE FRONTEND]
│   ├── package.json                          # NPM Dependencies
│   ├── index.html                            # Root HTML
│   │
│   └── src/
│       ├── main.jsx                          # React Entry Point
│       ├── App.jsx                           # Routing & Navigation Rules
│       │
│       ├── api/                              # [API LAYER - AXIOS CLIENTS]
│       │   ├── axios.js                      # Base Instance with Interceptors
│       │   ├── authApi.js                    # Endpoints for Auth (Login, Register)
│       │   ├── examApi.js                    # Endpoints for Exam (Start, Submit, Hint)
│       │   ├── userApi.js                    # Endpoints for Dashboard (Stats, Plans)
│       │   └── adminApi.js                   # Endpoints for Admin functions
│       │
│       ├── context/                          # [GLOBAL STATE MANAGEMENT]
│       │   ├── AuthContext.jsx               # User Session State
│       │   └── ExamContext.jsx               # Active Exam State (Timer, Current Question)
│       │
│       ├── hooks/                            # [CUSTOM LOGIC HOOKS]
│       │   ├── useTimer.js                   # [UC-26] Encapsulated Timer Logic
│       │   └── useAdaptiveExam.js            # [FR-06] Logic to handle question transitions
│       │
│       ├── pages/                            # [VIEWS / PAGES]
│       │   ├── auth/
│       │   │   ├── Login.jsx                 # [UC-01]
│       │   │   ├── Register.jsx              # [UC-01]
│       │   │   └── VerifyEmail.jsx           # [UC-05]
│       │   ├── dashboard/
│       │   │   ├── UserDashboard.jsx         # [UC-15] Main User Hub
│       │   │   ├── MyStudyPlan.jsx           # [UC-18] Personalized Plan View
│       │   │   └── LearningPurpose.jsx       # [UC-02] Goal Setting View
│       │   ├── exam/
│       │   │   ├── ExamSetup.jsx             # Exam Type Selection
│       │   │   ├── ExamRoom.jsx              # [UC-03] The Main Exam Interface
│       │   │   └── ExamResult.jsx            # [UC-07] Final Report View
│       │   └── admin/
│       │       └── AdminPanel.jsx            # [UC-22] Admin Management View
│       │
│       └── components/                       # [REUSABLE UI COMPONENTS]
│           ├── common/
│           │   ├── Navbar.jsx
│           │   ├── Sidebar.jsx
│           │   ├── Button.jsx
│           │   └── Modal.jsx
│           ├── exam/
│           │   ├── ExamTimer.jsx             # [UC-26] Visual Timer Component
│           │   ├── QuestionRenderer.jsx      # [Polymorphic] Renders Grammar/Reading/Writing UI
│           │   ├── SplitScreen.jsx           # [UC-08] Layout for Reading Comprehension
│           │   ├── VoiceRecorder.jsx         # [UC-14] Audio Input for Speaking
│           │   └── HintButton.jsx            # [UC-06] Trigger for Hints
│           └── dashboard/
│               ├── ProgressChart.jsx         # [FR-12] Visual Charts (Recharts/Chart.js)
│               └── StatCard.jsx              # Summary Statistics Card
│
└── database/
    └── schema.sql                            # SQL Scripts for Table Creation
```

---

## 📋 Requirement Traceability Matrix

This table maps the **Functional Requirements (FR)** and **Use Cases (UC)** from the SENG321 documentation to the implemented **React & Python** file structure.

| Use Case ID | Functional Req. ID | Feature Description | Mapped Project Files (Backend / Frontend) |
| :--- | :--- | :--- | :--- |
| **UC-01** | **FR-01, FR-02, FR-03** | **Manage Account** (Register, Login, Email Verify) | `backend/controllers/auth_controller.py` <br> `frontend/src/pages/auth/` |
| **UC-02** | **FR-04** | **Setting Learning Purpose** | `backend/controllers/learning_controller.py` <br> `frontend/src/pages/dashboard/LearningPurpose.jsx` |
| **UC-03** | **FR-07, FR-21** | **Taking AI-Compiled Integrated Exam** | `backend/controllers/exam_controller.py` <br> `frontend/src/pages/exam/ExamRoom.jsx` <br> `frontend/src/hooks/useAdaptiveExam.js` |
| **UC-04** | **FR-03** | **Reset Password** | `backend/controllers/auth_controller.py` <br> `frontend/src/pages/auth/ResetPassword.jsx` |
| **UC-05** | **FR-02** | **Verify Email** | `backend/controllers/auth_controller.py` <br> `frontend/src/pages/auth/VerifyEmail.jsx` |
| **UC-06** | **FR-17** | **Receiving a Hint** | `backend/services/hint_service.py` <br> `frontend/src/components/exam/HintButton.jsx` |
| **UC-07** | **FR-11** | **Exam Result & Feedback** | `backend/controllers/result_controller.py` <br> `frontend/src/pages/exam/ExamResult.jsx` |
| **UC-08** | **FR-05, FR-07** | **Dynamic Reading Practice** | `backend/services/exam_service.py` <br> `frontend/src/components/exam/SplitScreen.jsx` |
| **UC-09** | **FR-05, FR-07** | **Dynamic Listening Practice** | `backend/services/exam_service.py` <br> `frontend/src/components/exam/AudioPlayer.jsx` |
| **UC-10** | **FR-05, FR-06** | **Adaptive Grammar Test** | `backend/services/exam_service.py` <br> `frontend/src/components/exam/QuestionRenderer.jsx` |
| **UC-11** | **FR-05, FR-06** | **Adaptive Vocabulary Test** | `backend/repositories/question_repository.py` <br> `frontend/src/hooks/useAdaptiveExam.js` |
| **UC-12** | **FR-06** | **Experiencing Adaptive Difficulty Increase** | `backend/services/exam_service.py` (Algorithm) <br> `backend/models/question.py` |
| **UC-13** | **FR-15** | **Writing Skill Feedback** | `backend/services/ai_engine_service.py` <br> `frontend/src/components/exam/QuestionRenderer.jsx` |
| **UC-14** | **FR-14** | **Speaking Feedback** | `backend/services/ai_engine_service.py` <br> `frontend/src/components/exam/VoiceRecorder.jsx` |
| **UC-15** | **FR-12, FR-18** | **Viewing Progress Chart** (Dashboard) | `backend/controllers/result_controller.py` <br> `frontend/src/components/dashboard/ProgressChart.jsx` |
| **UC-16** | **FR-18, FR-21** | **Accessing Personal Test Pool** | `backend/repositories/question_repository.py` <br> `frontend/src/pages/dashboard/UserDashboard.jsx` |
| **UC-17** | **FR-18, FR-21** | **Filtering Test Pool** | `frontend/src/pages/dashboard/UserDashboard.jsx` <br> `backend/controllers/exam_controller.py` |
| **UC-18** | **FR-20** | **Receiving Personalized Study Plan** | `backend/controllers/learning_controller.py` <br> `frontend/src/pages/dashboard/MyStudyPlan.jsx` |
| **UC-19** | **FR-11** | **Listening Feedback** | `backend/services/reporting_service.py` <br> `frontend/src/pages/exam/ExamResult.jsx` |
| **UC-20** | **FR-11** | **Grammar Feedback** | `backend/services/reporting_service.py` <br> `frontend/src/pages/exam/ExamResult.jsx` |
| **UC-21** | **FR-11** | **Vocabulary Feedback** | `backend/services/reporting_service.py` <br> `frontend/src/pages/exam/ExamResult.jsx` |
| **UC-22** | **FR-13, FR-19** | **Monitor System & Manage Users** (Admin) | `backend/controllers/admin_controller.py` <br> `frontend/src/pages/admin/AdminPanel.jsx` |
| **UC-23** | **FR-08** | **Submit Assessment** | `backend/controllers/exam_controller.py` <br> `backend/repositories/response_repository.py` |
| **UC-24** | **FR-09** | **Analyze Responses** (AI Engine) | `backend/services/ai_engine_service.py` <br> `backend/services/reporting_service.py` |
| **UC-25** | **FR-10** | **Aggregate CEFR Level** | `backend/services/reporting_service.py` <br> `backend/models/report.py` |
| **UC-26** | **FR-16** | **View Remaining Time** (Timer) | `frontend/src/components/exam/ExamTimer.jsx` <br> `frontend/src/hooks/useTimer.js` |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* **Python 3.12.10**
* **PostgreSQL**
* **Node.js** & **npm** (for React)

### 1. Backend Setup (Python)
Navigate to the `backend` directory and set up the environment.

```bash
# Clone the repository
git clone [https://github.com/username/level-assessment-ai.git](https://github.com/username/level-assessment-ai.git)
cd level-assessment-ai/backend

# Create Virtual Environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Run the Server
python app.py
```
*Note: Ensure PostgreSQL is running and `config.py` is updated with your DB credentials.*

### 2. Frontend Setup (React)
Open a new terminal and navigate to the `frontend` directory.

```bash
cd ../frontend

# Install Dependencies
npm install

# Run the Development Server
npm run dev
```
* The application will launch at `http://localhost:5173`.

---

## 👥 Contributors

This project was prepared for the **SENG321 - Software Engineering** course.

* **Umut Özcan** - 230205016
* **Diclenaz Erman** - 230204020
* **Kaan Mete Küçük** - 230201043
* **Burçak Meşelikaş** - 220201010
* **İrem Akay** - 230204059
* **Ekin Eryiğit** - 220205013

**Supervisor:** Prof. Dr. Hakan Çağlar & Res. Asst. Cansu Yörük.

---

<div align="center">
  <sub>Built with ❤️ by the SENG321 Team.</sub>
</div>

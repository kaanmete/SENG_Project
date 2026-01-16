# 🚀 LEVEL ASSESSMENT (AI DIAGNOSTIC ENGINE)

> **Adaptive English Proficiency Assessment Platform powered by AI**
> Developed for **SENG 321 – Software Engineering**

An advanced full‑stack web application that evaluates English proficiency across multiple skills using adaptive testing and LLM‑based diagnostics. The system intelligently maps learners to **CEFR levels (A1–C2)** while providing real‑time feedback, analytics, and administrative control.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://aidiagnosticengine.up.railway.app)
> **Live Demo:** [aidiagnosticengine.up.railway.app](https://aidiagnosticengine.up.railway.app)

---

## 📌 Project Highlights

* 🧠 LLM‑powered diagnostic engine (Llama‑3 via Groq/Meta)
* 📊 Skill‑based analysis: Vocabulary, Grammar, Reading, Listening, Writing
* 🎯 Adaptive testing algorithm
* ✍️ AI Writing Lab with real‑time feedback & scoring
* 👥 Role‑based access (User / Admin)
* 🔐 Secure authentication with JWT & email verification
* 📈 Visual performance analytics & AI study advice
* ⚡ High‑performance backend with FastAPI

---

## 👥 Team Members

| Name & Surname       | Student ID |
| -------------------- | ---------- |
| **Umut Özcan**       | 230205016  |
| **Kaan Mete Küçük**  | 230201043  |
| **Burçak Meşelikaş** | 220201010  |
| **Diclenaz Erman**   | 230204020  |
| **İrem Akay**        | 230204059  |
| **Ekin Eryiğit**     | 220205013  |

---

## ✨ Key Features

### 🎯 Adaptive Testing

Questions dynamically adjust based on the user's previous answers to precisely estimate proficiency.

### ✍️ AI Writing Lab

* Automatic scoring
* Grammar & coherence analysis
* Improvement suggestions powered by LLM

### 📊 Performance Analytics

* Skill‑based progress tracking
* CEFR history visualization
* AI‑generated personalized study advice

### 👨‍💼 Admin Dashboard

* User management
* System statistics
* Role‑based authorization

### 🔐 Security

* OAuth2 + JWT authentication
* Bcrypt password hashing
* SMTP email verification

### 🌍 CEFR Leveling

Intelligent score‑to‑level mapping from **A1 → C2**

---

## 🛠 Technical Stack

### Backend

| Technology              | Purpose                             |
| ----------------------- | ----------------------------------- |
| **FastAPI**             | High‑performance REST API framework |
| **PostgreSQL**          | Relational database                 |
| **SQLAlchemy**          | ORM & database modeling             |
| **Llama‑3 (Groq/Meta)** | AI diagnostic engine                |
| **Passlib (Bcrypt)**    | Secure password hashing             |
| **JWT (OAuth2)**        | Authentication & authorization      |

### Frontend

| Technology       | Purpose               |
| ---------------- | --------------------- |
| **React.js**     | UI framework          |
| **Tailwind CSS** | Utility‑first styling |
| **Axios**        | API communication     |
| **Lucide React** | Icon library          |

---

## 📂 Project Structure

```text
SENG_Project/
├── backend/               # 🐍 FastAPI Application (Python)
│   ├── app/
│   │   ├── routers/       # 📍 API Route Handlers
│   │   │   ├── admin.py       # Admin-only endpoints (user management, stats)
│   │   │   ├── exams.py       # Exam logic (writing, adaptive tests, history)
│   │   │   ├── stats.py       # Statistics & analytics data aggregation
│   │   │   └── users.py       # User profile & account management endpoints
│   │   ├── utils/         # 🛠️ Helper Utilities
│   │   │   └── email.py       # SMTP email sender for account verification
│   │   ├── auth.py        # 🔐 Security (OAuth2 scheme, Token generation, Hashing)
│   │   ├── database.py    # 🗄️ Database SessionManager & connection logic
│   │   ├── models.py      # 🏗️ SQLAlchemy Database Models (User, ExamAttempt)
│   │   └── schemas.py     # 📐 Pydantic Data Schemas (Validation & Serialization)
│   └── main.py            # 🚀 App Entry Point (CORS code, Router inclusion)
└── frontend/              # ⚛️ React Application (JavaScript)
    ├── src/
    │   ├── api/           # 🌐 API Services
    │   │   └── axios.js       # Global Axios instance with Interceptors
    │   ├── components/    # 🧩 Reusable UI Components
    │   │   └── PrivateRoute.js # HOC for protecting routes (redirects if not logged in)
    │   ├── pages/         # 📄 Application Views
    │   │   ├── AdminDashboard.js # Admin control panel view
    │   │   ├── Dashboard.js      # User's main hub (recent exams, progress)
    │   │   ├── Exam.js           # Adaptive multiple-choice exam interface
    │   │   ├── LandingPage.js    # Public landing page (features, CTA)
    │   │   ├── LearningPurpose.js# Onboarding step (collects user goals)
    │   │   ├── Login.js          # User authentication page
    │   │   ├── Profile.js        # User profile settings & detailed history
    │   │   ├── Register.js       # New account creation page
    │   │   ├── TestSelection.js  # Menu to choose exam type (Reading, Writing, etc.)
    │   │   ├── VerifyEmail.js    # Page handling email verification token
    │   │   └── WritingExam.js    # AI-powered writing assessment interface
    │   └── App.js         # 🌳 Root Component (Routing definitions)
```

---

## ⚙️ Installation & Setup

### 🔧 Prerequisites

* Python **3.8+**
* Node.js **16+**
* PostgreSQL

---

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

#### ⚠️ Important Bcrypt Compatibility Note (Python 3.13)

```bash
pip install bcrypt==4.0.1
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
GROQ_API_KEY=your_groq_api_key

# SMTP Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 🚀 Running the Project

### Start Backend

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://localhost:8000
```

Swagger Docs:

```
http://localhost:8000/docs
```

---

### Start Frontend

```bash
npm start
```

Frontend will run at:

```
http://localhost:3000
```

---

## 🛡 Admin Access

To enable admin privileges:

1. Open PostgreSQL
2. Locate the user in the `users` table
3. Change the `role` field:

```sql
UPDATE users SET role = 'admin' WHERE email = 'user@email.com';
```

4. Re‑login
5. The **Admin Panel** link will appear automatically

---

## 📜 API Documentation

FastAPI automatically generates interactive docs:

* Swagger UI: `/docs`
* OpenAPI JSON: `/openapi.json`

---

## 📝 License

This project is developed for **academic purposes** under the **SENG 321 Software Engineering** course curriculum.

---

## ⭐ Acknowledgments

* FastAPI Team
* Meta AI / Groq
* Open‑source community

---

> Built with passion, engineering discipline, and AI innovation ❤️

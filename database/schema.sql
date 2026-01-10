-- SENG321 Level Assessment AI - Database Schema
-- Version: 1.0 

-- 1. USERS TABLE (UC-01, UC-02, UC-22)
-- Stores user credentials, roles, and learning purpose.
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'user' or 'admin'
    learning_purpose VARCHAR(100), -- Exam, Business, Travel, etc.
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. QUESTIONS TABLE (FR-05, FR-06)
-- Pool of questions for Reading, Grammar, Vocabulary, etc.
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'grammar', 'vocabulary', 'reading', 'listening', 'speaking', 'writing'
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 6), -- 1=A1, 6=C2
    content TEXT NOT NULL, -- The question text or reading passage
    media_url VARCHAR(255), -- URL for Audio (Listening) or Image
    options JSONB, -- Stores choices for MCQ: {"A": "...", "B": "..."}
    correct_answer TEXT, -- The correct option key (e.g., "A") or expected text
    tags VARCHAR(255) -- E.g., "past-tense", "business-vocab"
);

-- 3. EXAMS (SESSIONS) TABLE (UC-03, UC-07, UC-25)
-- Represents a single exam session taken by a user.
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exam_type VARCHAR(50), -- 'integrated', 'grammar_practice', 'reading_practice'
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed'
    total_score FLOAT,
    cefr_level VARCHAR(10), -- A1, A2, B1, B2, C1, C2
    feedback_summary TEXT -- AI generated overall feedback
);

-- 4. RESPONSES TABLE (FR-08, UC-23, UC-24)
-- Stores every single answer given by the user.
CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    user_answer TEXT, -- Selected option ("A") or written text/audio URL
    is_correct BOOLEAN,
    time_taken_seconds INTEGER, -- To track performance/speed
    ai_feedback TEXT -- Specific feedback for this question (FR-11)
);

-- 5. STUDY PLANS TABLE (UC-18, FR-20)
-- AI generated study roadmap based on exam results.
CREATE TABLE study_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_level VARCHAR(10),
    tasks JSONB -- List of tasks: [{"week": 1, "topic": "Past Tense", "status": "pending"}]
);

-- 6. SYSTEM METRICS TABLE (UC-22)
-- Logs for Admin Dashboard.
CREATE TABLE system_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(50), -- 'cpu_load', 'active_users', 'error_log'
    value FLOAT,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
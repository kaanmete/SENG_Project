-- SENG351 Level Assessment AI - Full Database Schema

-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    learning_purpose VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. QUESTIONS TABLE
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'grammar', 'vocabulary', etc.
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 6), -- 1=A1, 6=C2
    content TEXT NOT NULL,
    media_url VARCHAR(255),
    options JSONB, -- {"A": "...", "B": "..."}
    correct_answer TEXT,
    tags VARCHAR(255)
);

-- 3. EXAMS TABLE
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exam_type VARCHAR(50),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'in_progress',
    total_score FLOAT,
    cefr_level VARCHAR(10), -- A1 to C2
    feedback_summary TEXT
);

-- 4. RESPONSES TABLE
CREATE TABLE responses (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    user_answer TEXT,
    is_correct BOOLEAN,
    time_taken_seconds INTEGER,
    ai_feedback TEXT -- Dynamic feedback per question
);

-- 5. STUDY PLANS TABLE
CREATE TABLE study_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_level VARCHAR(10),
    tasks JSONB -- [{"week": 1, "topic": "Past Tense"}]
);

-- 6. SYSTEM METRICS TABLE
CREATE TABLE system_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(50),
    value FLOAT,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

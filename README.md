# AI Diagnostic Engine - Backend API

A comprehensive SaaS-based adaptive testing platform designed to evaluate and track users' English proficiency with AI-powered feedback and CEFR-aligned assessments.

## 🚀 Features

### Core Functionality (Functional Requirements)

- **FR-01**: User registration with email and password
- **FR-02**: Email verification with one-time tokens
- **FR-03**: Secure JWT-based authentication and password reset
- **FR-04**: User profile management and learning purpose selection
- **FR-05**: Personalized adaptive assessment questions
- **FR-06**: Real-time difficulty adjustment based on performance
- **FR-07**: AI-generated complete CEFR-based tests (reading, writing, listening, speaking, vocabulary, grammar)
- **FR-08**: Response recording and storage with timestamps
- **FR-09**: AI-powered response analysis with sub-skill scoring
- **FR-10**: Single CEFR level aggregation algorithm
- **FR-11**: AI-generated feedback with improvement suggestions
- **FR-12**: Analytics dashboard with progress charts
- **FR-13**: System health metrics for administrators
- **FR-14**: Speaking feedback with pronunciation analysis
- **FR-15**: Writing feedback with grammar correction
- **FR-16**: AI-generated hints without revealing answers
- **FR-17**: Exam session categorization by level and tags
- **FR-18**: Test pool organization and filtering
- **FR-19**: Admin user management
- **FR-20**: Personalized AI-generated study plans
- **FR-21**: Test pool access and filtering
- **FR-22**: Admin system monitoring

### Non-Functional Requirements

- **NFR-01**: 99.5% uptime target
- **NFR-02**: Support for 500 concurrent sessions
- **NFR-03**: <15s question load time, <5s grammar/audio input processing
- **NFR-04**: Real-time WebSocket connections for scoring
- **NFR-05**: Modular architecture (separate reusable components)
- **NFR-06**: Comprehensive audit logging
- **NFR-07**: Rate limiting and abuse prevention

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **WebSocket**: Socket.IO
- **AI Engine**: OpenAI GPT-4
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **Logging**: Winston
- **Validation**: express-validator
- **Security**: Helmet, express-rate-limit, CORS

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🏗️ Project Structure

```
SENG_Project/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection pool
│   ├── controller/
│   │   ├── authController.js    # Authentication endpoints
│   │   ├── userController.js    # User management endpoints
│   │   ├── examController.js    # Exam and adaptive testing
│   │   ├── assessmentController.js  # Assessment submission & analysis
│   │   └── adminController.js   # Admin panel endpoints
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── rateLimiter.js      # Rate limiting middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── examRoutes.js
│   │   ├── assessmentRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── aiEngineService.js  # OpenAI integration
│   │   └── emailService.js     # Email verification service
│   ├── utils/
│   │   ├── logger.js           # Winston logger
│   │   ├── jwt.js              # JWT utilities
│   │   └── validation.js       # Validation rules
│   ├── logs/                   # Application logs
│   ├── .env                    # Environment variables
│   ├── .env.example            # Example environment variables
│   ├── package.json
│   └── server.js               # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/
│   │   │   └── api.js          # API configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── database/
│   └── schema.sql              # Database schema
├── railway.json                # Railway deployment config
├── Procfile                    # Process file for deployment
└── README.md

## 🔧 Environment Variables

### Backend (.env)

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (Railway will provide this)
DATABASE_URL=your_railway_postgresql_url

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@aidiagnostic.com

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-url.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
# API URL (Backend URL from Railway)
VITE_API_URL=https://your-backend-url.railway.app

# WebSocket URL
VITE_WS_URL=wss://your-backend-url.railway.app
```

## 🚀 Deployment to Railway

### Prerequisites
1. Railway account (https://railway.app)
2. GitHub repository
3. OpenAI API key

### Step 1: Database Setup

1. Go to Railway dashboard
2. Create a new project
3. Add **PostgreSQL** database
4. Copy the `DATABASE_URL` from the connection settings
5. Run the schema:
   ```bash
   # Connect to your Railway PostgreSQL
   psql $DATABASE_URL < database/schema.sql
   ```

### Step 2: Backend Deployment

1. In Railway, click **"New"** → **"GitHub Repo"**
2. Select your repository
3. Railway will auto-detect the project
4. Add environment variables in Railway:
   - `DATABASE_URL` (from PostgreSQL service)
   - `OPENAI_API_KEY`
   - `JWT_SECRET`
   - `EMAIL_SERVICE`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

5. Railway will automatically deploy using `railway.json` config

### Step 3: Frontend Deployment

#### Option A: Deploy frontend on Netlify/Vercel
1. Update `frontend/.env`:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   VITE_WS_URL=wss://your-backend-url.railway.app
   ```
2. Deploy to Netlify or Vercel
3. Update `FRONTEND_URL` in Railway backend environment variables

#### Option B: Serve frontend from backend
1. Build frontend: `cd frontend && npm run build`
2. Copy `dist` folder to `backend/public`
3. Backend will serve static files

### Step 4: Verify Deployment

1. Check health endpoint: `https://your-backend-url.railway.app/health`
2. Test API root: `https://your-backend-url.railway.app/`
3. Monitor logs in Railway dashboard

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile (protected)

### User Management
- `PUT /api/users/learning-purpose` - Update learning purpose
- `GET /api/users/exam-history` - Get exam history
- `GET /api/users/analytics` - Get user analytics
- `GET /api/users/study-plan` - Get personalized study plan
- `DELETE /api/users/account` - Delete account

### Exams
- `POST /api/exams/start` - Start new exam
- `GET /api/exams/active` - Get active exam
- `GET /api/exams/test-pool` - Get available tests
- `GET /api/exams/:examId/next-question` - Get next adaptive question
- `GET /api/exams/:examId/question/:questionId/hint` - Get question hint
- `POST /api/exams/:examId/submit-answer` - Submit answer

### Assessments
- `POST /api/assessments/:examId/submit` - Submit exam for grading
- `POST /api/assessments/:examId/analyze` - Analyze exam responses
- `GET /api/assessments/:examId/results` - Get exam results
- `POST /api/assessments/writing-feedback` - Get writing feedback
- `POST /api/assessments/speaking-feedback` - Get speaking feedback

### Admin (Requires admin role)
- `GET /api/admin/health` - System health metrics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user details
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/reports/usage` - Get usage reports
- `GET /api/admin/metrics` - Get system metrics

## 🔌 WebSocket Events

### Client → Server
- `join-exam` - Join exam room
- `leave-exam` - Leave exam room
- `score-update` - Update score
- `question-answered` - Question answered notification

### Server → Client
- `score-updated` - Score updated
- `progress-update` - Progress update

## 🧪 Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Database Schema

See `database/schema.sql` for the complete schema including:
- `users` - User accounts
- `questions` - Question bank
- `exams` - Exam sessions
- `responses` - User responses
- `study_plans` - Personalized study plans
- `system_metrics` - System monitoring

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Rate limiting on all endpoints
- Strict rate limiting on auth endpoints (5 requests per 15 min)
- Helmet.js security headers
- CORS configuration
- Input validation with express-validator
- SQL injection prevention with parameterized queries
- Comprehensive audit logging

## 📝 License

This project is part of SENG351 coursework.

## 👥 Support

For deployment issues or questions, contact the development team.

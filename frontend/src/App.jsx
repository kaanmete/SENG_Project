import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ExamRoom from './pages/ExamRoom';
import ResultPage from './pages/ResultPage';
import AdminPanel from './pages/AdminPanel';
import LearningPurpose from './pages/LearningPurpose';

/**
 * Main Application Component
 * Manages all routing and navigation for the AI Diagnostic Engine.
 */
function App() {
  return (
    /* React Router v7 compatibility flags enabled */
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
        <Routes>
          {/* Main Landing Page describing the project vision */}
          <Route path="/" element={<Home />} />
          
          {/* Main User Interface (UC-15) - Accessible via /dashboard or as home if logged in */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Authentication & User Management (UC-01) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* AI-Compiled Integrated Exam Process (UC-03) */}
          <Route path="/exam" element={<ExamRoom />} />
          
          {/* Result Reporting & Diagnostic Feedback (UC-07) */}
          <Route path="/results" element={<ResultPage />} />
          
          {/* User Preferences & Purpose Selection (UC-02 / FR-04) */}
          <Route path="/purpose" element={<LearningPurpose />} />
          
          {/* Administrative Monitoring & System Health (UC-22) */}
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Redirect all undefined routes back to the landing page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
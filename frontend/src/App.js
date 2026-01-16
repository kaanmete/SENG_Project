import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import LandingPage from './pages/LandingPage'; // <-- Yeni Sayfa
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam';
import WritingExam from './pages/WritingExam';
import Profile from './pages/Profile';
import TestSelection from './pages/TestSelection';
import LearningPurpose from './pages/LearningPurpose';
import VerifyEmail from './pages/VerifyEmail';
import AdminDashboard from './pages/AdminDashboard';

// Route Koruması (Giriş yapmamışsa Dashboard'a giremesin)
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
            {/* 👇 Ana Sayfa artık LandingPage */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Login Sayfası */}
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/tests" element={<PrivateRoute><TestSelection /></PrivateRoute>} />

            {/* Korumalı Sayfalar */}
            <Route path="/dashboard" element={
                <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            <Route path="/learning-purpose" element={<LearningPurpose />} />

            <Route path="/exam" element={
                <PrivateRoute><Exam /></PrivateRoute>
            } />
            <Route path="/writing-exam" element={
                <PrivateRoute><WritingExam /></PrivateRoute>
            } />
            <Route path="/profile" element={
                <PrivateRoute><Profile /></PrivateRoute>
            } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
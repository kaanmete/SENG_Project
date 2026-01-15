import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam'; // <--- 1. BURAYI EKLE
import PrivateRoute from './components/PrivateRoute';
import WritingExam from './pages/WritingExam';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* 👇 2. BURAYI EKLE: Sınav Rotası */}
          <Route path="/exam" element={
            <PrivateRoute>
              <Exam />
            </PrivateRoute>
          } />

          <Route path="/writing" element={
            <PrivateRoute>
              <WritingExam />
            </PrivateRoute>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
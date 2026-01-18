import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_exams: 0,
        avg_score: 0,
        history: [],
        level: "-",
        ai_analysis: ""
    });

    // Retrieve user information from local storage
    const user = JSON.parse(localStorage.getItem('user')) || { 
        full_name: "Guest User", 
        email: "guest@example.com",
        learning_purpose: "General"
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Pull statistics and AI analytics from the backend
                const response = await api.get('/users/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Stats fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-bold">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mr-3"></div>
            Analyzing your progress...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-10 px-4">
            
            {/* Üst Navigasyon */}
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-500 hover:text-gray-900 font-bold flex items-center gap-2 transition-all"
                >
                    ← Back to Dashboard
                </button>
                <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">My Performance</h1>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: USER CARD */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center relative overflow-hidden">
                        <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-6 rotate-3 shadow-lg shadow-blue-200">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">{user.full_name}</h2>
                        <p className="text-gray-400 text-sm mb-6">{user.email}</p>
                        
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest mb-8 inline-block">
                            Goal: {user.learning_purpose || "Exam Preparation"}
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="w-full py-4 px-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all active:scale-95"
                        >
                            Logout
                        </button>
                    </div>

                    {/* AI ANALYSIS BOX */}
                    <div className="bg-indigo-900 p-6 rounded-[2rem] text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12">🤖</div>
                        <h3 className="text-indigo-300 font-black text-xs uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <span>🤖</span> AI Tutor Advice
                        </h3>
                        <p className="text-sm font-medium leading-relaxed italic opacity-90">
                            "{stats.ai_analysis || "Keep taking exams to get personalized growth advice!"}"
                        </p>
                    </div>
                </div>

                {/* RIGHT: STATISTICS AND HISTORY */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* İstatistik Kartları */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            <span className="block text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Exams</span>
                            <span className="text-4xl font-black text-gray-900">{stats.total_exams}</span>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                            <span className="block text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Avg. Score</span>
                            <span className="text-4xl font-black text-blue-600">{stats.avg_score}</span>
                        </div>
                        {/* 🎯 AI LEVEL KARTI */}
                        <div className="bg-emerald-500 p-6 rounded-[2rem] shadow-lg shadow-emerald-100 text-white relative">
                            <span className="block text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] mb-2">English Level</span>
                            <span className="text-4xl font-black">{stats.level}</span>
                            <div className="absolute right-6 bottom-6 bg-white/20 px-2 py-1 rounded text-[8px] font-bold uppercase">AI Verified</div>
                        </div>
                    </div>

                    {/* PAST ACTIVITY */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-gray-200/50 border border-gray-100">
                        <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
                            Recent Activity
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        </h3>
                        
                        {stats.history.length > 0 ? (
                            <div className="space-y-4">
                                {stats.history.map((exam, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                                {exam.skill_type === 'Vocabulary' ? '📚' : exam.skill_type === 'Reading' ? '📖' : '🧠'}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800">{exam.skill_type} Test</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    {new Date(exam.date_taken).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-black text-blue-600">{exam.score}</span>
                                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">Score</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                <div className="text-5xl mb-4 opacity-20">📊</div>
                                <p className="text-gray-400 font-medium">You haven't completed any exams yet.</p>
                                <button 
                                    onClick={() => navigate('/dashboard')}
                                    className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    Start Your First Exam →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;

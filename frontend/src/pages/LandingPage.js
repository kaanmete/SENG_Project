import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white font-sans text-gray-800">
            
            {/* --- NAVBAR --- */}
            <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                {/* 👇 LOGO BURADA DEĞİŞTİ 👇 */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200">
                        AI
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        Diagnostic Engine
                    </span>
                </div>
                {/* 👆 LOGO BURADA DEĞİŞTİ 👆 */}

                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="w-full max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-wide uppercase">
                    🚀 AI-Powered Learning
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
                    Master English through <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Experience, Not Memorization.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
                    Enhance your Reading, Writing, Listening, and Grammar skills with AI-driven exams. 
                    Get instant feedback and track your progress step by step.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-blue-200 shadow-xl"
                    >
                        Get Started →
                    </button>
                    <button className="px-8 py-4 text-lg font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                        Learn More
                    </button>
                </div>
            </header>

            {/* --- FEATURES --- */}
            <section className="w-full max-w-7xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl mb-6">📝</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Writing Analysis</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Our AI reviews your essays in seconds, corrects grammar mistakes, and provides detailed feedback scores.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl mb-6">🎯</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Adaptive Questions</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Practice with Reading and Listening questions tailored exactly to your proficiency level.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl mb-6">📊</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
                        <p className="text-gray-500 leading-relaxed">
                            Visualize your improvement over time with detailed charts and identify areas that need more focus.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="border-t border-gray-100 py-10 text-center">
                <p className="text-gray-400 font-medium">© 2024 AI Diagnostic Engine. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
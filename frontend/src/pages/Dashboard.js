import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ full_name: "Explorer", role: "user" });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try { 
                setUser(JSON.parse(storedUser)); 
            } catch (e) { 
                console.error(e); 
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Core Course Modules 
    const skillModules = [
        { title: "Vocabulary", skill: "Vocabulary", icon: "📚", desc: "Lexical mastery", color: "hover:bg-blue-50" },
        { title: "Grammar", skill: "Grammar", icon: "✍️", desc: "Syntax & structure", color: "hover:bg-purple-50" },
        { title: "Reading", skill: "Reading", icon: "📖", desc: "Comprehension", color: "hover:bg-orange-50" },
        { title: "Listening", skill: "Listening", icon: "🎧", desc: "Aural training", color: "hover:bg-pink-50" }
    ];

    // Side Tools 
    const tools = [
        { title: "Writing Lab", skill: "Writing", icon: "📝", navigate: "/writing-exam" },
        { title: "Learning Goals", skill: "Purpose", icon: "🎯", navigate: "/learning-purpose" },
        { title: "Performance", skill: "Profile", icon: "📊", navigate: "/profile" },
        // If the user is an admin, add the Admin Panel to the list as well.
        ...(user.role === 'admin' ? [{ title: "Admin Panel", skill: "Admin", icon: "🛡️", navigate: "/admin" }] : [])
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans pb-10">
            {/* --- 1. MINIMAL HEADER --- */}
            <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">AI</div>
                        <span className="font-bold text-gray-900 tracking-tight">DIAGNOSTIC ENGINE</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-gray-700 sm:block hidden">Hi, {user.full_name}</span>
                            {user.role === 'admin' && <span className="text-[10px] font-bold text-red-500 uppercase">Administrator</span>}
                        </div>
                        <button onClick={logout} className="text-xs font-bold text-red-500 hover:text-red-700 ml-2">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 mt-10">
                
                {/* --- LAYER 2: MAIN EXAM & AI STATUS (SIDE-BY-SIDE) --- */}
                <div className="flex flex-col lg:flex-row gap-6 mb-10">
                    {/* Mixed Exam - Kahraman Kart */}
                    <div 
                        onClick={() => navigate('/exam', { state: { skill: 'Mixed' } })}
                        className="flex-1 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-2">Primary Assessment</h2>
                            <h3 className="text-3xl font-black text-gray-900 mb-4 leading-tight">Full Adaptive <br/> Mixed Exam</h3>
                            <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm group-hover:bg-indigo-700 transition-colors">Start Session</button>
                        </div>
                        <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-[0.03] group-hover:rotate-12 transition-transform">🚀</div>
                    </div>

                    {/* AI Status - Information */}
                    <div className="w-full lg:w-1/3 bg-gray-900 rounded-3xl p-8 text-white flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">System Ready</span>
                        </div>
                        <h4 className="text-lg font-bold mb-2">Adaptive AI Active</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">Analyzing your previous 13 responses to refine next difficulty curves.</p>
                    </div>
                </div>

                {/* --- 3rd LAYER: MAIN COURSE MODULES (4-MOD GRID) --- */}
                <div className="mb-10">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Skill Modules</h3>
                        <span className="text-xs text-gray-400 font-bold uppercase">4 Skills Integrated</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {skillModules.map((m, i) => (
                            <div key={i} onClick={() => navigate('/tests', { state: { skill: m.skill } })}
                                 className={`bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group ${m.color}`}>
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{m.icon}</div>
                                <h4 className="font-bold text-gray-900">{m.title}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- 4TH LAYER: SIDE VEHICLES (QUICK ACCESS - COMPACT) --- */}
                <div>
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Personal Tools</h3>
                        <span className="text-xs text-gray-400 font-bold uppercase">Management</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {tools.map((t, i) => (
                            <div key={i} onClick={() => navigate(t.navigate)}
                                 className={`bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between transition-colors cursor-pointer group ${t.title === "Admin Panel" ? 'hover:bg-red-50 border-red-100' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{t.icon}</span>
                                    <span className={`font-bold text-sm ${t.title === "Admin Panel" ? 'text-red-600' : 'text-gray-800'}`}>{t.title}</span>
                                </div>
                                <span className={`${t.title === "Admin Panel" ? 'text-red-300 group-hover:text-red-600' : 'text-gray-300 group-hover:text-indigo-600'} transition-colors`}>→</span>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LearningPurpose = () => {
    const navigate = useNavigate();
    const [selectedPurpose, setSelectedPurpose] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPurpose, setCurrentPurpose] = useState("");

    // Options the user can choose from
    const purposes = [
        { id: "Exam Preparation", title: "Academic Exams", desc: "Focus on IELTS, TOEFL, or school assessments.", icon: "🎓" },
        { id: "Business", title: "Business & Work", desc: "Professional communication and formal English.", icon: "💼" },
        { id: "Travel", title: "Travel & Daily Life", desc: "Surviving and speaking in English-speaking countries.", icon: "✈️" },
        { id: "Hobby", title: "Personal Hobby", desc: "Reading books, watching movies, or gaming.", icon: "🎮" }
    ];

    useEffect(() => {
        // Retrieve current user information and assign it to the state if it already has a purpose.
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.learning_purpose) {
                    setCurrentPurpose(user.learning_purpose);
                    setSelectedPurpose(user.learning_purpose);
                }
            } catch (e) {
                console.error("User data parse error", e);
            }
        }
    }, []);

    const handleSave = async () => {
        if (!selectedPurpose) return;
        setLoading(true);
        try {
            // Send an update request to the backend
            const response = await api.post('/users/update-purpose', { purpose: selectedPurpose });
            
            // Update user information in LocalStorage (so it appears correctly in the Dashboard)
            const userData = JSON.parse(localStorage.getItem('user'));
            userData.learning_purpose = response.data.purpose;
            localStorage.setItem('user', JSON.stringify(userData));

            alert("Your learning goal has been updated! 🎯");
            navigate('/dashboard');
        } catch (error) {
            console.error("Update error:", error);
            alert("An error occurred while saving. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-16 px-6 font-sans">
            <div className="max-w-2xl w-full">
                {/* TITLE AREA */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">What is your goal?</h1>
                    <p className="text-slate-500">
                        Select your primary reason for learning English. This helps our AI personalize your feedback.
                    </p>
                </div>

                {/* ARRANGEMENT OF THE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {purposes.map((p) => (
                        <div 
                            key={p.id}
                            onClick={() => setSelectedPurpose(p.id)}
                            className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 transform 
                                ${selectedPurpose === p.id 
                                    ? 'border-indigo-600 bg-indigo-50 shadow-lg -translate-y-1' 
                                    : 'border-white bg-white hover:border-slate-200 shadow-sm hover:-translate-y-1'}`}
                        >
                            <div className="text-4xl mb-4">{p.icon}</div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">{p.title}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                            
                            {/* Select Mark */}
                            <div className={`mt-4 flex justify-end transition-opacity ${selectedPurpose === p.id ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">
                                    ✓
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={loading || !selectedPurpose || selectedPurpose === currentPurpose}
                        className={`px-10 py-3 rounded-2xl font-bold text-white transition-all shadow-lg
                            ${loading || !selectedPurpose || selectedPurpose === currentPurpose
                                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'}`}
                    >
                        {loading ? "Saving..." : "Save My Goal"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LearningPurpose;

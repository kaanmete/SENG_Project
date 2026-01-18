import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TestSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const skill = location.state?.skill || "Vocabulary"; // Skill from Dashboard
    
    const [testCount, setTestCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestCount = async () => {
            try {
                // Find out how many tests there are from the backend
                const response = await api.get(`/exams/count-tests?skill=${skill}`);
                setTestCount(response.data.total_tests);
            } catch (error) {
                console.error("Test sayısı alınamadı:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestCount();
    }, [skill]);

    const handleSelectTest = (testNumber) => {
        //We send both the skill number and the test number to the exam page.
        navigate('/exam', { state: { skill: skill, testNumber: testNumber } });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-900 font-bold">
                        ← Back
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900">{skill} Tests</h1>
                </div>

                {/* Test List */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading tests...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: testCount }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => handleSelectTest(num)}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 transition-all text-left group"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {num}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">10 Questions</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {skill} Test {num}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Click to start this specific test set.
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestSelection;

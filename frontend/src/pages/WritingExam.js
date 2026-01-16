import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const WritingExam = () => {
    const navigate = useNavigate();
    
    const [topic, setTopic] = useState(""); 
    const [userText, setUserText] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const [isTopicLoading, setIsTopicLoading] = useState(true); 
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await api.get('/exams/writing-topic');
                setTopic(response.data.topic);
            } catch (error) {
                console.error("Topic fetch error:", error);
                setTopic("An error occurred while loading the topic. Please refresh the page.");
            } finally {
                setIsTopicLoading(false);
            }
        };
        fetchTopic();
    }, []);

    const handleSubmit = async () => {
        if (userText.length < 20) {
            alert("Please enter at least 20 characters.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/exams/evaluate-writing', {
                topic: topic,
                text: userText
            });
            setResult(response.data); 
        } catch (error) {
            console.error("AI Error:", error);
            alert("The AI could not respond.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📝 Writing Exam</h2>
                <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-800 font-medium">✕ Exit</button>
            </div>

            <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-6">
                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <h3 className="text-blue-800 font-bold uppercase text-sm tracking-wide mb-2">Essay Topic</h3>
                    <p className="text-gray-800 text-lg font-medium leading-relaxed">
                        {isTopicLoading ? "Fetching topic..." : topic}
                    </p>
                </div>
            </div>

            <div className="w-full max-w-4xl">
                {!result ? (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <textarea
                            className="w-full h-80 p-6 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg leading-relaxed resize-none bg-gray-50"
                            placeholder="Type your essay here..."
                            value={userText}
                            onChange={(e) => setUserText(e.target.value)}
                        ></textarea>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || isTopicLoading}
                                className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-md ${(isLoading || isTopicLoading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}
                            >
                                {isLoading ? "Analyzing..." : "🚀 Evaluate"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
                        <div className="text-6xl mb-4">🤖</div>
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Analysis Result</h2>
                        <div className="inline-block bg-indigo-50 px-10 py-6 rounded-2xl border border-indigo-100 mb-8">
                            <span className="block text-indigo-600 font-bold uppercase text-sm">Score</span>
                            <span className="text-6xl font-black text-indigo-700">{result.score}/100</span>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 text-left mb-8">
                            <h4 className="font-bold text-gray-800 mb-2">Feedback:</h4>
                            <p className="text-gray-700 whitespace-pre-line">{result.feedback}</p>
                        </div>
                        <button onClick={() => window.location.reload()} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
                            Bring Up a New Topic (Refresh) 🔄
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WritingExam;
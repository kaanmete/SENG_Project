import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Exam = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const skillType = location.state?.skill || "General Test"; 
    const testNumber = location.state?.testNumber || null;

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    
    const [timeLeft, setTimeLeft] = useState(null);
    const [score, setScore] = useState(0);
    const [aiFeedback, setAiFeedback] = useState(""); 
    const [isFinished, setIsFinished] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [loadingText, setLoadingText] = useState("Preparing questions...");
    const [hint, setHint] = useState(null);
    const [hintLoading, setHintLoading] = useState(false);

    // 1. DRAW THE QUESTIONS AND SET THE TIME LIMIT
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                let rawQuestions = [];
                if (skillType === 'Mixed') {
                    const response = await api.get('/exams/start-mixed');
                    rawQuestions = response.data;
                    setTimeLeft(30 * 60); 
                } else {
                    const response = await api.get(`/exams/get-test-questions`, {
                        params: { skill: skillType, test_number: testNumber }
                    });
                    rawQuestions = response.data;
                    setTimeLeft(rawQuestions.length * 90); 
                }

                const validQuestions = rawQuestions.filter(q => {
                    const hasOptions = q.options && Object.keys(q.options).length > 0;
                    let isContentOk = true;
                    if (q.skill_type?.toLowerCase() === 'reading') {
                        if (!q.context_text && !q.paragraph) isContentOk = false;
                    }
                    return hasOptions && isContentOk;
                });

                setQuestions(validQuestions);
                setLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                navigate('/dashboard');
            }
        };
        fetchQuestions();
    }, [skillType, testNumber, navigate]);

    // 2. COUNTDOWN LOGIC AND AUTOMATIC SUBMIT
    useEffect(() => {
        if (timeLeft === null || isFinished) return;

        if (timeLeft === 0) {
            alert("Time is up! Your exam is being submitted.");
            submitExam(userAnswers); 
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isFinished, userAnswers]);

    // HINT (TIP) PULL FUNCTION 
    const handleGetHint = async () => {
        const currentQuestion = questions[currentIndex];
        setHintLoading(true);
        try {
            const response = await api.post('/exams/get-hint', {
                question_text: currentQuestion.question_text,
                options: currentQuestion.options
            });
            setHint(response.data.hint);
        } catch (error) {
            console.error("Hint error:", error);
            setHint("Try focusing on the context clues within the sentence.");
        } finally {
            setHintLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const submitExam = async (finalAnswers) => {
        setLoading(true);
        setLoadingText("AI is analyzing your results..."); 
        try {
            const response = await api.post('/exams/submit', {
                skill_type: skillType,
                difficulty: "Mixed", 
                answers: finalAnswers
            });
            setScore(response.data.score);
            setAiFeedback(response.data.feedback); 
            setIsFinished(true);
        } catch (error) {
            setIsFinished(true); 
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        const currentQuestion = questions[currentIndex];
        const newAnswers = { ...userAnswers, [currentQuestion.id]: selectedOption };
        setUserAnswers(newAnswers);

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setHint(null); // Yeni soruda ipucunu sıfırla
        } else {
            await submitExam(newAnswers);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-blue-600">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <h2 className="text-xl font-bold">{loadingText}</h2>
        </div>
    );

    if (isFinished) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-2xl w-full border border-gray-100">
                    <div className="text-6xl mb-6">🎉</div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Exam Completed!</h2>
                    <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100">
                        <span className="block text-sm text-blue-600 font-bold uppercase tracking-wide mb-1">Your Score</span>
                        <span className="text-7xl font-black text-blue-700">{score}</span>
                    </div>
                    <div className="bg-indigo-50 p-6 rounded-2xl mb-8 border border-indigo-100 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl">🤖</span></div>
                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">🤖</div>
                            <span className="text-sm text-indigo-800 font-bold uppercase tracking-wide">AI Tutor Feedback</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg font-medium relative z-10">
                            {aiFeedback || "Analyzing your performance... Great job on completing the test!"}
                        </p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg transform hover:-translate-y-0.5">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const readingText = currentQuestion?.context_text || currentQuestion?.paragraph;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">
            <div className="w-full max-w-3xl flex justify-between items-end mb-8">
                <div className="flex flex-col">
                    <span className="text-gray-900 font-bold capitalize text-lg">{skillType}</span>
                </div>

                <div className={`flex flex-col items-center px-6 py-2 rounded-2xl shadow-sm border-2 ${timeLeft < 120 ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-white border-gray-100'}`}>
                    <span className={`text-xs font-bold uppercase ${timeLeft < 120 ? 'text-red-600' : 'text-gray-400'}`}>Time</span>
                    <span className={`text-2xl font-black ${timeLeft < 120 ? 'text-red-600' : 'text-blue-600'}`}>{formatTime(timeLeft)}</span>
                </div>

                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">
                    {currentIndex + 1} / {questions.length}
                </span>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg w-full max-w-3xl border border-gray-100">
                {readingText && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500 text-gray-700 text-lg leading-relaxed italic shadow-inner">
                        <h4 className="text-blue-800 font-bold mb-2 not-italic text-sm uppercase tracking-wide">
                            {skillType.toLowerCase() === 'listening' ? '🔊 Audio Script' : '📖 Passage'}
                        </h4>
                        {readingText}
                    </div>
                )}
                
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQuestion?.question_text}</h2>

                {/*  AI HINT BUTTON  */}
                <div className="mb-8">
                    {!hint ? (
                        <button 
                            onClick={handleGetHint}
                            disabled={hintLoading}
                            className="text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border border-amber-200 active:scale-95 shadow-sm"
                        >
                            {hintLoading ? (
                                <><div className="animate-spin h-4 w-4 border-2 border-amber-600 border-t-transparent rounded-full"></div> Thinking...</>
                            ) : (
                                <><span className="text-lg">💡</span> Get a Hint</>
                            )}
                        </button>
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 animate-pulse">
                            <span className="text-xl">💡</span>
                            <div>
                                <h4 className="text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">AI Tutor Hint</h4>
                                <p className="text-amber-900 text-sm italic font-medium">"{hint}"</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {currentQuestion?.options && Object.entries(currentQuestion.options).map(([key, value]) => (
                        <div 
                            key={key} 
                            onClick={() => setSelectedOption(key)} 
                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center ${selectedOption === key ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                            <span className={`w-10 h-10 flex items-center justify-center rounded-full font-bold mr-4 ${selectedOption === key ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{key}</span>
                            <span className="text-lg font-medium">{value}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-end">
                    <button onClick={handleNext} disabled={!selectedOption} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 shadow-md active:scale-95 transition-all">
                        {currentIndex + 1 === questions.length ? 'Finish' : 'Next →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Exam;

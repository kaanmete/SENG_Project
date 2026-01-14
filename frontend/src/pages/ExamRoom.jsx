import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

const ExamRoom = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  // Örnek Soru Havuzu
  const questions = [
    {
      id: 1,
      category: "Grammar & Structure",
      text: "If the software ______ updated yesterday, the system wouldn't be crashing now.",
      options: ["had been", "was", "would be", "is"],
      correct: 0
    },
    {
      id: 2,
      category: "Information Systems Vocabulary",
      text: "Which term describes a system's ability to handle a growing amount of work or its potential to be enlarged?",
      options: ["Interoperability", "Scalability", "Reliability", "Modularity"],
      correct: 1
    }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
    } else {
      navigate('/results'); // Sınav bittiğinde sonuçlara gider
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header - İlerleme ve Zamanlayıcı */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">
              {questions[currentStep].category}
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Question {currentStep + 1} of {questions.length}</h2>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-mono font-bold bg-white px-4 py-2 rounded-xl border border-slate-200">
            <Timer size={18} className="text-red-500" /> 44:52
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-200 rounded-full mb-12 overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
          <p className="text-xl text-slate-800 leading-relaxed mb-10 font-medium">
            "{questions[currentStep].text}"
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left font-semibold ${
                  selectedOption === index 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <span>{option}</span>
                {selectedOption === index && <CheckCircle2 size={20} />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <AlertCircle size={16} />
            <span>Answers are secured and encrypted.</span>
          </div>
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
              selectedOption !== null 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {currentStep === questions.length - 1 ? 'Finish Exam' : 'Next Question'} 
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamRoom;
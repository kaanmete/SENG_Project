import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, LayoutDashboard, Download, CheckCircle, Zap, Loader2, FileText } from 'lucide-react';

const ResultPage = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full mb-4 shadow-inner">
            <Award size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Assessment Completed!</h1>
          <p className="text-slate-500 font-medium">Your AI-generated language proficiency report is ready.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Diagnostic Result</span>
            <div className="text-7xl font-black text-indigo-900 mb-4">B2+</div>
            <p className="text-slate-700 font-semibold mb-6 italic">"Upper-Intermediate Proficiency"</p>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-indigo-600 h-full w-[78%] transition-all duration-1000"></div>
            </div>
            <p className="text-xs text-slate-400 mt-4 font-bold">78% Match with CEFR Standards</p>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Zap className="text-amber-500" size={24} /> AI Diagnostic Feedback
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
                <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-emerald-900 mb-1">Strength: Technical Vocabulary</h4>
                  <p className="text-emerald-800 text-sm leading-relaxed">
                    Excellent command of Information Systems terminology. Your usage of context-specific terms was flawless.
                  </p>
                </div>
              </div>
              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
                <FileText className="text-indigo-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-indigo-900 mb-1">Improvement: Complex Tenses</h4>
                  <p className="text-indigo-800 text-sm leading-relaxed">
                    Focus on mastering Past Perfect Continuous for long-term system processes documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-10 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-sm"
          >
            <LayoutDashboard size={20} /> Back to Dashboard
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg min-w-[280px] justify-center ${
              isDownloaded ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isDownloading ? <Loader2 size={20} className="animate-spin" /> : isDownloaded ? <CheckCircle size={20} /> : <Download size={20} />}
            {isDownloading ? 'Generating Report...' : isDownloaded ? 'Report Downloaded!' : 'Download PDF Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
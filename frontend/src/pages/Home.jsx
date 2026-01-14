import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, BarChart3, ShieldCheck, ArrowRight, BrainCircuit } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <header className="px-10 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-left">
          <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6 inline-block">
            Next Generation Assessment
          </span>
          <h1 className="text-6xl font-black text-slate-900 leading-tight mb-6">
            Evaluate Your English with <span className="text-indigo-600">AI Intelligence.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-10">
            Our Diagnostic Engine uses advanced AI to analyze your language proficiency across all CEFR levels.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition flex items-center gap-3 shadow-2xl shadow-indigo-200"
          >
            Get Started Now <ArrowRight size={20} />
          </button>
        </div>
        <div className="flex-1 bg-slate-50 rounded-[40px] p-12 border border-slate-100 relative">
          <div className="absolute -top-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
            <BrainCircuit size={40} className="text-indigo-600" />
          </div>
          <div className="space-y-6">
            <div className="h-4 w-3/4 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-1/2 bg-slate-200 rounded-full"></div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="h-20 bg-indigo-100 rounded-2xl"></div>
              <div className="h-20 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;
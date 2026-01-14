import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Briefcase, GraduationCap, Plane, Save } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const LearningPurpose = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');

  const purposes = [
    { id: 'academic', title: 'Academic', icon: <GraduationCap />, desc: 'For research & university.' },
    { id: 'business', title: 'Business', icon: <Briefcase />, desc: 'For professional growth.' },
    { id: 'travel', title: 'Travel', icon: <Plane />, desc: 'For tourism and life abroad.' },
    { id: 'general', title: 'General', icon: <Target />, desc: 'For overall fluency.' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Purpose</h1>
          <p className="text-slate-500 italic">Select your primary goal to calibrate the AI Diagnostic Engine.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {purposes.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`p-8 rounded-3xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                selected === item.id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-indigo-100' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                selected === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'
              }`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <button 
          disabled={!selected}
          onClick={() => navigate('/dashboard')}
          className={`flex items-center gap-2 px-12 py-5 rounded-2xl font-bold transition-all shadow-xl ${
            selected ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Save size={20} /> Save & Apply Adaptation
        </button>
      </div>
    </DashboardLayout>
  );
};

export default LearningPurpose;
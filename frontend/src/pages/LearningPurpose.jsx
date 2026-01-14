import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target, Briefcase, GraduationCap, Plane, Save, Loader, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const LearningPurpose = () => {
  const navigate = useNavigate();
  const { updateLearningPurpose, user } = useAuth();
  const [selected, setSelected] = useState(user?.learning_purpose || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const purposes = [
    { id: 'academic', title: 'Academic', icon: <GraduationCap />, desc: 'For research & university.' },
    { id: 'business', title: 'Business', icon: <Briefcase />, desc: 'For professional growth.' },
    { id: 'travel', title: 'Travel', icon: <Plane />, desc: 'For tourism and life abroad.' },
    { id: 'exam', title: 'Exam Preparation', icon: <Target />, desc: 'For test preparation.' },
    { id: 'general', title: 'General', icon: <Target />, desc: 'For overall fluency.' },
  ];

  const handleSave = async () => {
    if (!selected) return;

    setLoading(true);
    setError('');

    try {
      await updateLearningPurpose(selected);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save learning purpose');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Purpose</h1>
          <p className="text-slate-500 italic">Select your primary goal to calibrate the AI Diagnostic Engine.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

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
          disabled={!selected || loading}
          onClick={handleSave}
          className={`flex items-center gap-2 px-12 py-5 rounded-2xl font-bold transition-all shadow-xl ${
            selected && !loading ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} /> Save & Apply Adaptation
            </>
          )}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default LearningPurpose;
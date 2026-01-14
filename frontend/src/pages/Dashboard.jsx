import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUser, mockStats, mockHistory } from '../mocks/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Award, PlayCircle, History, Sparkles, Target } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

  return (
    <DashboardLayout>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {mockUser.fullName}</h1>
          <p className="text-slate-500 italic">Target: <span className="text-indigo-600 font-semibold">{mockUser.learningPurpose}</span></p>
        </div>
        <button 
          onClick={() => navigate('/exam')} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <PlayCircle size={20} /> Start New Exam
        </button>
      </header>

      {/* AI Adaptation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
          <Sparkles className="absolute -right-4 -top-4 text-indigo-400 opacity-20" size={160} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-indigo-100 text-xs font-bold uppercase tracking-widest">
              <Target size={20} /> AI Adaptation Engine
            </div>
            <h3 className="text-xl font-bold mb-2">Personalized Focus</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Analyzing technical terminology and system architecture patterns for you.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex justify-between items-center text-xs mb-2">
                <span>Customization Level</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full"><div className="h-full bg-white w-[85%] rounded-full"></div></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex justify-around items-center text-center">
          <div><p className="text-slate-400 text-xs font-bold uppercase mb-2">Exams</p><h4 className="text-3xl font-black">{mockHistory.length}</h4></div>
          <div className="w-px h-12 bg-slate-100"></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase mb-2">CEFR Level</p><h4 className="text-3xl font-black text-indigo-600">{mockUser.overallLevel}</h4></div>
          <div className="w-px h-12 bg-slate-100"></div>
          <div><p className="text-slate-400 text-xs font-bold uppercase mb-2">Time</p><h4 className="text-3xl font-black">12.5h</h4></div>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Award size={20} className="text-indigo-500" /> Skill Metrics</h3>
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="skill" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={42}>
                  {mockStats.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><History size={20} className="text-indigo-500" /> Recent Activity</h3>
           <div className="space-y-4">
            {mockHistory.map((test) => (
              <div key={test.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:border-indigo-100">
                <div><p className="font-bold text-slate-800 text-sm">{test.type}</p><p className="text-xs text-slate-500">{test.date}</p></div>
                <span className="bg-white px-3 py-1 rounded-full text-indigo-600 font-bold text-xs border border-indigo-100">{test.result}</span>
              </div>
            ))}
           </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, AlertTriangle, Database, ArrowLeft, ShieldCheck, HardDrive } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel = () => {
  const navigate = useNavigate();

  const systemData = [
    { time: '10:00', load: 24 }, { time: '11:00', load: 45 }, { time: '12:00', load: 78 },
    { time: '13:00', load: 52 }, { time: '14:00', load: 38 }, { time: '15:00', load: 42 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 font-mono text-sm">
            <ShieldCheck size={18} className="inline mr-2" /> System Status: Optimal
          </div>
        </div>

        <h1 className="text-3xl font-black mb-10 flex items-center gap-3">
          <Database className="text-indigo-400" /> AI Diagnostic Admin Control
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
            <Users className="text-indigo-400 mb-4" size={24} />
            <p className="text-slate-400 text-sm font-semibold">Total Users</p>
            <h4 className="text-2xl font-bold text-white">1,284</h4>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
            <Activity className="text-amber-400 mb-4" size={24} />
            <p className="text-slate-400 text-sm font-semibold">Avg. Response Time</p>
            <h4 className="text-2xl font-bold text-white">142ms</h4>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
            <AlertTriangle className="text-red-400 mb-4" size={24} />
            <p className="text-slate-400 text-sm font-semibold">System Errors</p>
            <h4 className="text-2xl font-bold text-white">0.02%</h4>
          </div>
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
            <HardDrive className="text-blue-400 mb-4" size={24} />
            <p className="text-slate-400 text-sm font-semibold">Storage Used</p>
            <h4 className="text-2xl font-bold text-white">64.2%</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800 p-8 rounded-3xl border border-slate-700">
            <h3 className="text-lg font-bold mb-6">Server Load (24h)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="load" stroke="#6366f1" strokeWidth={4} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
            <h3 className="text-lg font-bold mb-6">Recent Server Logs</h3>
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border-l-2 border-emerald-500 text-emerald-400">[OK] 15:32:01 - AI Inference Successful</div>
              <div className="p-3 bg-slate-900 rounded-lg border-l-2 border-indigo-500 text-indigo-400">[INFO] 15:30:45 - New user registered</div>
              <div className="p-3 bg-slate-900 rounded-lg border-l-2 border-amber-500 text-amber-400">[WARN] 15:28:12 - Database latency detected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
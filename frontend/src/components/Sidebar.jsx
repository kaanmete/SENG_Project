import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, History, Award, LogOut, Settings } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { id: 'purpose', label: 'Learning Purpose', icon: <Settings size={20} />, path: '/purpose' },
    { id: 'pool', label: 'Personal Test Pool', icon: <BookOpen size={20} />, path: '#' },
    { id: 'history', label: 'Performance History', icon: <History size={20} />, path: '#' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl mb-10 cursor-pointer" onClick={() => navigate('/')}>
          <Award size={28} />
          <span>AI Diagnostic</span>
        </div>
        <nav className="flex flex-col gap-2 text-sm font-medium">
          {menuItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                location.pathname === item.path 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.icon} <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <button 
        onClick={() => navigate('/login')}
        className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition font-semibold text-sm"
      >
        <LogOut size={20} /> <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;
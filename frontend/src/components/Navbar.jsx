import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-100 bg-white">
      <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl cursor-pointer" onClick={() => navigate('/')}>
        <Award size={32} />
        <span>AI Diagnostic</span>
      </div>
      <button 
        onClick={() => navigate('/login')}
        className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
      >
        Sign In
      </button>
    </nav>
  );
};

export default Navbar;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Award, Mail, Lock, ArrowRight, AlertCircle, Loader, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain uppercase, lowercase, and a number');
      setLoading(false);
      return;
    }

    try {
      const result = await register(email, password);
      setSuccess(true);
      // Show success message for 2 seconds before redirecting
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden p-10">
        <div
          className="flex items-center gap-2 text-indigo-600 font-black text-2xl mb-8 justify-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Award size={32} />
          <span>AI Diagnostic</span>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 text-sm">Join the AI-powered assessment platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2 text-green-700">
            <CheckCircle size={18} />
            <div className="text-sm">
              <p className="font-bold">Registration successful!</p>
              <p>Please check your email to verify your account.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-600 focus:bg-white transition-all outline-none font-medium"
              required
              disabled={loading || success}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Create Password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-600 focus:bg-white transition-all outline-none font-medium"
              required
              disabled={loading || success}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-600 focus:bg-white transition-all outline-none font-medium"
              required
              disabled={loading || success}
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Creating account...
              </>
            ) : success ? (
              <>
                <CheckCircle size={18} />
                Redirecting to login...
              </>
            ) : (
              <>
                Register Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Already have an account? <span onClick={() => navigate('/login')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Log In</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
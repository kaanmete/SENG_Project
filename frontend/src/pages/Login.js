import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const navigate = useNavigate();

    // State yönetimi
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/login', formData);

            localStorage.setItem('token', response.data.access_token);
            
            try {
                const userResponse = await api.get('/users/me', {
                    headers: { Authorization: `Bearer ${response.data.access_token}` }
                });
                localStorage.setItem('user', JSON.stringify(userResponse.data));
            } catch (userError) {
                console.error("Kullanıcı bilgisi çekilemedi", userError);
            }

            navigate('/dashboard');

        } catch (err) {
            console.error("Login Hatası:", err);
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center px-4 font-sans">
            
            {/* Ana Kart */}
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                
                {/* Logo ve Başlık */}
                <div className="flex justify-center items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200">
                            AI
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">
                            Diagnostic Engine
                        </span>
                    </div>

                {/* Hata Mesajı */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center
                            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 transform hover:-translate-y-0.5'}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </>
                        ) : (
                            "Log In"  // <-- BURASI GÜNCELLENDİ
                        )}
                    </button>
                </form>

                {/* Alt Linkler */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{' '}
                        <button 
                            onClick={() => navigate('/register')}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Register
                        </button>
                    </p>

                    <button 
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors block mx-auto"
                    >
                        ← Back to Home
                    </button>
                </div>

            </div>
            
            {/* Alt Bilgi */}
            <div className="fixed bottom-6 text-center text-xs text-gray-400">
                © 2026 AI Dıagnostic Engine Project
            </div>
        </div>
    );
};

export default Login;
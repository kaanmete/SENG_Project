import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const navigate = useNavigate();

    // State administration
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Registration Process
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.post('/register', {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                learning_purpose: "general"
            });

            // If successful, it will redirect to the login page.
            alert("Registration successful! Please sign in.");
            navigate('/login');

        } catch (err) {
            console.error("Registration Error:", err);
            const errorMsg = err.response?.data?.detail || 'Registration failed. Please try again.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center px-4 font-sans">
            
            {/* Mother board */}
            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200">
                            AI
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-900">
                            Diagnostic Engine
                        </span>
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join us to master English with AI.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-5">
                    
                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
                            placeholder="John Doe"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength="6"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center
                            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}
                    >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                {/* Sub-links (Return to Login) */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Already have an account?{' '}
                        <button 
                            onClick={() => navigate('/login')}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

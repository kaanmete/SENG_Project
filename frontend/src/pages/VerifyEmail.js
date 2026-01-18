import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            const token = searchParams.get("token");
            
            if (!token) {
                setStatus("error");
                return;
            }

            try {
                // We are calling the endpoint on the backend
                await api.get(`/users/verify-email?token=${token}`);
                setStatus("success");
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
                
                {status === "verifying" && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
                        <h2 className="text-2xl font-black text-gray-800 mb-2">Verifying Email</h2>
                        <p className="text-gray-500">Please wait while we confirm your account...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                            ✅
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Email Verified!</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Your account has been successfully verified. You can now access all features of the AI Diagnostic Engine.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                        >
                            Continue to Login
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                            ❌
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Verification Failed</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            The verification link is invalid or has expired. Please try registering again or contact support.
                        </p>
                        <button 
                            onClick={() => navigate('/register')}
                            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95"
                        >
                            Back to Register
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;

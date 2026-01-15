import React, { useState } from 'react';
import api from '../api/axios'; // Backend bağlantımız
import { useNavigate } from 'react-router-dom'; // Sayfa değiştirmek için

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

  const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 👇 1. Veriyi "Form Data" formatına çeviriyoruz
            const formData = new FormData();
            formData.append('username', email); // Backend 'username' bekler, biz email gönderiyoruz
            formData.append('password', password);

            // 👇 2. Header bilgisini ekleyerek isteği atıyoruz
            const response = await api.post('/login', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Veya 'application/x-www-form-urlencoded'
                }
            });

            // Başarılı olursa token'ı kaydet
            localStorage.setItem('token', response.data.access_token);
            alert("Giriş Başarılı!");
            navigate('/dashboard');

        } catch (error) {
            console.error("Login Hatası:", error);
            alert("Giriş yapılamadı. Lütfen bilgileri kontrol edin.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Giriş Yap 👋</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Adresin" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
                    />
                    <input 
                        type="password" 
                        placeholder="Şifren" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
                        Giriş Yap
                    </button>
                </form>
                <button className="mt-6 text-blue-500 hover:text-blue-700 text-sm font-medium hover:underline" onClick={() => navigate('/register')}>
                    Hesabın yok mu? Kayıt Ol
                </button>
            </div>
        </div>
    );
};

export default Login;
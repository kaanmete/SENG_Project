import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            // Backend'e kullanıcı verilerini gönder
            await api.post('/register', {
                full_name: fullName,
                email: email,
                password: password,
                learning_purpose: "student"
            });
            
            alert("Kayıt Başarılı! 🎉 Giriş yapabilirsin.");
            navigate('/'); // Giriş sayfasına yönlendir

        } catch (error) {
            console.error("Kayıt Hatası:", error);
            alert("Kayıt olunamadı. Bu email kullanılıyor olabilir.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Aramıza Katıl 🚀</h2>
                <form onSubmit={handleRegister}>
                    <input 
                        type="text" 
                        placeholder="Adın Soyadın" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email Adresin" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Şifren" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Kayıt Ol</button>
                </form>
                {/* Giriş sayfasına dönme butonu */}
                <button className="link-btn" onClick={() => navigate('/')}>
                    Zaten hesabın var mı? Giriş Yap
                </button>
            </div>
        </div>
    );
};

export default Register;
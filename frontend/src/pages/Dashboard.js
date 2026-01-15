import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // Kullanıcı adı (Normalde login'den gelir, şimdilik statik veya localStorage'dan alabilirsin)
    const user = { name: "Öğrenci" }; 

    const handleLogout = () => {
        // Çıkış işlemleri
        navigate('/');
    };

    const startExam = (type) => {
        // Exam sayfasına git ve seçilen türü gönder
        navigate('/exam', { state: { skill: type } });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Üst Bar (Header) */}
            <header className="bg-white border-b border-gray-200 h-20 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">🚀 SENG English</h1>
                
                <div className="flex items-center gap-6">
                    <span className="hidden md:block font-medium text-gray-600">Merhaba, {user.name}</span>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-50 text-red-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                        Çıkış
                    </button>
                </div>
            </header>

            {/* Ana İçerik */}
            <main className="max-w-6xl mx-auto py-12 px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Kendini Test Etmeye Hazır mısın?</h2>
                    <p className="text-gray-500 text-lg">Geliştirmek istediğin yeteneği seç ve hemen başla.</p>
                </div>

                {/* Kartlar Izgarası (Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* 1. KELİME BİLGİSİ */}
                    <div 
                        onClick={() => startExam('vocabulary')}
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                            📚
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Kelime Bilgisi</h3>
                        <p className="text-gray-400 text-sm font-medium">Vocabulary</p>
                    </div>

                    {/* 2. DİLBİLGİSİ */}
                    <div 
                        onClick={() => startExam('grammar')}
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-green-50 text-green-600 group-hover:scale-110 transition-transform">
                            ✍️
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Dilbilgisi</h3>
                        <p className="text-gray-400 text-sm font-medium">Grammar</p>
                    </div>

                    {/* 3. OKUMA */}
                    <div 
                        onClick={() => startExam('reading')}
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                            📖
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Okuma</h3>
                        <p className="text-gray-400 text-sm font-medium">Reading</p>
                    </div>

                    {/* 4. DİNLEME (Listening) - YENİ EKLENDİ */}
                    <div 
                        onClick={() => startExam('listening')}
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
                            🎧
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Dinleme</h3>
                        <p className="text-gray-400 text-sm font-medium">Listening (Script)</p>
                    </div>

                    {/* 5. YAZMA (Writing) - YENİ EKLENDİ (Pasif Mod) */}
                    <div 
                        onClick={() => alert("Yapay Zeka (AI) modülü şu an güncelleniyor. Çok yakında writing özelliği aktif olacak! 🚧")}
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-pink-50 text-pink-600 group-hover:scale-110 transition-transform">
                            📝
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Yazma</h3>
                        <p className="text-gray-400 text-sm font-medium">Writing (AI Değerlendirme)</p>
                    </div>

                    {/* 6. İSTATİSTİKLER */}
                    <div 
                        onClick={() => alert("İstatistik sayfası hazırlanıyor...")}
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
                            📊
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">İstatistiklerim</h3>
                        <p className="text-gray-400 text-sm font-medium">Gelişimini Gör</p>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
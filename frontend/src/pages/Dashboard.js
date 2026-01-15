import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = { name: "Öğrenci" }; // İleride backend'den ismini çekeceğiz

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const startExam = (type) => {
        // Alert'i sildik! Artık direkt sınav sayfasına gidiyoruz.
        navigate('/exam', { state: { skill: type } });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Üst Bar */}
            <header className="bg-white border-b border-gray-200 h-20 px-8 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">🚀 SENG English</h1>
                <div className="flex items-center gap-6">
                    <span className="hidden md:block font-medium text-gray-600">Merhaba, {user.name}</span>
                    <button onClick={handleLogout} className="bg-red-50 text-red-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition-colors">
                        Çıkış
                    </button>
                </div>
            </header>

            {/* İçerik */}
            <main className="max-w-6xl mx-auto py-12 px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Kendini Test Etmeye Hazır mısın?</h2>
                    <p className="text-gray-500 text-lg">Geliştirmek istediğin yeteneği seç ve hemen başla.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { id: 'vocabulary', title: 'Kelime Bilgisi', sub: 'Vocabulary', icon: '📚', color: 'bg-blue-50 text-blue-600' },
                        { id: 'grammar', title: 'Dilbilgisi', sub: 'Grammar', icon: '✍️', color: 'bg-green-50 text-green-600' },
                        { id: 'reading', title: 'Okuma', sub: 'Reading', icon: '📖', color: 'bg-purple-50 text-purple-600' },
                        { id: 'stats', title: 'İstatistiklerim', sub: 'Gelişimini Gör', icon: '📊', color: 'bg-orange-50 text-orange-600', action: () => alert("Yakında!") }
                    ].map((item) => (
                        <div key={item.id} onClick={item.action || (() => startExam(item.id))} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                            <p className="text-gray-400 text-sm font-medium">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Backend bağlantımız

const WritingExam = () => {
    const navigate = useNavigate();
    
    // --- STATE'LER ---
    const [topic] = useState("Describe your favorite holiday destination and why you like it."); // Varsayılan konu
    const [userText, setUserText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null); // AI Sonucu buraya gelecek

    // --- SINAVI GÖNDER VE AI'DAN YORUM AL ---
    const handleSubmit = async () => {
        if (userText.length < 20) {
            alert("Lütfen en az 20 karakterlik bir metin yazın.");
            return;
        }

        setIsLoading(true);

        try {
            // Backend'deki Groq entegrasyonuna metni gönderiyoruz
            // NOT: Backend'de bu adresi ('/exams/evaluate-writing') oluşturman gerekecek.
            const response = await api.post('/exams/evaluate-writing', {
                topic: topic,
                text: userText
            });

            // Backend'den şu formatta veri bekliyoruz: { score: 85, feedback: "Gramer harika ama..." }
            setResult(response.data); 

        } catch (error) {
            console.error("AI Hatası:", error);
            alert("Yapay zeka şu an yanıt veremiyor veya sunucu hatası oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">
            
            {/* Üst Kısım: Başlık ve Konu */}
            <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">📝 Writing Exam</h2>
                    <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-800 font-medium">
                        ✕ Çıkış
                    </button>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <h3 className="text-blue-800 font-bold uppercase text-sm tracking-wide mb-2">Essay Konusu (Topic)</h3>
                    <p className="text-gray-800 text-lg font-medium leading-relaxed">
                        {topic}
                    </p>
                </div>
            </div>

            {/* Orta Kısım: Yazı Alanı veya Sonuç Ekranı */}
            <div className="w-full max-w-4xl">
                
                {!result ? (
                    // --- 1. YAZMA ALANI ---
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <textarea
                            className="w-full h-80 p-6 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg leading-relaxed resize-none bg-gray-50"
                            placeholder="Type your essay here..."
                            value={userText}
                            onChange={(e) => setUserText(e.target.value)}
                        ></textarea>

                        <div className="mt-6 flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                                {userText.length} karakter yazıldı
                            </span>
                            
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-md flex items-center gap-2
                                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Groq Analiz Ediyor...
                                    </>
                                ) : (
                                    <>🚀 Değerlendir</>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- 2. SONUÇ ALANI (AI FEEDBACK) ---
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🤖</div>
                            <h2 className="text-3xl font-extrabold text-gray-800">Analiz Tamamlandı!</h2>
                        </div>

                        {/* Puan Kartı */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-indigo-50 px-10 py-6 rounded-2xl text-center border border-indigo-100">
                                <span className="block text-indigo-600 font-bold uppercase text-sm tracking-wider">Writing Puanı</span>
                                <span className="text-6xl font-black text-indigo-700">{result.score}/100</span>
                            </div>
                        </div>

                        {/* Detaylı Yorum */}
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 mb-8">
                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                🔍 Yapay Zeka Yorumu:
                            </h4>
                            <div className="prose text-gray-700 leading-relaxed whitespace-pre-line">
                                {result.feedback}
                            </div>
                        </div>

                        <button 
                            onClick={() => { setResult(null); setUserText(""); }}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
                        >
                            Yeni Bir Essay Yaz
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default WritingExam;